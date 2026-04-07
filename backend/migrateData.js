const mongoose = require('mongoose');

// Import your schemas directly
const User = require('./models/User');
const Skill = require('./models/Skill');
const Analytics = require('./models/Analytics');
const Message = require('./models/Message');
const Notification = require('./models/Notification');

// ==========================================
// 1. CONFIGURE YOUR URIS HERE
// ==========================================
const LOCAL_URI = 'mongodb://127.0.0.1:27017/skill-analytics';
const ATLAS_URI = 'mongodb+srv://dharunaug_db_user:dharunm@cluster0.i2390vz.mongodb.net/?appName=Cluster0'; 
// Example: 'mongodb+srv://admin:MyPassword@cluster0.mongodb.net/skill-analytics'

async function migrateData() {
    if (ATLAS_URI === 'YOUR_ATLAS_CONNECTION_STRING_HERE') {
        console.error('❌ Please update the ATLAS_URI variable in the script with your actual Atlas connection string.');
        process.exit(1);
    }

    try {
        // --- STEP 1: Connect to Local & Fetch Data ---
        console.log('⏳ Connecting to Local MongoDB...');
        const localDb = await mongoose.createConnection(LOCAL_URI).asPromise();
        console.log('✅ Connected to Local MongoDB.');

        // Initialize local models
        const LocalUser = localDb.model('User', User.schema);
        const LocalSkill = localDb.model('Skill', Skill.schema);
        const LocalAnalytics = localDb.model('Analytics', Analytics.schema);
        const LocalMessage = localDb.model('Message', Message.schema);
        const LocalNotification = localDb.model('Notification', Notification.schema);

        console.log('⏳ Fetching data from local database...');
        const users = await LocalUser.find().lean();
        const skills = await LocalSkill.find().lean();
        const analytics = await LocalAnalytics.find().lean();
        const messages = await LocalMessage.find().lean();
        const notifications = await LocalNotification.find().lean();

        console.log(`📊 Found: ${users.length} Users, ${skills.length} Skills, ${analytics.length} Analytics, ${messages.length} Messages, ${notifications.length} Notifications.`);

        await localDb.close();
        console.log('🔌 Disconnected from Local MongoDB.');

        // --- STEP 2: Connect to Atlas & Insert Data ---
        console.log('\n⏳ Connecting to Atlas MongoDB...');
        const atlasDb = await mongoose.createConnection(ATLAS_URI).asPromise();
        console.log('✅ Connected to Atlas MongoDB.');

        // Initialize Atlas models
        const AtlasUser = atlasDb.model('User', User.schema);
        const AtlasSkill = atlasDb.model('Skill', Skill.schema);
        const AtlasAnalytics = atlasDb.model('Analytics', Analytics.schema);
        const AtlasMessage = atlasDb.model('Message', Message.schema);
        const AtlasNotification = atlasDb.model('Notification', Notification.schema);

        console.log('🧹 Clearing existing data in Atlas (to prevent duplicates)...');
        await AtlasUser.deleteMany({});
        await AtlasSkill.deleteMany({});
        await AtlasAnalytics.deleteMany({});
        await AtlasMessage.deleteMany({});
        await AtlasNotification.deleteMany({});

        console.log('🚀 Migrating data to Atlas...');
        if (users.length > 0) await AtlasUser.insertMany(users);
        if (skills.length > 0) await AtlasSkill.insertMany(skills);
        if (analytics.length > 0) await AtlasAnalytics.insertMany(analytics);
        if (messages.length > 0) await AtlasMessage.insertMany(messages);
        if (notifications.length > 0) await AtlasNotification.insertMany(notifications);

        console.log('🎉 Data successfully migrated to Atlas!');

        await atlasDb.close();
        console.log('🔌 Disconnected from Atlas MongoDB. Done!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

migrateData();
