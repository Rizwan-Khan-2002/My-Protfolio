import React from 'react';
import { Rocket, Heart, Github, Linkedin, Twitter, Globe, ArrowUp } from 'lucide-react';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-primary pt-20 pb-10 border-t border-white/5 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
                    <div className="max-w-xs">
                        <div className="flex items-center justify-center md:justify-start space-x-2 mb-6 group cursor-pointer" onClick={scrollToTop}>
                            <Rocket className="w-8 h-8 text-secondary group-hover:rotate-12 transition-transform" />
                            <span className="text-2xl font-orbitron font-bold gradient-text">RK.</span>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed mb-8">
                            Building digital products that are not just solutions, but experiences. 
                            Specialized in the MERN stack and creative UI/UX.
                        </p>
                        <div className="flex items-center justify-center md:justify-start space-x-4">
                            {[
                                { Icon: Github, href: "https://github.com/Rizwan-Khan-2002" },
                                { Icon: Linkedin, href: "https://www.linkedin.com/in/rizwankhan8756" },
                                { Icon: Twitter, href: "#" },
                                { Icon: Globe, href: "#" }
                            ].map(({ Icon, href }, i) => (
                                <a 
                                    key={i} 
                                    href={href} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="w-9 h-9 border border-white/10 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-secondary hover:bg-secondary/10 transition-all"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-8">
                        <div>
                            <h4 className="font-orbitron text-sm font-semibold mb-6 uppercase tracking-widest text-white/40">Sitemap</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><a href="/" className="hover:text-secondary transition-colors">Home</a></li>
                                <li><a href="#about" className="hover:text-secondary transition-colors">About</a></li>
                                <li><a href="#projects" className="hover:text-secondary transition-colors">Projects</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-orbitron text-sm font-semibold mb-6 uppercase tracking-widest text-white/40">Resources</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li><a href="#" className="hover:text-secondary transition-colors">Resume</a></li>
                                <li><a href="#" className="hover:text-secondary transition-colors">Portfolio PDF</a></li>
                                <li><a href="#" className="hover:text-secondary transition-colors">Case Studies</a></li>
                            </ul>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <h4 className="font-orbitron text-sm font-semibold mb-6 uppercase tracking-widest text-white/40">Contact</h4>
                            <ul className="space-y-4 text-gray-400 text-sm">
                                <li>rizwankhanbara@gmail.com</li>
                                <li>India, Remote</li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-6">
                    <p className="text-gray-500 text-xs flex items-center gap-1">
                        Made with <Heart className="w-3 h-3 text-red-500 animate-pulse" /> by Rizwan Khan © 2026
                    </p>
                    <button 
                        onClick={scrollToTop}
                        className="flex items-center gap-2 text-xs font-orbitron text-gray-500 hover:text-secondary transition-all group"
                    >
                        Scroll up
                        <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                    </button>
                    <div className="flex items-center space-x-6 text-gray-500 text-xs">
                        <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                        <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                    </div>
                </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent" />
        </footer>
    );
};

export default Footer;
