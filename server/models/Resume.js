import mongoose from 'mongoose';

// Single-document collection that always holds the *latest* resume.
const resumeSchema = mongoose.Schema(
    {
        resumeUrl: { type: String, required: true },
        publicId: { type: String, required: true },
        originalName: { type: String },
        // Helps the front-end decide how to render (pdf vs image preview)
        format: { type: String, default: 'pdf' },
    },
    { timestamps: true } // createdAt = uploadedAt, updatedAt = last replaced
);

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
