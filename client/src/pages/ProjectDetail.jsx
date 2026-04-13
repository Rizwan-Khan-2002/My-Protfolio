import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Code, Layout, Server } from 'lucide-react';

const ProjectDetail = () => {
    const { id } = useParams();

    // Mock project data - normally fetched from API
    const project = {
        title: "Modern E-commerce Platform",
        description: "A full-scale e-commerce solution with real-time inventory management and secure payment integration.",
        image: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2000&auto=format&fit=crop",
        tags: ["React", "Node.js", "MongoDB", "Tailwind", "Stripe"],
        github: "#",
        demo: "#",
        features: [
            "User authentication and profile management",
            "Complex product filtering and search",
            "Shopping cart with persistence",
            "Stripe payment gateway integration",
            "Admin panel for product and order management"
        ],
        technologies: [
            { name: "Frontend", details: "React with Vite, Tailwind CSS for styling" },
            { name: "Backend", details: "Node.js and Express for RESTful API" },
            { name: "Database", details: "MongoDB with Mongoose ODM" }
        ]
    };

    return (
        <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-accent transition-colors mb-8">
                <ArrowLeft size={20} /> Back to Projects
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-6"
                >
                    <h1 className="text-4xl md:text-5xl font-black text-white italic">{project.title}</h1>
                    <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                            <span key={index} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-accent font-bold uppercase">
                                {tag}
                            </span>
                        ))}
                    </div>
                    <p className="text-lg text-white/70 leading-relaxed">
                        {project.description}
                    </p>

                    <div className="flex gap-4 pt-4">
                        <a href={project.demo} className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-full hover:shadow-[0_0_20px_#6366f1] transition-all">
                            Live Demo <ExternalLink size={18} />
                        </a>
                        <a href={project.github} className="flex items-center gap-2 px-6 py-3 bg-white/5 text-white font-bold rounded-full border border-white/10 hover:bg-white/10 transition-all">
                            Github <Github size={18} />
                        </a>
                    </div>

                    <div className="pt-8 space-y-6">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Key Features</h2>
                        <ul className="space-y-4">
                            {project.features.map((feature, index) => (
                                <li key={index} className="flex items-start gap-3 text-white/60">
                                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2"></div>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="space-y-8"
                >
                    <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                        <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {project.technologies.map((tech, index) => (
                            <div key={index} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-accent/40 transition-colors">
                                <div className="flex items-center gap-3 mb-2">
                                    {index === 0 ? <Layout size={20} className="text-accent" /> : 
                                     index === 1 ? <Server size={20} className="text-accent" /> : 
                                     <Code size={20} className="text-accent" />}
                                    <h3 className="font-bold text-white uppercase tracking-tight">{tech.name}</h3>
                                </div>
                                <p className="text-sm text-white/60">{tech.details}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProjectDetail;
