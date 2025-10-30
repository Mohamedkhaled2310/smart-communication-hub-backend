import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtUserPayload } from "../types/auth";

export interface AuthRequest extends Request {
  user?: jwtUserPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwtUserPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
};
