import React from 'react';
import { motion } from 'framer-motion';
import { 
    Code2, Database, Layout, Globe, Cpu, Layers, 
    Monitor, Server, Smartphone, Framer, Palette
} from 'lucide-react';

const Skills = () => {
    const skills = [
        { name: 'React.js', level: 90, icon: Layout, color: 'text-blue-400' },
        { name: 'Node.js', level: 85, icon: Server, color: 'text-green-500' },
        { name: 'MongoDB', level: 80, icon: Database, color: 'text-green-400' },
        { name: 'JavaScript', level: 95, icon: Globe, color: 'text-yellow-400' },
        { name: 'Framer', level: 85, icon: Framer, color: 'text-pink-500' },
        { name: 'Canva', level: 90, icon: Palette, color: 'text-cyan-400' },
        { name: 'Tailwind CSS', level: 90, icon: Monitor, color: 'text-cyan-400' },
        { name: 'Express.js', level: 85, icon: Layers, color: 'text-gray-400' },
    ];

    return (
        <section id="skills" className="py-24 bg-white/[0.02]">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h4 className="text-secondary font-orbitron tracking-widest uppercase mb-4">Expertise</h4>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Technical <span className="gradient-text">Proficiency</span></h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        A collection of tools and technologies I use to bring ideas to life. 
                        Constantly learning and evolving with the ecosystem.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {skills.map((skill, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card p-8 group hover:border-secondary/50 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                <skill.icon className="w-16 h-16" />
                            </div>

                            <div className={`${skill.color} mb-6 transition-transform group-hover:scale-110 duration-300`}>
                                <skill.icon className="w-10 h-10" />
                            </div>

                            <h3 className="text-xl font-orbitron font-bold mb-4">{skill.name}</h3>
                            
                            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${skill.level}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-secondary to-accent"
                                />
                            </div>
                            <div className="mt-2 text-right text-xs font-mono text-gray-500">
                                {skill.level}%
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
