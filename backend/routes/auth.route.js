import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";
import { refreshTokenController } from "../controllers/auth.controller.js";
const router = express.Router();
router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/refresh", refreshTokenController);

export default router;
