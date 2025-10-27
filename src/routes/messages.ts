import { Router } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// get all messages between 2 users
router.get("/:receiverId", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const userId = req.user.userId;
    const receiverId = parseInt(req.params.receiverId);

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    res.json(messages);
  } catch {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// send a new message
router.post("/:receiverId", authenticate, async (req: AuthRequest, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    const senderId = req.user.userId;
    const receiverId = parseInt(req.params.receiverId);
    const { text } = req.body;

    const msg = await prisma.message.create({
      data: { senderId, receiverId, text },
    });

    res.status(201).json(msg);
  } catch {
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default router;
