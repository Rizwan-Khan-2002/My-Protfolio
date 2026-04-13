import React, { useEffect, useState } from 'react';
import gsap from 'gsap';

const Preloader = ({ setLoading }) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const count = { val: 0 };
        gsap.to(count, {
            val: 100,
            duration: 2,
            onUpdate: () => setCounter(Math.floor(count.val)),
            onComplete: () => {
                const tl = gsap.timeline();
                tl.to(".counter", { opacity: 0, duration: 0.5 })
                  .to(".preloader-bg", { 
                      height: 0, 
                      duration: 1, 
                      ease: "power4.inOut",
                      onComplete: () => setLoading(false)
                  });
            }
        });

        gsap.fromTo(".loader-bar", 
            { width: "0%" }, 
            { width: "100%", duration: 2, ease: "power2.inOut" }
        );
    }, [setLoading]);

    return (
        <div className="preloader-bg fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white overflow-hidden">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter counter italic">
                    {counter}%
                </h1>
                <div className="w-64 h-1 bg-white/10 relative overflow-hidden rounded-full">
                    <div className="loader-bar absolute top-0 left-0 h-full bg-accent shadow-[0_0_15px_#6366f1]"></div>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] font-medium animate-pulse mt-4">Initializing Matrix</p>
            </div>
        </div>
    );
};

export default Preloader;
