import express from 'express';
import cloudinary, { isCloudinaryConfigured } from '../config/cloudinary.js';
import { isAdmin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// @desc    Generate a signature for a direct (browser -> Cloudinary) upload.
//          This keeps the API secret on the server while letting large files
//          (resumes up to 10MB) bypass Vercel's ~4.5MB serverless body limit.
// @route   POST /api/upload/signature
// @access  Private/Admin
router.post('/signature', isAdmin, (req, res) => {
    try {
        if (!isCloudinaryConfigured()) {
            return res.status(500).json({
                message:
                    'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.',
            });
        }

        const folder = req.body.folder === 'resume' ? 'portfolio/resume' : 'portfolio/projects';
        const timestamp = Math.round(Date.now() / 1000);

        // Only sign the params we actually send from the browser (besides file/api_key/resource_type).
        const paramsToSign = { timestamp, folder };
        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET
        );

        res.json({
            signature,
            timestamp,
            folder,
            apiKey: process.env.CLOUDINARY_API_KEY,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
        });
    } catch (error) {
        console.error('❌ SIGNATURE ERROR:', error);
        res.status(500).json({ message: 'Could not create upload signature', error: error.message });
    }
});

export default router;
