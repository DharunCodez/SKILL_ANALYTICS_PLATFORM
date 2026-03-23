const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');

// @desc    Get messages between logged in user and another user
// @route   GET /api/messages/:userId
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
    const otherUserId = req.params.userId;
    const myId = req.user._id;

    const messages = await Message.find({
        $or: [
            { sender: myId, receiver: otherUserId },
            { sender: otherUserId, receiver: myId }
        ]
    }).populate('sender', 'name role').populate('receiver', 'name role').sort({ createdAt: 1 });

    res.status(200).json(messages);
});

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
        res.status(400);
        throw new Error('Please provide receiver and message text');
    }

    const message = await Message.create({
        sender: req.user._id,
        receiver: receiverId,
        text
    });

    const populatedMessage = await message.populate('sender', 'name role');

    res.status(201).json(populatedMessage);
});

module.exports = {
    getMessages,
    sendMessage
};
