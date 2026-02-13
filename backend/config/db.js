const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(`Error connecting to local MongoDB: ${err.message}`);
        console.log('Attempting to use In-Memory MongoDB...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            const conn = await mongoose.connect(uri);
            console.log(`MongoDB Memory Server Connected: ${conn.connection.host}`);
        } catch (memErr) {
            console.error(`Memory Server failed (is it installed?): ${memErr.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
