import mongoose from 'mongoose';

const CATEGORIES = ['Beginner', 'Intermediate', 'Advanced'];

const projectSchema = mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        techStack: [String],
        liveDemo: { type: String },
        githubRepo: { type: String },

        // Canonical category field used by the filter UI.
        // NO default on purpose: legacy docs without `category` should fall back
        // to `difficulty` in the UI instead of being forced to "Intermediate".
        category: { type: String, enum: CATEGORIES },
        // Kept in sync with `category` for backward-compatibility with older data.
        difficulty: { type: String, enum: CATEGORIES, default: 'Intermediate' },

        // Image: Cloudinary secure_url + public_id (publicId lets us delete it later).
        image: { type: String },
        imagePublicId: { type: String },

        featured: { type: Boolean, default: false },
        status: { type: String, enum: ['Published', 'Draft'], default: 'Published' },
    },
    { timestamps: true }
);

// Keep category <-> difficulty in sync so both new and legacy readers work.
projectSchema.pre('save', function (next) {
    if (this.isModified('category') && this.category) {
        this.difficulty = this.category;
    } else if (this.isModified('difficulty') && this.difficulty && !this.isModified('category')) {
        this.category = this.difficulty;
    }
    next();
});

const Project = mongoose.model('Project', projectSchema);
export default Project;
export { CATEGORIES };
