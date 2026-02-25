import { Router } from "express";
const router = Router();
import { createNewTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";

router.post("/create", authMiddleware, createNewTask);

export default router;