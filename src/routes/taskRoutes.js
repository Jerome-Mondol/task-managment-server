import { Router } from "express";
const router = Router();
import { createNewTask, getTasks, updateTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/create", authMiddleware, createNewTask);
router.get("/user-task", authMiddleware, getTasks);
router.put("/update/:id", authMiddleware, updateTask);

export default router;