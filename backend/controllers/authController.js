const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const Skill = require('../models/Skill');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    
    let staffId = undefined;
    if (role === 'faculty') {
        const timestamp = Date.now().toString().slice(-4);
        const randomStr = Math.floor(1000 + Math.random() * 9000).toString();
        staffId = `FAC-${timestamp}-${randomStr}`;
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        staffId,
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            staffId: user.staffId,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            staffId: user.staffId,
            assignedFaculty: user.assignedFaculty,
            token: generateToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

const assignFaculty = asyncHandler(async (req, res) => {
    const { staffId } = req.body;
    
    if (!staffId) {
        res.status(400);
        throw new Error('Please provide a staff ID.');
    }
    
    const faculty = await User.findOne({ staffId, role: 'faculty' });
    if (!faculty) {
        res.status(404);
        throw new Error('Invalid Staff ID. Verification failed.');
    }
    
    req.user.assignedFaculty = faculty._id;
    await req.user.save();
    
    // Return the updated user info to sync frontend
    res.status(200).json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        staffId: req.user.staffId,
        assignedFaculty: req.user.assignedFaculty,
        token: generateToken(req.user._id), // Generate fresh token if needed, though existing one is fine. 
    });
});

const getFacultyStudents = asyncHandler(async (req, res) => {
    if (req.user.role !== 'faculty') {
        res.status(403);
        throw new Error('Not authorized as faculty');
    }
    
    const students = await User.find({ assignedFaculty: req.user._id }).select('-password');
    
    // Fetch their skills and calculate average score
    let studentData = await Promise.all(students.map(async (student) => {
        const skills = await Skill.find({ user: student._id });
        const avgScore = skills.length > 0 
            ? skills.reduce((acc, curr) => acc + curr.score, 0) / skills.length 
            : 0;
            
        return {
            ...student.toObject(),
            skills,
            averageScore: Math.round(avgScore)
        }
    }));
    
    // Sort by averageScore descending
    studentData.sort((a, b) => b.averageScore - a.averageScore);
    
    // Add Rank
    studentData = studentData.map((s, index) => ({
        ...s,
        rank: index + 1
    }));
    
    res.status(200).json(studentData);
});

const getRankInfo = asyncHandler(async (req, res) => {
    if (!req.user.assignedFaculty) {
        return res.status(200).json({ rank: 'N/A', totalStudents: 0 });
    }
    
    // Find all peers under same faculty
    const peers = await User.find({ assignedFaculty: req.user.assignedFaculty });
    
    const peerScores = await Promise.all(peers.map(async (peer) => {
        const skills = await Skill.find({ user: peer._id });
        const avg = skills.length > 0 ? skills.reduce((a, c) => a + c.score, 0) / skills.length : 0;
        return { id: peer._id.toString(), avg };
    }));
    
    // Sort peers
    peerScores.sort((a, b) => b.avg - a.avg);
    
    // Find my rank
    const myRank = peerScores.findIndex(p => p.id === req.user._id.toString()) + 1;
    
    res.status(200).json({
        rank: myRank,
        totalStudents: peerScores.length,
        averageScore: Math.round(peerScores.find(p => p.id === req.user._id.toString())?.avg || 0)
    });
});

const getMyFaculty = asyncHandler(async (req, res) => {
    if (!req.user.assignedFaculty) {
        return res.status(200).json(null);
    }
    
    const faculty = await User.findById(req.user.assignedFaculty).select('name email role staffId');
    res.status(200).json(faculty);
});

module.exports = {
    registerUser,
    loginUser,
    getMe,
    assignFaculty,
    getFacultyStudents,
    getMyFaculty,
    getRankInfo,
};

