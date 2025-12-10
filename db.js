// backend/db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

function parseMysqlUrl(urlString) {
  try {
    const url = new URL(urlString);
    const user = decodeURIComponent(url.username);
    const password = decodeURIComponent(url.password);
    const host = url.hostname;
    const port = url.port ? Number(url.port) : 3306;
    // pathname begins with '/', remove it
    const database = url.pathname ? url.pathname.replace(/^\//, '') : undefined;
    return { host, port, user, password, database };
  } catch (err) {
    return null;
  }
}

function getConfigFromEnv() {
  // Priority 1: DATABASE_URL (common)
  const url = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.RAILWAY_DATABASE_URL;
  if (url) {
    const parsed = parseMysqlUrl(url);
    if (parsed) return {
      host: parsed.host,
      port: parsed.port,
      user: parsed.user,
      password: parsed.password,
      database: parsed.database
    };
  }

  // Fallback to individual env vars
  return {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'nilakkal'
  };
}

const cfg = getConfigFromEnv();
console.log('Using DB config:', { host: cfg.host, port: cfg.port, user: cfg.user, name: cfg.database ? cfg.database : '<none>' });

const pool = mysql.createPool({
  host: cfg.host,
  port: cfg.port,
  user: cfg.user,
  password: cfg.password,
  database: cfg.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // optional: set timezone/charset if needed
  // timezone: '+00:00',
  // charset: 'utf8mb4'
});

async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    // optional: run a quick query
    const [rows] = await conn.query('SELECT 1 AS ok');
    console.log('\x1b[32m%s\x1b[0m', '✅ MySQL connected OK'); // green
    return true;
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

// Optional helper to run SQL from a file (schema.sql)
const fs = require('fs').promises;
async function applySchemaIfExists(schemaPath = './sql/schema.sql') {
  try {
    const data = await fs.readFile(schemaPath, 'utf8');
    if (!data.trim()) return;
    // split statements naively by ';' - works for simple schema files
    const statements = data.split(';').map(s => s.trim()).filter(Boolean);
    const conn = await pool.getConnection();
    try {
      for (const s of statements) {
        await conn.query(s);
      }
      console.log('✅ Applied schema from', schemaPath);
    } finally {
      conn.release();
    }
  } catch (err) {
    if (err.code === 'ENOENT') {
      // no schema file — that's fine
      return;
    }
    console.error('Error applying schema:', err.message);
  }
}

module.exports = {
  pool,
  query: (...args) => pool.query(...args), // convenience
  testConnection,
  applySchemaIfExists,
};
