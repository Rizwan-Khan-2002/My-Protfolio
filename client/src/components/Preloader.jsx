import React, { useEffect, useState } from 'react';

const Preloader = ({ setLoading }) => {
    const [counter, setCounter] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => setLoading(false), 250);
                    return 100;
                }
                return prev + 10;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [setLoading]);

    return (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center text-white">
            <div className="flex flex-col items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic">
                    {counter}%
                </h1>
                <div className="w-64 h-1 bg-white/10 relative overflow-hidden rounded-full">
                    <div 
                        className="absolute top-0 left-0 h-full bg-[#6366f1] transition-all duration-300 shadow-[0_0_15px_#6366f1]"
                        style={{ width: `${counter}%` }}
                    ></div>
                </div>
                <p className="text-xs uppercase tracking-[0.3em] font-medium animate-pulse mt-4">Initializing Portfolio</p>
            </div>
        </div>
    );
};

export default Preloader;
