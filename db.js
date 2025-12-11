require("dotenv").config();
const mysql = require("mysql2/promise");

async function getPool() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: 5
  });

  return pool;
}

async function testConnection() {
  try {
    const pool = await getPool();
    await pool.query("SELECT 1");
    console.log("✅ Railway MySQL connected");
    return true;
  } catch (err) {
    console.error("❌ Railway MySQL connection failed:", err.message);
    return false;
  }
}

module.exports = { getPool, testConnection };
