const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    yearsOfExperience: {
        type: Number,
        default: 0,
    },
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    certifications: [{
        type: String,
    }],
    verified: {
        type: Boolean,
        default: false,
    },
    date: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Skill', skillSchema);
