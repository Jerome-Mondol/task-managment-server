import { Router } from "express";
const router = Router();
import { loginUser, registerUser } from "../controllers/authController.js";

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;