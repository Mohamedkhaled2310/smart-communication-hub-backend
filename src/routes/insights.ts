import { Router } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";
import { generateAIInsight } from "../services/ai";

const router = Router();

router.get("/:conversationId", authenticate, async (req: AuthRequest, res) => {
  try {
    const { conversationId } = req.params;

    // fetching messages of conversation
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: parseInt(conversationId) },
          { receiverId: parseInt(conversationId) },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    const insights = await generateAIInsight(messages.map(m => m.text));

    const saved = await prisma.insight.upsert({
      where: { conversationId },
      update: insights,
      create: { conversationId, ...insights },
    });

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to generate insights" });
  }
});

export default router;
