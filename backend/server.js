import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRoute from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

const app = express();
const port = process.env.PORT || 5001;

// Connect to MongoDB BEFORE starting the server
connectDB().then(() => {
    app.use(cors({
        origin: [
            'https://medimeet-frontend-5ivz.onrender.com',
            'https://medimeet-admin-mp4r.onrender.com',
            'http://localhost:5173',
            'http://localhost:5174'
        ],
        credentials: true,
    }));
    app.use(express.json());
    app.use('/api/admin', adminRouter)
    app.use('/api/doctor', doctorRoute)
    app.use('/api/user', userRouter)
    //  localhost:5001/api/admin/add-doctor 
    app.get('/', (req, res) => {
        res.send('API is working!');
    });

    app.listen(port, () =>
        console.log(` Server is running on http://localhost:${port}`)
    );
});
