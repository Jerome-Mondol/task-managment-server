import Task from "../models/Task.js";

export const createNewTask = async(req, res) => {
    try {
        const { title, status, description } = req.body;
        if(!title || !description || !status) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        const task = await Task.create({
            title,
            description,
            status,
            user: req.user.id
        })

        res.status(201).json({ message: "Task created successfully", task });
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({ tasks });
    }
    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status } = req.body;

        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { title, description, status },
            { new: true, runValidators: true }
        );

        if(!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task });
    }

    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}