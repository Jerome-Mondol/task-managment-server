import mongoose from "mongoose";
import Task from "../models/Task.js";
import { encryptText, decryptText } from "../utils/crypto.js";

export const createNewTask = async(req, res) => {
    try {
        const { title, status, description } = req.body;
        const encryptedDescription = encryptText(description);

        const task = await Task.create({
            title,
            description: encryptedDescription,
            status,
            user: req.user.id
        })

        const taskData = task.toObject();
        taskData.description = decryptText(taskData.description);

        res.status(201).json(taskData);
    }
    catch(error){
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const getTasks = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '', search = '' } = req.query;
        const pageNum = Math.max(1, parseInt(page) || 1);
        const limitNum = Math.max(1, parseInt(limit) || 10);
        const skip = (pageNum - 1) * limitNum;

        // Build filter
        const filter = { user: req.user.id };
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (search) {
            filter.title = { $regex: search, $options: 'i' };
        }

        // Get total count and paginated tasks
        const total = await Task.countDocuments(filter);
        const tasks = await Task.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalPages = Math.ceil(total / limitNum);

        // Global counts for sidebar (all tasks for this user)
        const baseFilter = { user: req.user.id };
        const totalAll = await Task.countDocuments(baseFilter);
        const statusAgg = await Task.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: "$status", count: { $sum: 1 } } }
        ]);

        const statusCounts = statusAgg.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const decryptedTasks = tasks.map((task) => {
            const taskObj = task.toObject();
            try {
                taskObj.description = decryptText(taskObj.description);
            } catch (error) {
                taskObj.description = "";
            }
            return taskObj;
        });

        res.status(200).json({ 
            tasks: decryptedTasks,
            pagination: {
                currentPage: pageNum,
                totalPages,
                totalItems: total,
                limit: limitNum
            },
            stats: {
                total: totalAll,
                pending: statusCounts.pending || 0,
                inProgress: statusCounts["in-progress"] || 0,
                completed: statusCounts.completed || 0
            }
        });
    }
    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {};
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.description !== undefined) updateData.description = encryptText(req.body.description);
        if (req.body.status !== undefined) updateData.status = req.body.status;

        const task = await Task.findOneAndUpdate(
            { _id: id, user: req.user.id },
            updateData,
            { new: true, runValidators: true }
        );

        if(!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const taskData = task.toObject();
        try {
            taskData.description = decryptText(taskData.description);
        } catch (error) {
            taskData.description = "";
        }

        res.status(200).json(taskData);
    }

    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });

        if(!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        return res.status(200).json({ message: "Task deleted successfully" });
    }
    catch(error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}
