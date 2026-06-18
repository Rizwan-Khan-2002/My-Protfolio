import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Decide whether a given email should be admin.
// Rule 1: the configured ADMIN_EMAIL is always admin.
// Rule 2: the very first registered user becomes admin.
const resolveRole = async (email) => {
    if (process.env.ADMIN_EMAIL && email &&
        email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) {
        return 'admin';
    }
    const userCount = await User.countDocuments();
    return userCount === 0 ? 'admin' : 'user';
};

// @desc    Register a new user
// @route   POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Name, email and password are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const role = await resolveRole(email);
        const user = await User.create({ name, email, password, role });

        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('❌ SIGNUP ERROR:', error);
        res.status(500).json({
            message: 'Server error during signup',
            error: error.message,
        });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            // Auto-promote the configured admin email if it isn't admin yet.
            if (
                process.env.ADMIN_EMAIL &&
                user.email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase() &&
                user.role !== 'admin'
            ) {
                user.role = 'admin';
                await user.save();
            }

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('❌ LOGIN ERROR:', error);
        res.status(500).json({ message: 'Server error during login', error: error.message });
    }
});

export default router;
