import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const isAdmin = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret123');
        const user = await User.findById(decoded.id);

        if (user && user.role === 'admin') {
            req.user = user;
            next();
        } else {
            res.status(403).json({ message: 'Not authorized as an admin' });
        }
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
