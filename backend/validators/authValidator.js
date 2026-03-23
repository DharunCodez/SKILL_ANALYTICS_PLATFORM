const { check } = require('express-validator');

exports.userRegisterValidator = [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Must be a valid email address').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 })
];

exports.userLoginValidator = [
    check('email', 'Must be a valid email address').isEmail(),
    check('password', 'Password is required').notEmpty()
];
