import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Send, MapPin, Mail, Phone, 
    Linkedin, Github, Twitter, MessageSquare 
} from 'lucide-react';
import robotImg from '../assets/contact-robot.png';
import API from '../services/api';
import TransparentImage from './TransparentImage';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState('');

    const socialLinks = [
        { icon: <Github size={20} />, url: "https://github.com/Rizwan-Khan-2002" },
        { icon: <Linkedin size={20} />, url: "https://www.linkedin.com/in/rizwankhan8756" },
        { icon: <MessageSquare size={20} />, url: "https://wa.me/918009030734" },
        { icon: <Twitter size={20} />, url: "#" }
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        
        try {
            const response = await API.post('/contact', formData);
            if (response.status === 200 || response.status === 201) {
                setStatus('Message Sent! I will get back to you soon.');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            console.error('Contact error:', error);
            setStatus('Failed to send message. Please try again later.');
        }
    };

    return (
        <section id="contact" className="py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="hero-glow bg-secondary top-1/2 -right-60 scale-150 opacity-10" />
            
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h4 className="text-secondary font-orbitron tracking-widest uppercase mb-4">Connect</h4>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Get in <span className="gradient-text">Touch.</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Whether you have a project in mind, a question, or just want to say hi, 
                        my inbox is always open. Let's build something amazing together!
                    </p>
                </div>

                <div className="grid lg:grid-cols-[0.7fr_1.3fr] gap-12 items-start relative">
                    {/* Robot Mascot - Positioned between boxes */}
                    <div className="absolute left-[33%] top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden lg:block pointer-events-none">
                        <motion.div 
                            animate={{ 
                                y: [-15, 15, -15],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-48 h-48"
                        >
                            <TransparentImage 
                                src={robotImg} 
                                alt="Contact Robot" 
                                className="w-full h-full object-contain filter drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]" 
                                threshold={45}
                            />
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="glass-card p-8 relative z-10">
                            <h3 className="text-2xl font-orbitron mb-8">Contact Information</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                        <Mail size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-bold">Email Me</p>
                                        <p className="text-sm font-medium">rizwankhanbara@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                        <MapPin size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-bold">Location</p>
                                        <p className="text-sm font-medium">Remote / India</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                        <Phone size={20} />
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-widest text-white/40 mb-1 font-bold">Mobile</p>
                                        <p className="text-sm font-medium">+91 8009030734</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {socialLinks.map((social, index) => (
                                <motion.a
                                    key={index}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ y: -5, scale: 1.1 }}
                                    className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-accent hover:border-accent transition-all duration-500"
                                >
                                    {social.icon}
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <form onSubmit={handleSubmit} className="glass-card p-10 space-y-6 relative z-10">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-medium">Your Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-secondary outline-none transition-colors"
                                        placeholder="John Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 font-medium">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-secondary outline-none transition-colors"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium">Subject</label>
                                <input 
                                    type="text" 
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:border-secondary outline-none transition-colors"
                                    placeholder="Project Inquiry"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 font-medium">Message</label>
                                <textarea 
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 focus:border-secondary outline-none transition-colors resize-none"
                                    placeholder="Tell me about your project..."
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full py-4 flex items-center justify-center gap-2 group">
                                {status || 'Send Message'}
                                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default Contact;
