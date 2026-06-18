import express from 'express';
import Resume from '../models/Resume.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { destroyAsset } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Get the latest resume (public — used by the Download button)
// @route   GET /api/resume
// @access  Public
router.get('/', async (req, res) => {
    try {
        const resume = await Resume.findOne().sort({ updatedAt: -1 });
        if (!resume) return res.json(null);
        res.json(resume);
    } catch (error) {
        console.error('❌ RESUME FETCH ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Upload / replace the resume (stores Cloudinary url + publicId)
// @route   POST /api/resume
// @access  Private/Admin
router.post('/', isAdmin, async (req, res) => {
    try {
        const { resumeUrl, publicId, originalName, format } = req.body;
        if (!resumeUrl || !publicId) {
            return res.status(400).json({ message: 'resumeUrl and publicId are required' });
        }

        // Remove any existing resume(s) from Cloudinary + DB (we keep only one).
        const existing = await Resume.find();
        for (const old of existing) {
            await destroyAsset(old.publicId, 'raw');
            await destroyAsset(old.publicId, 'image');
        }
        await Resume.deleteMany({});

        const resume = await Resume.create({
            resumeUrl,
            publicId,
            originalName: originalName || 'resume',
            format: format || 'pdf',
        });

        res.status(201).json(resume);
    } catch (error) {
        console.error('❌ RESUME UPLOAD ERROR:', error);
        res.status(500).json({ message: 'Server error during resume upload', error: error.message });
    }
});

// @desc    Delete the resume (Cloudinary + DB)
// @route   DELETE /api/resume
// @access  Private/Admin
router.delete('/', isAdmin, async (req, res) => {
    try {
        const existing = await Resume.find();
        for (const old of existing) {
            await destroyAsset(old.publicId, 'raw');
            await destroyAsset(old.publicId, 'image');
        }
        await Resume.deleteMany({});
        res.json({ message: 'Resume removed' });
    } catch (error) {
        console.error('❌ RESUME DELETE ERROR:', error);
        res.status(500).json({ message: 'Server error during resume deletion', error: error.message });
    }
});

export default router;
