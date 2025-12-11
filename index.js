// backend/index.js
require('dotenv').config(); // load .env first

const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes/index'); // your routes folder
const db = require('./db'); // your DB helper (must export testConnection())

const app = express();
const PORT = process.env.PORT || 4000;

// --- CORS: allow local dev & your Vercel frontend
app.use(cors({
  origin: [
    'http://localhost:5173',                  // Vite dev server (change if different)
    'https://nilakkal-parking.vercel.app'    // your Vercel production domain
  ],
  credentials: true
}));

app.use(express.json());

// health endpoint
app.get('/', (req, res) => res.send('Backend OK'));

// mount API router under /api (so routes are /api/zones etc.)
if (apiRouter) app.use('/api', apiRouter);

// startup: test DB connection first (non-blocking safe startup)
(async () => {
  try {
    const ok = await db.testConnection(); // make sure your db.js exports this
    if (ok) {
      console.log('✅ MySQL connected OK');
    } else {
      console.error('❌ MySQL connection failed: db.testConnection() returned false');
    }
  } catch (err) {
    console.error('❌ Railway MySQL connection failed:', err && err.message || err);
  }

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
})();
