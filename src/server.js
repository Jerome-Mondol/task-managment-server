import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import taskRoutes from './routes/taskRoutes.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middleware/errorHandler.js'
const PORT = process.env.PORT || 5000
const app = express()

connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.use(errorHandler);

app.get('/', (req, res) => {
    res.send("API is running");
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})





