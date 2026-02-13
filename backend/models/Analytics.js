const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    skillGrowth: {
        type: Number,
        required: true,
    },
    coursesCompleted: {
        type: Number,
        default: 0,
    },
    loginCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Analytics', analyticsSchema);
