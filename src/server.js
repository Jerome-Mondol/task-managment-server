import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
const app = express()
import cors from 'cors'
import connectDB from './config/db.js'

const PORT = process.env.PORT || 5000

connectDB();


app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("API is running");
})



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})





