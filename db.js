// db.js
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'nilakkal_parking',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// quick test helper you can run with `node db.js` (or called by server start)
async function testConnection() {
  console.log('Using DB config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    name: process.env.DB_NAME
  });
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connected OK');
    conn.release();
    process.exit(0);
  } catch (err) {
    console.error('❌ MySQL connection error:', err.code, err.message);
    process.exit(1);
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = pool;
