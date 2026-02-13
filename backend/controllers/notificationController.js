const asyncHandler = require('express-async-handler');
const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
});

// @desc    Create a notification (Internal/Admin use or automated)
// @route   POST /api/notifications
// @access  Private
const createNotification = asyncHandler(async (req, res) => {
    const { message, type, userId } = req.body;

    // Default to current user if not specified (self-notification) or allow admin to specify
    const targetUserId = userId || req.user.id;

    const notification = await Notification.create({
        user: targetUserId,
        message,
        type
    });
    res.status(201).json(notification);
});

// @desc    Mark as read
// @route   PUT /api/notifications/:id
// @access  Private
const markAsRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error('Notification not found');
    }

    if (notification.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    notification.isRead = true;
    await notification.save();
    res.json(notification);
});

module.exports = {
    getNotifications,
    createNotification,
    markAsRead
};

