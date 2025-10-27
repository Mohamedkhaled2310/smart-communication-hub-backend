import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtUserPayload } from "../types/auth";

export interface AuthRequest extends Request {
  user?: jwtUserPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token provided" });

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    if(typeof decoded === "string"){
      return res.status(401).json({ message: "Invalid token format" });
    }
    req.user = decoded as jwtUserPayload;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
