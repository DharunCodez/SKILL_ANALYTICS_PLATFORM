const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Import Models
const User = require('./models/User');
const Skill = require('./models/Skill');
const Analytics = require('./models/Analytics');

// Load env vars
dotenv.config();

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    department: 'Management'
  },
  {
    name: 'Faculty One',
    email: 'faculty1@example.com',
    password: 'password123',
    role: 'faculty',
    department: 'Computer Science',
    designation: 'Professor',
    staffId: 'FAC-001'
  },
  {
    name: 'Learner One',
    email: 'learner1@example.com',
    password: 'password123',
    role: 'learner',
    department: 'Computer Science'
  },
  {
    name: 'Learner Two',
    email: 'learner2@example.com',
    password: 'password123',
    role: 'learner',
    department: 'Computer Science'
  }
];

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Clear existing data to avoid duplicates
        await User.deleteMany();
        await Skill.deleteMany();
        await Analytics.deleteMany();
        console.log('Existing DB Cleared!');

        // Hash passwords before using `insertMany` as it bypasses the `pre('save')` hook
        const hashedUsers = await Promise.all(usersData.map(async (user) => {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
            return user;
        }));

        // Insert Users
        const createdUsers = await User.insertMany(hashedUsers);
        console.log('Users inserted!');

        // Find the specific roles
        const faculty = createdUsers.find(u => u.role === 'faculty');
        const learners = createdUsers.filter(u => u.role === 'learner');

        // Assign faculty to learners
        for (let learner of learners) {
            learner.assignedFaculty = faculty._id;
            await learner.save(); // Using save here works because password is not modified
        }
        console.log('Faculty assigned to learners!');

        // Example Skills and Analytics data
        const skillsData = [];
        const analyticsData = [];

        for (let i = 0; i < learners.length; i++) {
            const learnerId = learners[i]._id;
            
            skillsData.push({
                user: learnerId,
                name: 'React.js',
                category: 'Frontend',
                yearsOfExperience: 2,
                score: 85,
                testWebsite: 'HackerRank',
                verified: true
            });
            
            skillsData.push({
                user: learnerId,
                name: 'Node.js',
                category: 'Backend',
                yearsOfExperience: 1,
                score: 75,
                testWebsite: 'LeetCode',
                verified: false
            });

            analyticsData.push({
                user: learnerId,
                totalSkills: 2,
                verifiedSkills: 1,
                averageScore: 80,
                skillGrowth: 15,
                coursesCompleted: 4,
                loginCount: 10
            });
        }

        // Insert Skills and Analytics
        await Skill.insertMany(skillsData);
        await Analytics.insertMany(analyticsData);
        console.log('Skills and Analytics inserted!');

        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDatabase();
