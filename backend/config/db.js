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
            const path = require('path');
            const fs = require('fs');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            
            // Create a persistent local directory for the database
            const dbPath = path.join(__dirname, '..', 'local-mongo-data');
            if (!fs.existsSync(dbPath)) {
                fs.mkdirSync(dbPath, { recursive: true });
            }

            const mongod = await MongoMemoryServer.create({
                instance: {
                    dbPath: dbPath
                }
            });
            const uri = mongod.getUri();
            const conn = await mongoose.connect(uri);
            console.log('\n======================================================');
            console.warn('⚠️  USING PERSISTENT LOCAL MONGODB FALLBACK ⚠️');
            console.warn('Your regular MongoDB connection failed, but we are');
            console.warn(`using a local fallback saved at: ${dbPath}`);
            console.warn('Your data WILL NOT BE LOST when you restart!');
            console.log('======================================================\n');
            console.log(`MongoDB Local Backup Server Connected: ${conn.connection.host}`);
        } catch (memErr) {
            console.error(`Memory Server failed (is it installed?): ${memErr.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
