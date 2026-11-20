import { importPKCS8, SignJWT } from "jose";

export interface FirebaseEnv {
  FIREBASE_SERVICE_ACCOUNT?: string;
}

interface ServiceAccount {
  project_id: string;
  client_email: string;
  private_key: string;
}

interface CachedToken {
  token: string;
  expiresAt: number;
}

let cachedToken: CachedToken | null = null;

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/datastore",
  "https://www.googleapis.com/auth/monitoring.read"
].join(" ");

async function getAccessToken(env: FirebaseEnv): Promise<{
  token: string;
  projectId: string;
}> {
  if (!env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("Credenziale Firebase non configurata.");
  }

  let account: ServiceAccount;

  try {
    account = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT);
  } catch {
    throw new Error("Configurazione Firebase non valida.");
  }

  if (!account.project_id || !account.client_email || !account.private_key) {
    throw new Error("Credenziali Firebase incomplete.");
  }

  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return { token: cachedToken.token, projectId: account.project_id };
  }

  const privateKey = await importPKCS8(
    account.private_key.replace(/\\n/g, "\n"),
    "RS256"
  );

  const now = Math.floor(Date.now() / 1000);

  const assertion = await new SignJWT({ scope: GOOGLE_SCOPES })
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .setIssuer(account.client_email)
    .setAudience(TOKEN_URL)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(privateKey);

  const body = new URLSearchParams({
    grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
    assertion
  });

  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  if (!response.ok) {
    cachedToken = null;
    throw new Error(`Autenticazione Google non riuscita (HTTP ${response.status}).`);
  }

  const result = await response.json() as {
    access_token: string;
    expires_in: number;
  };

  cachedToken = {
    token: result.access_token,
    expiresAt: Date.now() + result.expires_in * 1000
  };

  return { token: cachedToken.token, projectId: account.project_id };
}

async function countCollectionDocuments(
  token: string,
  projectId: string,
  collectionId: string
): Promise<number | null> {
  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    "/databases/(default)/documents:runAggregationQuery";

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      structuredAggregationQuery: {
        structuredQuery: {
          from: [{ collectionId }]
        },
        aggregations: [{ count: {}, alias: "total" }]
      }
    })
  });

  if (!response.ok) return null;

  const result = await response.json() as Array<{
    result?: {
      aggregateFields?: {
        total?: { integerValue?: string };
      };
    };
  }>;

  const value = result[0]?.result?.aggregateFields?.total?.integerValue;
  return value === undefined ? null : Number(value);
}


async function getFirestoreUsageMetrics(
  token: string,
  projectId: string
) {
  const metrics = [
    { key: "reads", type: "document/read_ops_count" },
    { key: "writes", type: "document/write_ops_count" },
    { key: "deletes", type: "document/delete_ops_count" }
  ] as const;

  const end = new Date();
  const start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);

  const results: Record<string, number | null> = {};
  const errors: string[] = [];

  for (const metric of metrics) {
    const filter =
      'resource.type = "firestore.googleapis.com/Database" AND ' +
      'resource.labels.database_id = "(default)" AND ' +
      `metric.type = "firestore.googleapis.com/${metric.type}"`;

    const params = new URLSearchParams({
      filter,
      "interval.startTime": start.toISOString(),
      "interval.endTime": end.toISOString(),
      "aggregation.alignmentPeriod": "604800s",
      "aggregation.perSeriesAligner": "ALIGN_SUM",
      "aggregation.crossSeriesReducer": "REDUCE_SUM",
      view: "FULL",
      pageSize: "10000"
    });

    const endpoint =
      `https://monitoring.googleapis.com/v3/projects/${encodeURIComponent(projectId)}` +
      `/timeSeries?${params.toString()}`;

    try {
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        results[metric.key] = null;
        errors.push(`${metric.key}: HTTP ${response.status}`);
        continue;
      }

      const data = await response.json() as {
        timeSeries?: Array<{
          points?: Array<{
            value?: { int64Value?: string };
          }>;
        }>;
      };

      let total = 0;
      let found = false;

      for (const series of data.timeSeries || []) {
        for (const point of series.points || []) {
          const value = point.value?.int64Value;
          if (value !== undefined) {
            total += Number(value);
            found = true;
          }
        }
      }

      results[metric.key] = found ? total : null;
    } catch {
      results[metric.key] = null;
      errors.push(`${metric.key}: errore di rete`);
    }
  }

  return {
    period_days: 7,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    reads: results.reads ?? null,
    writes: results.writes ?? null,
    deletes: results.deletes ?? null,
    available: Object.values(results).some(value => value !== null),
    errors
  };
}

export async function getFirebaseStatus(env: FirebaseEnv) {
  const { token, projectId } = await getAccessToken(env);

  const endpoint =
    `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}` +
    "/databases/(default)/documents:listCollectionIds";

  const collections: string[] = [];
  let pageToken: string | undefined;

  do {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        pageSize: 1000,
        ...(pageToken ? { pageToken } : {})
      })
    });

    if (!response.ok) {
      throw new Error(`Firestore non raggiungibile (HTTP ${response.status}).`);
    }

    const result = await response.json() as {
      collectionIds?: string[];
      nextPageToken?: string;
    };

    collections.push(...(result.collectionIds || []));
    pageToken = result.nextPageToken;
  } while (pageToken);

  const collectionDetails = await Promise.all(
    collections.map(async name => ({
      name,
      documents_count: await countCollectionDocuments(token, projectId, name)
    }))
  );

  const totalDocuments = collectionDetails.every(
    item => item.documents_count !== null
  )
    ? collectionDetails.reduce(
        (total, item) => total + (item.documents_count || 0), 0
      )
    : null;

  const usageMetrics = await getFirestoreUsageMetrics(token, projectId);

  return {
    connected: true,
    project_id: projectId,
    database: "(default)",
    collections,
    collections_count: collections.length,
    collection_details: collectionDetails,
    total_documents: totalDocuments,
    usage_metrics: usageMetrics,
    checked_at: new Date().toISOString()
  };
}
