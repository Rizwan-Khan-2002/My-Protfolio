import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Reveal elements matching `selector` on scroll.
 * Hardened so content can NEVER stay invisible: triggers are refreshed after
 * mount, and a safety timer forces visibility if a trigger never fires
 * (e.g. odd scroll restoration / preloader timing).
 */
export const useScrollReveal = (selector = '.reveal', { y = 40, stagger = 0.1, duration = 0.9 } = {}) => {
    const ref = useRef(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const targets = el.querySelectorAll(selector);
        if (!targets.length) return;

        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
            gsap.set(targets, { opacity: 1, y: 0 });
            return;
        }

        const ctx = gsap.context(() => {
            targets.forEach((target) => {
                gsap.fromTo(
                    target,
                    { opacity: 0, y },
                    {
                        opacity: 1, y: 0, duration, ease: 'power3.out', stagger,
                        scrollTrigger: { trigger: target, start: 'top 88%', once: true },
                    }
                );
            });
        }, el);

        // Recompute trigger positions after layout settles (fonts, images, preloader).
        const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

        // Safety net: if anything is still hidden after 1.6s, just show it.
        const safety = setTimeout(() => {
            targets.forEach((t) => {
                if (parseFloat(getComputedStyle(t).opacity) < 0.05) {
                    gsap.set(t, { opacity: 1, y: 0 });
                }
            });
        }, 1600);

        return () => { cancelAnimationFrame(raf); clearTimeout(safety); ctx.revert(); };
    }, [selector, y, stagger, duration]);

    return ref;
};

export default useScrollReveal;
