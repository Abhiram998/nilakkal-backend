const express = require('express');

const adminRouter = require('./admin');
const authRouter = require('./auth');
const occupancyRouter = require('./occupancy');
const zonesRouter = require('./zones');

const router = express.Router();

router.use('/admin', adminRouter);
router.use('/auth', authRouter);
router.use('/occupancy', occupancyRouter);
router.use('/zones', zonesRouter);

module.exports = router;
