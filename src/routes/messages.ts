import { Router } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// get all messages between 2 users
router.get("/:receiverId", authenticate, async (req: AuthRequest, res) => {
  try {
    const senderId = req.user?.userId;
    const receiverId = parseInt(req.params.receiverId);
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    // get messages both directions (sender ↔ receiver)
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
      orderBy: { timestamp: "desc" },
      skip,
      take,
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
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
