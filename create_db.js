require("dotenv").config();
const mysql = require("mysql2/promise");

async function main() {
  const cfg = {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
  };

  console.log("Connecting with root-like credentials to create DB:", { host: cfg.host, user: cfg.user });

  let conn;
  try {
    conn = await mysql.createConnection(cfg);
  } catch (err) {
    console.error("❌ Could not connect to MySQL server. Error:", err.message);
    process.exit(1);
  }

  try {
    const dbName = process.env.DB_NAME || "nilakkal";
    // use a template literal here (backticks) — safe inside this JS string
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    console.log("✅ Database created or already exists:", dbName);
  } catch (err) {
    console.error("❌ Error while creating database/user:", err.message);
    process.exit(1);
  } finally {
    if (conn) await conn.end();
  }
}

main().catch(e => { console.error(e); process.exit(1); });