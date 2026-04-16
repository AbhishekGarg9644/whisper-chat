import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import type { IUser } from "../models/User";

export type AuthRequest = Request & {
  userId?: string;
  user?: IUser;
};

export const protectRoute = [
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized - missing or invalid token" });
      }

      const parts = authHeader.split(" ");
      const token = parts[1];
      if (!token) {
        return res.status(401).json({ message: "Unauthorized - missing token" });
      }
      let decoded: any;
      try {
        const secret = String(process.env.JWT_SECRET ?? "");
        decoded = jwt.verify(token, secret);
      } catch (err) {
        return res.status(401).json({ message: "Unauthorized - invalid token" });
      }

      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      req.userId = user._id.toString();
      req.user = user;

      next();
    } catch (error) {
      res.status(500);
      next(error);
    }
  },
];
