import { readFile, readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { pool } from "./db.js";

const directory = fileURLToPath(new URL("../../sql/", import.meta.url));
const files = (await readdir(directory)).filter((file) => file.endsWith(".sql")).sort();
for (const file of files) {
  await pool.query(await readFile(`${directory}/${file}`, "utf8"));
  console.log(`Migration appliquée : ${file}`);
}
await pool.end();
