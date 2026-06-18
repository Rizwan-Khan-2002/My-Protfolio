/**
 * One-time helper: promote a user to admin by email.
 * Usage (from the `server` folder, with a .env containing MONGODB_URI):
 *   node scripts/make-admin.js someone@example.com
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];

if (!email) {
    console.error('❌ Please pass an email:  node scripts/make-admin.js you@example.com');
    process.exit(1);
}

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ email });
        if (!user) {
            console.error(`❌ No user found with email: ${email}`);
            process.exit(1);
        }
        user.role = 'admin';
        await user.save();
        console.log(`✅ ${email} is now an admin.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
};

run();
