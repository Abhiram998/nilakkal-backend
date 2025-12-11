// index.js
require('dotenv').config(); // load .env for local dev
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

// allow frontend access (replace with your frontend URL in production)
const FRONTEND_URL = process.env.FRONTEND_URL || '*';
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json());

// mount your routes if they exist (adjust paths)
try {
  const apiRouter = require('./routes/index'); // make sure routes/index.js exists
  if (apiRouter) app.use('/api', apiRouter);
} catch (err) {
  // if you don't have routes/index.js then mount individual files:
  // const zones = require('./routes/zones'); app.use('/api/zones', zones);
  console.warn('No central routes/index.js found — ensure routes are mounted.', err.message);
}

(async () => {
  const ok = await db.testConnection();
  if (!ok) {
    console.error('DB connection failed — check env variables or Railway credentials.');
    // Optionally exit here if you want the process to stop:
    // process.exit(1);
  } else {
    console.log('✅ DB OK');
    // If you want to apply schema on first run:
    // await db.applySchemaIfExists();
  }

  app.get('/', (req, res) => res.send('Backend OK'));

  app.listen(PORT, () => {
    console.log(`🚀 Server live at http://localhost:${PORT}`);
  });
})();
