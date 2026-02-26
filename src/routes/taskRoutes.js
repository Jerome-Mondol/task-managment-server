import { Router } from "express";
const router = Router();
import { createNewTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { createTaskSchema, updateTaskSchema } from "../validators/taskSchemas.js";

router.get("/", authMiddleware, getTasks);
router.post("/", authMiddleware, validate(createTaskSchema), createNewTask);
router.put("/:id", authMiddleware, validate(updateTaskSchema), updateTask);
router.delete("/:id", authMiddleware, deleteTask);

export default router;