import express from 'express';
import Project from '../models/Project.js';
import { isAdmin } from '../middleware/adminMiddleware.js';
import { destroyAsset } from '../config/cloudinary.js';

const router = express.Router();

const CATEGORIES = ['Beginner', 'Intermediate', 'Advanced'];

// Validate required fields for create. Returns an array of error messages.
const validateProject = (body) => {
    const errors = [];
    if (!body.title || !body.title.trim()) errors.push('Project title is required');
    if (!body.description || !body.description.trim()) errors.push('Project description is required');
    const category = body.category || body.difficulty;
    if (!category) errors.push('Category is required');
    else if (!CATEGORIES.includes(category)) errors.push('Category must be Beginner, Intermediate or Advanced');
    if (!body.image || !body.image.trim()) errors.push('Project image is required');
    if (!body.liveDemo || !body.liveDemo.trim()) errors.push('Project (live) link is required');
    if (!body.githubRepo || !body.githubRepo.trim()) errors.push('GitHub repository link is required');
    return errors;
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
router.get('/', async (req, res) => {
    try {
        const projects = await Project.find({}).populate('user', 'name').sort({ createdAt: -1 });
        res.json(projects);
    } catch (error) {
        console.error('❌ PROJECTS FETCH ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('user', 'name');
        if (project) {
            res.json(project);
        } else {
            res.status(404).json({ message: 'Project not found' });
        }
    } catch (error) {
        console.error('❌ PROJECT FETCH ERROR:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
router.post('/', isAdmin, async (req, res) => {
    try {
        const errors = validateProject(req.body);
        if (errors.length) {
            return res.status(400).json({ message: errors[0], errors });
        }

        const {
            title, description, techStack, liveDemo, githubRepo,
            category, difficulty, image, imagePublicId, featured, status,
        } = req.body;

        const finalCategory = category || difficulty || 'Intermediate';

        const project = new Project({
            user: req.user._id,
            title,
            description,
            techStack,
            liveDemo,
            githubRepo,
            category: finalCategory,
            difficulty: finalCategory,
            image,
            imagePublicId,
            featured: Boolean(featured),
            status: status || 'Published',
        });

        const createdProject = await project.save();
        res.status(201).json(createdProject);
    } catch (error) {
        console.error('❌ PROJECT CREATION ERROR:', error);
        res.status(400).json({ message: 'Invalid project data', error: error.message });
    }
});

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        const {
            title, description, techStack, liveDemo, githubRepo,
            category, difficulty, image, imagePublicId, featured, status,
        } = req.body;

        // If the image changed, remove the old Cloudinary asset.
        if (image && imagePublicId && project.imagePublicId && imagePublicId !== project.imagePublicId) {
            await destroyAsset(project.imagePublicId, 'image');
        }

        const newCategory = category || difficulty;

        project.title = title ?? project.title;
        project.description = description ?? project.description;
        project.techStack = techStack ?? project.techStack;
        project.liveDemo = liveDemo ?? project.liveDemo;
        project.githubRepo = githubRepo ?? project.githubRepo;
        if (newCategory) {
            project.category = newCategory;
            project.difficulty = newCategory;
        }
        if (image) project.image = image;
        if (imagePublicId) project.imagePublicId = imagePublicId;
        if (typeof featured === 'boolean') project.featured = featured;
        if (status) project.status = status;

        const updatedProject = await project.save();
        res.json(updatedProject);
    } catch (error) {
        console.error('❌ PROJECT UPDATE ERROR:', error);
        res.status(500).json({ message: 'Server error during project update', error: error.message });
    }
});

// @desc    Delete a project (also removes its Cloudinary image)
// @route   DELETE /api/projects/:id
// @access  Private/Admin
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).json({ message: 'Project not found' });

        if (project.imagePublicId) {
            await destroyAsset(project.imagePublicId, 'image');
        }

        await Project.deleteOne({ _id: req.params.id });
        res.json({ message: 'Project removed', _id: req.params.id });
    } catch (error) {
        console.error('❌ PROJECT DELETION ERROR:', error);
        res.status(500).json({ message: 'Server error during project deletion', error: error.message });
    }
});

export default router;
