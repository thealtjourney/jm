import type { Config } from "drizzle-kit";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

/**
 * Migrations prefer a direct (unpooled) connection where one is available.
 * Neon and other poolers can reject the DDL session that drizzle-kit opens.
 */
const url = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!url) {
  throw new Error("Set DATABASE_URL (or DIRECT_URL) before running drizzle-kit.");
}

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url },
} satisfies Config;
