import {
  drizzle as drizzleNode,
  type NodePgDatabase,
} from "drizzle-orm/node-postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { Pool as NodePool } from "pg";
import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import * as schema from "./schema";

/**
 * The driver is chosen at runtime from the connection string:
 *
 *   Neon (*.neon.tech)  -> @neondatabase/serverless over WebSockets. Vercel's
 *     functions cannot hold a TCP pool open between invocations, and this
 *     driver is built for that.
 *
 *   Anything else       -> node-postgres, which is what local development
 *     against a Docker Postgres uses.
 *
 * The WebSocket driver is used rather than Neon's HTTP one because the stage
 * update route runs a real transaction, which neon-http does not support.
 *
 * Set DB_DRIVER=neon|node to override the detection.
 */

export type AppDatabase = NodePgDatabase<typeof schema>;

let client: AppDatabase | null = null;

function isNeon(connectionString: string): boolean {
  const override = process.env.DB_DRIVER;
  if (override === "neon") return true;
  if (override === "node") return false;
  try {
    return new URL(connectionString).hostname.endsWith(".neon.tech");
  } catch {
    return false;
  }
}

/**
 * On a serverless platform every invocation gets its own pool, so a large
 * per-pool ceiling multiplies straight into the database's connection limit.
 */
function poolSize(): number {
  return process.env.VERCEL ? 1 : 5;
}

/**
 * Created on first use rather than at module load, so `next build` can import
 * route modules without a live DATABASE_URL.
 */
function getDb(): AppDatabase {
  if (client) return client;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Copy .env.example to .env.local.");
  }

  if (isNeon(connectionString)) {
    // Node 22+ (and Vercel) provide a global WebSocket; Node 20 does not, so
    // `ws` is imported statically as the fallback rather than required lazily,
    // which would not resolve once this module is bundled as ESM.
    if (typeof globalThis.WebSocket === "undefined") {
      neonConfig.webSocketConstructor = ws;
    }
    const pool = new NeonPool({ connectionString });
    // An idle client that errors emits on the pool. Without a listener that
    // becomes an unhandled exception and takes the whole function down.
    pool.on("error", (error: Error) => {
      console.error("Postgres pool error:", error);
    });
    // The two drivers expose the same query surface for everything used here.
    client = drizzleNeon(pool, { schema }) as unknown as AppDatabase;
    return client;
  }

  // Local development over localhost needs no TLS. A remote Postgres reached
  // through this path is assumed to be managed and to present a chain Node
  // ships no root for, so verification is relaxed while the connection itself
  // stays encrypted.
  const local =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  const pool = new NodePool({
    connectionString,
    ssl: local ? undefined : { rejectUnauthorized: false },
    max: poolSize(),
  });

  pool.on("error", (error) => {
    console.error("Postgres pool error:", error);
  });

  client = drizzleNode(pool, { schema });
  return client;
}

export const db = new Proxy({} as AppDatabase, {
  get(_target, property, receiver) {
    return Reflect.get(getDb(), property, receiver);
  },
});

export { schema };
