import API from '../services/api';

export const IMAGE_MAX_BYTES = 5 * 1024 * 1024; // 5MB
export const RESUME_MAX_BYTES = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const ALLOWED_RESUME_TYPES = ['application/pdf'];

/**
 * Validate a file before uploading. Returns an error string or null.
 */
export const validateFile = (file, kind = 'image') => {
    if (!file) return 'No file selected';
    if (kind === 'image') {
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return 'Only JPG, PNG or WEBP images are allowed';
        }
        if (file.size > IMAGE_MAX_BYTES) {
            return 'Image must be 5MB or smaller';
        }
    } else if (kind === 'resume') {
        if (!ALLOWED_RESUME_TYPES.includes(file.type)) {
            return 'Resume must be a PDF file';
        }
        if (file.size > RESUME_MAX_BYTES) {
            return 'Resume must be 10MB or smaller';
        }
    }
    return null;
};

/**
 * Upload a file directly to Cloudinary using a server-signed request.
 * The API secret never leaves the backend.
 *
 * @returns {Promise<{url: string, publicId: string, format: string}>}
 */
export const uploadToCloudinary = async (file, kind = 'image', onProgress) => {
    const validationError = validateFile(file, kind);
    if (validationError) throw new Error(validationError);

    // 1. Get a signature from our backend (admin-only endpoint).
    const { data: sig } = await API.post('/upload/signature', {
        folder: kind === 'resume' ? 'resume' : 'projects',
    });

    // 2. Build the multipart form for Cloudinary.
    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sig.apiKey);
    form.append('timestamp', sig.timestamp);
    form.append('signature', sig.signature);
    form.append('folder', sig.folder);

    // PDFs go to the "auto" resource type so they can be downloaded reliably.
    const resourceType = kind === 'resume' ? 'auto' : 'image';
    const endpoint = `https://api.cloudinary.com/v1_1/${sig.cloudName}/${resourceType}/upload`;

    // 3. Upload with progress via XHR (fetch has no upload progress).
    const result = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable && onProgress) {
                onProgress(Math.round((e.loaded / e.total) * 100));
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                let msg = 'Upload failed';
                try {
                    msg = JSON.parse(xhr.responseText)?.error?.message || msg;
                } catch { /* ignore */ }
                reject(new Error(msg));
            }
        };
        xhr.onerror = () => reject(new Error('Network error during upload'));
        xhr.send(form);
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
        format: result.format || (kind === 'resume' ? 'pdf' : 'jpg'),
    };
};

/**
 * Build an optimized Cloudinary delivery URL (auto format + quality).
 * Falls back to the original URL for non-Cloudinary images.
 */
export const optimizedUrl = (url, width = 800) => {
    if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`);
};
