const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Message = require('./models/Message');

dotenv.config();

const clearMessages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to clear messages...');
        
        const result = await Message.deleteMany({});
        console.log(`Successfully deleted ${result.deletedCount} messages.`);
        
        process.exit(0);
    } catch (err) {
        console.error('Error clearing messages:', err);
        process.exit(1);
    }
};

clearMessages();
