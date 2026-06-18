import { v2 as cloudinary } from 'cloudinary';

// Cloudinary is configured from environment variables:
//   CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const isCloudinaryConfigured = () =>
    Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
    );

// Safely destroy an asset by public_id. Never throws – returns a result object.
export const destroyAsset = async (publicId, resourceType = 'image') => {
    if (!publicId || !isCloudinaryConfigured()) return { skipped: true };
    try {
        return await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch (error) {
        console.error('⚠️  Cloudinary destroy failed:', error?.message || error);
        return { error: error?.message || 'destroy failed' };
    }
};

export default cloudinary;
