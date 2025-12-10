const express = require('express');
const db = require('./db');

const zonesRouter = require('./routes/zones');
const occupancyRouter = require('./routes/occupancy');
const adminRouter = require('./routes/admin');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

(async () => {
  const ok = await db.testConnection();
  if (!ok) {
    console.error('❌ DB connection failed — check Railway variables.');
  }

  app.use(express.json());

  // Mount API routes
  app.use("/api/zones", zonesRouter);
  app.use("/api/occupancy", occupancyRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/auth", authRouter);

  // Health Check
  app.get("/", (req, res) => res.send("Backend OK"));

  app.listen(PORT, () => {
    console.log(`🚀 Backend running on port ${PORT}`);
  });
})();
