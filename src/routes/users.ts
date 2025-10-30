import { Router } from "express";
import prisma from "../prisma";
import { authenticate, AuthRequest } from "../middleware/authMiddleware";

const router = Router();


router.get("/", authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.userId;
    const skip = parseInt(req.query.skip as string) || 0;
    const take = parseInt(req.query.take as string) || 20;

    const users = await prisma.user.findMany({
      where: {
        id: { not: userId }, 
      },
      skip,
      take,
      orderBy: { id: "asc" },
      select: { id: true, name: true, email: true },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
