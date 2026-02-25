import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Check input data
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user already exists
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        })

        res.status(201).json({ message: "User registered successfully", user: newUser });
    }

    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const loginUser = async(req, res) => {
    try {

        // Check input data
        const { email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Check if password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        )

    

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
        }).status(200).json({
            message: "Login successful",
            token,
        });
    }
    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}