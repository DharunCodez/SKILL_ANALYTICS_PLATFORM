const express = require('express');
const router = express.Router();
const {
    getUsers,
    deleteUser,
    updateUserRole,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const admin = (req, res, next) => {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'faculty')) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin or faculty');
    }
};

router.route('/').get(protect, admin, getUsers);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id/role').put(protect, admin, updateUserRole);

module.exports = router;
