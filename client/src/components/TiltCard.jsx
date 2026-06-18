import React, { useRef } from 'react';

/**
 * Lightweight 3D tilt wrapper driven by pointer position (no libraries).
 * Respects prefers-reduced-motion via CSS in index.css.
 */
const TiltCard = ({ children, className = '', max = 10, scale = 1.02 }) => {
    const ref = useRef(null);

    const handleMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        const rotateY = (px - 0.5) * max * 2;
        const rotateX = (0.5 - py) * max * 2;
        el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    };

    const reset = () => {
        const el = ref.current;
        if (el) el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
    };

    return (
        <div
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={reset}
            className={`tilt-card ${className}`}
        >
            {children}
        </div>
    );
};

export default TiltCard;
