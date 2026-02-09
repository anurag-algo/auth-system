import jwt from "jsonwebtoken";
import e from "express";
import User from "../models/user.model.js";
import {
  generateAccessToken,
  generateRRefreshToken,
} from "../utils/generateToken.js";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. validation input
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    // 2. check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 3. create new user
    const user = await User.create({ name, email, password });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. validate user input
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. check if user exists
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 3. compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // 4. generate jwt access token
    const accessToken = generateAccessToken(user._id);

    user.refreshToken = generateRRefreshToken(user._id);
    await user.save();
    // 5. Store token in http only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // 6. send response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const user = await User.findById(decoded.userId);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id);

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Access token refreshed" });
  } catch (error) {
    res.status(401).json({ message: "Refresh failed" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    }

    //clear cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      sameSite: "strict",
    });
    res.clearCokie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: "Server error" });
  }
};
