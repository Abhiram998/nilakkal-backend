const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    zones: Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      name: `Zone ${i + 1}`,
      occupancy: Math.floor(Math.random() * 100)
    }))
  });
});

module.exports = router;
