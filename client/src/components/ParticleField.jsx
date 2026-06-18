import React, { useRef, useEffect } from 'react';

/**
 * Animated canvas particle field with subtle mouse parallax.
 * GPU-light alternative to a WebGL/three.js scene.
 */
const ParticleField = ({ count = 60, className = '' }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const ctx = canvas.getContext('2d');
        let raf;
        let w = 0;
        let h = 0;
        const mouse = { x: 0, y: 0 };

        const accent = () =>
            getComputedStyle(document.documentElement).getPropertyValue('--color-secondary').trim() || '#8b5cf6';
        let color = accent();

        const resize = () => {
            w = canvas.width = canvas.offsetWidth;
            h = canvas.height = canvas.offsetHeight;
        };
        resize();

        // Mobile is much weaker — use far fewer particles and skip the
        // O(n²) connection-line pass which is the expensive part.
        const isMobile = window.innerWidth < 768;
        const targetCount = reduce ? Math.min(18, count) : (isMobile ? Math.min(22, count) : count);
        const drawLines = !isMobile && !reduce;

        const particles = Array.from({ length: targetCount }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
        }));

        const onMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
        };

        const draw = () => {
            ctx.clearRect(0, 0, w, h);
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx + mouse.x * 0.15;
                p.y += p.vy + mouse.y * 0.15;
                if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
                if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.5;
                ctx.fill();

                // connect nearby particles (skipped on mobile for performance)
                if (drawLines) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const q = particles[j];
                        const dx = p.x - q.x;
                        const dy = p.y - q.y;
                        const dist = dx * dx + dy * dy;
                        if (dist < 9000) {
                            ctx.beginPath();
                            ctx.moveTo(p.x, p.y);
                            ctx.lineTo(q.x, q.y);
                            ctx.strokeStyle = color;
                            ctx.globalAlpha = 0.08;
                            ctx.stroke();
                        }
                    }
                }
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(draw);
        };

        const themeObserver = new MutationObserver(() => { color = accent(); });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', onMove);
        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            themeObserver.disconnect();
        };
    }, [count]);

    return <canvas ref={canvasRef} className={`w-full h-full ${className}`} aria-hidden="true" />;
};

export default ParticleField;
