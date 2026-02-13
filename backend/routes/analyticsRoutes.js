const express = require('express');
const router = express.Router();
const Analytics = require('../models/Analytics');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, async (req, res) => {
    try {
        const analytics = await Analytics.findOne({ user: req.user.id });
        res.json(analytics || { message: 'No analytics data found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
