import { Router } from "express";
const router = Router();
import { loginUser, registerUser, getMe, logoutUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import { loginSchema, registerSchema } from "../validators/authSchemas.js";

router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.get("/me", authMiddleware, getMe);
router.post("/logout", authMiddleware, logoutUser);

export default router;
