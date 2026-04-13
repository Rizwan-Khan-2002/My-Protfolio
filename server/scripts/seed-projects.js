import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const projectSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    liveDemo: String,
    githubRepo: String,
    difficulty: String,
    image: String,
}, { timestamps: true });

// Check if model already exists to avoid OverwriteModelError
const Project = mongoose.models.Project || mongoose.model('Project', projectSchema);

const projects = [
    {
        user: '69dd1139fa421b26e7ad3c47',
        title: 'Nexus AI Social Hub',
        description: 'A cutting-edge social media platform with AI-driven content moderation and personalized feed algorithms. Features real-time chat, video sharing, and community-driven groups.',
        techStack: ['React', 'Node.js', 'Socket.io', 'OpenAI'],
        liveDemo: 'https://nexus-ai-hub.demo',
        githubRepo: 'https://github.com/rizwan/nexus-ai',
        difficulty: 'Advanced',
    },
    {
        user: '69dd1139fa421b26e7ad3c47',
        title: 'Quantum Crypto Tracker',
        description: 'Real-time cryptocurrency monitoring suite with high-frequency data fetching. Includes advanced charting, price alerts, and a secure portfolio management system.',
        techStack: ['Next.js', 'Tailwind', 'Chart.js', 'Web3'],
        liveDemo: 'https://quantum-crypto.demo',
        githubRepo: 'https://github.com/rizwan/quantum-crypto',
        difficulty: 'Intermediate',
    },
    {
        user: '69dd1139fa421b26e7ad3c47',
        title: 'Lumina Home Decor',
        description: 'A premium E-commerce platform for high-end furniture and lighting. Includes AR preview features, seamless Stripe checkout, and a robust admin dashboard for inventory management.',
        techStack: ['React', 'Express', 'Stripe', 'Framer Motion'],
        liveDemo: 'https://lumina-decor.demo',
        githubRepo: 'https://github.com/rizwan/lumina-ecommerce',
        difficulty: 'Advanced',
    },
    {
        user: '69dd1139fa421b26e7ad3c47',
        title: 'Titan Fitness Manager',
        description: 'Complete health and workout tracking application. Users can build custom workout plans, track calories using food recognition AI, and compete on global leaderboards.',
        techStack: ['React Native', 'Firebase', 'TensorFlow.js', 'Chart.js'],
        liveDemo: 'https://titan-fitness.demo',
        githubRepo: 'https://github.com/rizwan/titan-fitness',
        difficulty: 'Intermediate',
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to Atlas...');
        
        await Project.deleteMany({ user: '69dd1139fa421b26e7ad3c47' });
        console.log('Cleared existing projects...');

        await Project.insertMany(projects);
        console.log('✅ Successfully added 4 professional dummy projects!');
        
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedDB();
