import express from 'express';
import Project from '../models/Project.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all projects
// @route   GET /api/projects
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({}).populate('user', 'name');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create a project
// @route   POST /api/projects
router.post('/', protect, async (req, res) => {
    try {
        const { title, description, techStack, liveDemo, githubRepo, difficulty, image } = req.body;

        const project = new Project({
            user: req.user._id,
            title,
            description,
            techStack,
            liveDemo,
            githubRepo,
            difficulty,
            image,
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        console.error('❌ PROJECT CREATION ERROR:', error);
        res.status(400).json({ 
            message: 'Invalid project data', 
            error: error.message 
        });
    }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
router.put('/:id', protect, async (req, res) => {
    try {
        const { title, description, techStack, liveDemo, githubRepo, difficulty, image } = req.body;

        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to update this project' });
            }

            project.title = title || project.title;
            project.description = description || project.description;
            project.techStack = techStack || project.techStack;
            project.liveDemo = liveDemo || project.liveDemo;
            project.githubRepo = githubRepo || project.githubRepo;
            project.difficulty = difficulty || project.difficulty;
            project.image = image || project.image;

            const updatedProject = await project.save();
            res.json(updatedProject);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('❌ PROJECT UPDATE ERROR:', error);
        res.status(500).json({ message: 'Server error during project update' });
    }
});

// @desc    Delete a project
// @route   DELETE /api/projects/:id
router.delete('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);

        if (project) {
            if (project.user.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized to delete this project' });
            }

            await Project.deleteOne({ _id: req.params.id });
            res.json({ message: 'Project removed' });
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('❌ PROJECT DELETION ERROR:', error);
        res.status(500).json({ message: 'Server error during project deletion' });
    }
});

export default router;
