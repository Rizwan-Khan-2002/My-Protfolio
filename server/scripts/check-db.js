import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const checkConnection = async () => {
    console.log('🔍 Checking Database Connectivity...');
    console.log(`URI: ${process.env.MONGODB_URI}`);

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ SUCCESS: Connected to MongoDB successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ FAILURE: Could not connect to MongoDB.');
        console.error(`Error: ${error.message}`);
        
        if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 TIP: Your local MongoDB service is not running.');
            console.log('To fix this:');
            console.log('1. Open MongoDB Compass (it often starts the service).');
            console.log('2. Or run: "net start MongoDB" in an Admin Command Prompt.');
            console.log('3. Or ensure you have installed MongoDB locally.');
        } else if (error.message.includes('authentication failed')) {
            console.log('\n💡 TIP: Your credentials are incorrect. Check your .env file.');
        }
        
        process.exit(1);
    }
};

checkConnection();
