import React, { useEffect, useRef } from 'react';

const TransparentImage = ({ src, alt, className, bgColor = { r: 0, g: 0, b: 0 }, threshold = 30 }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const image = new Image();
        image.crossOrigin = "Anonymous";
        image.src = src;
        image.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];

                // Check if color is close to the background color (default black)
                const distance = Math.sqrt(
                    Math.pow(r - bgColor.r, 2) +
                    Math.pow(g - bgColor.g, 2) +
                    Math.pow(b - bgColor.b, 2)
                );

                if (distance < threshold) {
                    data[i + 3] = 0; // Set alpha to 0 (transparent)
                }
            }

            ctx.putImageData(imageData, 0, 0);
        };
    }, [src, bgColor, threshold]);

    return <canvas ref={canvasRef} className={className} aria-label={alt} />;
};

export default TransparentImage;
