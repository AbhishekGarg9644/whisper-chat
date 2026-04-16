import { Router } from "express";
import { login, signup, getMe } from "../controllers/authController";
import { protectRoute } from "../middleware/auth";

const router = Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);

export default router;
