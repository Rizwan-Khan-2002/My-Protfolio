/**
 * One-time migration: copy `difficulty` -> `category` for any project that
 * doesn't have a category yet. Run from the `server` folder with a .env
 * containing MONGODB_URI:
 *   node scripts/migrate-categories.js
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from '../models/Project.js';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const projects = await Project.find({});
        let updated = 0;
        for (const p of projects) {
            if (!p.category && p.difficulty) {
                p.category = p.difficulty;
                await p.save();
                updated++;
            }
        }
        console.log(`✅ Migration complete. Updated ${updated} of ${projects.length} projects.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration error:', err.message);
        process.exit(1);
    }
};

run();
