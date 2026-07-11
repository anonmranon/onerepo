import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/accounts — get user's trading accounts
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const accounts = await prisma.tradingAccount.findMany({
      where: { userId: req.user!.id },
    });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/accounts — create a trading account
router.post('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type = 'DEMO', leverage = 100 } = req.body;
    const VALID_TYPES = ['DEMO', 'STANDARD', 'ECN', 'ISLAMIC'];
    if (!VALID_TYPES.includes(type)) {
      return res.status(400).json({ error: 'Invalid account type' });
    }
    const account = await prisma.tradingAccount.create({
      data: {
        userId: req.user!.id,
        type,
        balance: type === 'DEMO' ? 10000 : 0,
        leverage,
      },
    });
    res.status(201).json(account);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
