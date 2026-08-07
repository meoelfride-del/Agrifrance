import { app } from "./app.js";
import { env } from "./config.js";
import { pool } from "./database/db.js";

const server=app.listen(env.PORT,()=>console.log(`AgriFrance API prête sur le port ${env.PORT}`));
async function shutdown(){ server.close(async()=>{await pool.end();process.exit(0);}); }
process.on("SIGINT",shutdown); process.on("SIGTERM",shutdown);
