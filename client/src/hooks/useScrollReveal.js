import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal direct children (or elements matching `selector`) on scroll.
 * Returns a ref to attach to the container.
 */
export const useScrollReveal = (selector = '.reveal', { y = 40, stagger = 0.12, duration = 0.9 } = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const targets = el.querySelectorAll(selector);
        if (!targets.length || reduce) return;

        const ctx = gsap.context(() => {
            targets.forEach((target) => {
                gsap.fromTo(
                    target,
                    { opacity: 0, y },
                    {
                        opacity: 1,
                        y: 0,
                        duration,
                        ease: 'power3.out',
                        stagger,
                        scrollTrigger: {
                            trigger: target,
                            start: 'top 85%',
                            toggleActions: 'play none none none',
                        },
                    }
                );
            });
        }, el);

        return () => ctx.revert();
    }, [selector, y, stagger, duration]);

    return ref;
};

export default useScrollReveal;
