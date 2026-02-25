import { Router } from "express";
const router = Router();
import { createNewTask, getTasks } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/create", authMiddleware, createNewTask);
router.get("/user-task", authMiddleware, getTasks);

export default router;