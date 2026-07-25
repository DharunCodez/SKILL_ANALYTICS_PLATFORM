const mongoose = require('mongoose');

const connectDB = async () => {
    const isProd = process.env.NODE_ENV === 'production';

    const connectWithUri = async (uri) => {
        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: isProd ? 10000 : 3000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            family: 4
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB reconnected');
        });
    };

    if (process.env.MONGO_URI) {
        try {
            await connectWithUri(process.env.MONGO_URI);
            return;
        } catch (err) {
            if (isProd) {
                console.error(`❌ MongoDB connection failed in production: ${err.message}`);
                process.exit(1);
            }
            console.warn(`⚠️ Failed to connect using MONGO_URI: ${err.message}`);
            console.warn('➡️ Falling back to local in-memory database...');
        }
    } else {
        if (isProd) {
            console.error('❌ MONGO_URI is not defined in production.');
            process.exit(1);
        }
        console.warn('⚠️ MONGO_URI is not defined. Falling back to in-memory database...');
    }

    // Local dev fallback: use in-memory MongoDB
    console.log('Starting in-memory database fallback...');
    try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const { seedInMemoryDB } = require('./seedHelper');

        const mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        console.log(`MongoMemoryServer started at: ${uri}`);

        await connectWithUri(uri);
        console.log('✅ Connected successfully to local in-memory MongoDB!');

        console.log('Seeding in-memory database...');
        await seedInMemoryDB();
        console.log('✅ In-memory database seeded successfully!');
    } catch (serverErr) {
        console.error(`❌ Failed to start MongoMemoryServer: ${serverErr.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
