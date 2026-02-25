import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser'
import authMiddleware from './middleware/authMiddleware.js'

app.use(cookieParser());

const PORT = process.env.PORT || 5000

connectDB();


app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
    res.send("API is running");
})

app.get('/data', authMiddleware, (req, res) => {
    res.json({ message: "This is protected data", user: req.user });
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})





