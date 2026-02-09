import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/role.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";
import { refreshTokenController } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/register", registerUser);

router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshTokenController);

router.get(
  "/admin/dashboard",
  authMiddleware,
  authorizeRoles("admin"),
  (req, res) => {
    res.json({ message: "Welcome to the admin dashboard!" });
  },
);

export default router;
