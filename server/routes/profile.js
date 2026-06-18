import express from 'express';
import Profile from '../models/Profile.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { destroyAsset } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Get the profile (public). Returns null if not created yet.
// @route   GET /api/profile
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.findOne();
        res.json(profile);
    } catch (error) {
        console.error('❌ PROFILE FETCH ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create/update the profile (admin). Upsert single document.
// @route   PUT /api/profile
router.put('/', isAdmin, async (req, res) => {
    try {
        const data = req.body || {};
        let profile = await Profile.findOne();

        // If the photo changed, remove the old Cloudinary asset.
        if (
            profile &&
            data.photoPublicId &&
            profile.photoPublicId &&
            data.photoPublicId !== profile.photoPublicId
        ) {
            await destroyAsset(profile.photoPublicId, 'image');
        }

        if (!profile) {
            profile = new Profile(data);
        } else {
            Object.assign(profile, data);
        }

        const saved = await profile.save();
        res.json(saved);
    } catch (error) {
        console.error('❌ PROFILE UPDATE ERROR:', error);
        res.status(500).json({ message: 'Server error during profile update', error: error.message });
    }
});

export default router;
