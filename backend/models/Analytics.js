const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalSkills: {
        type: Number,
        default: 0,
    },
    verifiedSkills: {
        type: Number,
        default: 0,
    },
    averageScore: {
        type: Number,
        default: 0,
    },
    skillGrowth: {
        type: Number,
        default: 0,
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
