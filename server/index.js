import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import contactRoutes from './routes/contact.js';
import adminRoutes from './routes/admin.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:5173', 
    'http://localhost:3000',
    'https://rizwan-portfolio.vercel.app' // You can update this later
];

app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Temporarily allow for debugging if needed, or stick to strict
        }
    },
    credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
}

export default app;
