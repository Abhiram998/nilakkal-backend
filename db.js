require("dotenv").config();
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log("✅ MySQL connected OK");
    conn.release();
    return true;
  } catch (err) {
    console.error("❌ Railway MySQL connection failed:", err.message);
    return false;
  }
}

module.exports = { pool, testConnection };
