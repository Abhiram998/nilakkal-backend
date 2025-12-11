const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;

(async () => {
  const ok = await db.testConnection();
  if (!ok) {
    console.error('DB connection failed — check env variables or Railway credentials.');
  }

  app.use(express.json());

  app.get('/', (req, res) => res.send('Backend OK'));

  app.listen(PORT, () => {
    console.log(`Backend running at http://localhost:${PORT}`);
  });
})();
