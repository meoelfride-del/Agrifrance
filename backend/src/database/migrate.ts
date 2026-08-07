import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const file = fileURLToPath(new URL("../../sql/001_initial.sql", import.meta.url));
await pool.query(await readFile(file, "utf8"));
console.log("Migration PostgreSQL terminée.");
await pool.end();
