import mongoose from 'mongoose';

const projectSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    description: { type: String, required: true },
    techStack: [String],
    liveDemo: { type: String },
    githubRepo: { type: String },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    image: { type: String },
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
export default Project;
