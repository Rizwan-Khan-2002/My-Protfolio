import mongoose from 'mongoose';

const eduSchema = new mongoose.Schema(
    {
        degree: String,
        institution: String,
        period: String,
        description: String,
    },
    { _id: false }
);

const expSchema = new mongoose.Schema(
    {
        role: String,
        company: String,
        period: String,
        description: String,
    },
    { _id: false }
);

const skillSchema = new mongoose.Schema(
    {
        name: String,
        level: { type: Number, default: 80 },
    },
    { _id: false }
);

// Singleton document holding all "about me" / resume content.
const profileSchema = new mongoose.Schema(
    {
        name: { type: String, default: 'Rizwan Khan' },
        title: { type: String, default: 'MERN Stack Developer' },
        tagline: { type: String, default: '' },
        bio: { type: String, default: '' },

        photoUrl: { type: String, default: '' },
        photoPublicId: { type: String, default: '' },

        location: { type: String, default: '' },
        email: { type: String, default: '' },
        phone: { type: String, default: '' },
        available: { type: Boolean, default: true },

        socials: {
            github: { type: String, default: '' },
            linkedin: { type: String, default: '' },
            twitter: { type: String, default: '' },
            whatsapp: { type: String, default: '' },
            website: { type: String, default: '' },
        },

        stats: {
            experienceYears: { type: String, default: '3+' },
            projectsCompleted: { type: String, default: '20+' },
            happyClients: { type: String, default: '15+' },
        },

        education: { type: [eduSchema], default: [] },
        experience: { type: [expSchema], default: [] },
        skills: { type: [skillSchema], default: [] },
    },
    { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;
