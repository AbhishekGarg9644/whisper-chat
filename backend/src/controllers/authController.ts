import type { NextFunction, Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { User } from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: "7d" });
};

export async function getMe(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already taken" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id.toString());

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500);
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString());

    const userObject = user.toObject();
    delete userObject.password;

    res.json({ user: userObject, token });
  } catch (error) {
    res.status(500);
    next(error);
  }
}
