const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, assignFaculty, getFacultyStudents, getMyFaculty, getRankInfo } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { userRegisterValidator, userLoginValidator } = require('../validators/authValidator');
const { runValidation } = require('../middleware/validationMiddleware');

router.post('/register', userRegisterValidator, runValidation, registerUser);
router.post('/login', userLoginValidator, runValidation, loginUser);
router.get('/me', protect, getMe);
router.post('/assign-faculty', protect, assignFaculty);
router.get('/faculty-students', protect, getFacultyStudents);
router.get('/my-faculty', protect, getMyFaculty);
router.get('/rank', protect, getRankInfo);

module.exports = router;
