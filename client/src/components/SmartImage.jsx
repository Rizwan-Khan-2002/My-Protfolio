import React, { useState } from 'react';
import { optimizedUrl } from '../utils/cloudinary';

// Inline SVG placeholder used when an image is missing or fails to load.
export const FALLBACK_IMAGE =
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
        `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
            <defs>
                <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
                    <stop offset='0' stop-color='#1e1b4b'/>
                    <stop offset='1' stop-color='#0a0a0a'/>
                </linearGradient>
            </defs>
            <rect width='800' height='500' fill='url(#g)'/>
            <text x='50%' y='50%' fill='#8b5cf6' font-family='Arial' font-size='28' font-weight='bold'
                text-anchor='middle' dominant-baseline='middle' letter-spacing='4'>PROJECT PREVIEW</text>
        </svg>`
    );

/**
 * Image with:
 *  - automatic Cloudinary optimization (f_auto,q_auto,resize)
 *  - skeleton shimmer while loading
 *  - graceful fallback when the URL is broken/missing
 */
const SmartImage = ({ src, alt = '', className = '', width = 800, ...rest }) => {
    const [loaded, setLoaded] = useState(false);
    const [failed, setFailed] = useState(false);

    const resolved = failed || !src ? FALLBACK_IMAGE : optimizedUrl(src, width);

    return (
        <div className={`relative w-full h-full ${!loaded ? 'skeleton' : ''}`}>
            <img
                src={resolved}
                alt={alt}
                loading="lazy"
                decoding="async"
                onLoad={() => setLoaded(true)}
                onError={() => { setFailed(true); setLoaded(true); }}
                className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                {...rest}
            />
        </div>
    );
};

export default SmartImage;
