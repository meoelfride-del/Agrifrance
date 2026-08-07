import pg from "pg";
import { env } from "../config.js";

export const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 20,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: true } : undefined
});

export async function query<T extends pg.QueryResultRow>(text: string, values: unknown[] = []) {
  return pool.query<T>(text, values);
}
