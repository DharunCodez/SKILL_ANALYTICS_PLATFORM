const asyncHandler = require('express-async-handler');
const Skill = require('../models/Skill');
const User = require('../models/User');

// @desc    Get skills
// @route   GET /api/skills
// @access  Private
const getSkills = asyncHandler(async (req, res) => {
    const skills = await Skill.find({ user: req.user.id });
    res.status(200).json(skills);
});

// @desc    Set skill
// @route   POST /api/skills
// @access  Private
const setSkill = asyncHandler(async (req, res) => {
    const { name, category, level, score } = req.body;

    if (!name || score === undefined || score === null) {
        res.status(400);
        throw new Error('Please add skill name and proficiency score');
    }

    // Check for duplicate skill (case-insensitive)
    const skillExists = await Skill.findOne({
        user: req.user.id,
        name: { $regex: new RegExp(`^${name}$`, 'i') }
    });

    if (skillExists) {
        res.status(400);
        throw new Error('Skill already exists');
    }

    const skill = await Skill.create({
        name,
        category: category || 'Technical',
        level: level || 1,
        score,
        user: req.user.id,
    });

    res.status(200).json(skill);
});

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        res.status(400);
        throw new Error('Skill not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the skill user
    if (skill.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Check for duplicate name if name is being updated
    if (req.body.name) {
        const skillExists = await Skill.findOne({
            user: req.user.id,
            name: { $regex: new RegExp(`^${req.body.name}$`, 'i') },
            _id: { $ne: req.params.id }
        });

        if (skillExists) {
            res.status(400);
            throw new Error('Skill name already exists');
        }
    }

    const updatedSkill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedSkill);
});

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = asyncHandler(async (req, res) => {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        res.status(400);
        throw new Error('Skill not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the skill user
    if (skill.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await skill.deleteOne();

    res.status(200).json({ id: req.params.id });
});

module.exports = {
    getSkills,
    setSkill,
    updateSkill,
    deleteSkill,
};

