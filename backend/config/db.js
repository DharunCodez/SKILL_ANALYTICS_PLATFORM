const mongoose = require('mongoose');

const connectDB = async () => {
    const isProd = process.env.NODE_ENV === 'production';

    if (!process.env.MONGO_URI) {
        console.error('❌ MONGO_URI is not defined.');
        process.exit(1);
    }

    try {
        console.log('Connecting to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: isProd ? 10000 : 3000,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        if (isProd) {
            // In production, never fall back — crash so Render can restart and alert
            console.error(`❌ MongoDB connection failed in production: ${err.message}`);
            process.exit(1);
        }

        // Local dev fallback: use in-memory MongoDB
        console.warn(`⚠️ Could not connect to Atlas: ${err.message}`);
        console.log('Starting in-memory database fallback...');
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const { seedInMemoryDB } = require('./seedHelper');

            const mongoServer = await MongoMemoryServer.create();
            const uri = mongoServer.getUri();
            console.log(`MongoMemoryServer started at: ${uri}`);

            await mongoose.connect(uri);
            console.log('✅ Connected successfully to local in-memory MongoDB!');

            console.log('Seeding in-memory database...');
            await seedInMemoryDB();
            console.log('✅ In-memory database seeded successfully!');
        } catch (serverErr) {
            console.error(`❌ Failed to start MongoMemoryServer: ${serverErr.message}`);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
