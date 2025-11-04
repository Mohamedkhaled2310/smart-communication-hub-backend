import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import { generateToken } from "../services/jwt";
import { authenticate,AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, passwordHash: hash },
    });

    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    const isProduction = process.env.NODE_ENV === "production";
    console.log(isProduction);
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // a week
    });
    res.cookie("hasSession", "true", {
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    const { passwordHash, ...userData } = user;
    res.json({ user: userData });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// fetch user info
  router.get("/me", authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true },
  });
  res.json(user);
});


// logout
  router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.clearCookie("hasSession");
    res.json({ message: "Logged out" });
  });

export default router;
