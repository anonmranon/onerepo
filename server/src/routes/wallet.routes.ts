import express from 'express';
import { prisma } from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { Response } from 'express';
import { EmailService } from '../lib/email';

const router = express.Router();
router.use(authenticateToken);

// GET /api/wallet/settings (for crypto wallets)
router.get('/settings', async (req: AuthRequest, res: Response) => {
  try {
    let settings = await prisma.platformSettings.findUnique({ where: { id: 'default' } });
    if (!settings) settings = await prisma.platformSettings.create({ data: { id: 'default' } });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch platform settings' });
  }
});

// GET /api/wallet/history
router.get('/history', async (req: AuthRequest, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// POST /api/wallet/deposit
router.post('/deposit', async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { amount, method, txHash } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    if (!method) return res.status(400).json({ error: 'Payment method required' });
    if (method === 'CRYPTO' && !txHash) return res.status(400).json({ error: 'Transaction Hash required for Crypto deposits' });

    const tx = await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        type: 'DEPOSIT',
        amount: parseFloat(amount),
        method,
        txHash: method === 'CRYPTO' ? txHash : null,
        status: 'PENDING',
      }
    });

    // Send email alert
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (user) {
      EmailService.sendDepositRequestAlert(user.email, user.firstName, parseFloat(amount), 'USD');
    }

    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate deposit' });
  }
});

// POST /api/wallet/withdraw
router.post('/withdraw', async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { amount, method } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    if (!method) return res.status(400).json({ error: 'Withdrawal method required' });

    // Ensure user has enough balance
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    if (!user || user.walletBalance < parseFloat(amount)) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Deduct immediately (escrow) and create pending tx
    await prisma.user.update({
      where: { id: req.user!.id },
      data: { walletBalance: { decrement: parseFloat(amount) } },
    });

    const tx = await prisma.transaction.create({
      data: {
        userId: req.user!.id,
        type: 'WITHDRAWAL',
        amount: parseFloat(amount),
        method,
        status: 'PENDING',
      }
    });
    
    // Send email alert
    EmailService.sendWithdrawalRequestAlert(user.email, user.firstName, parseFloat(amount), 'USD');

    res.json(tx);
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate withdrawal' });
  }
});

// POST /api/wallet/transfer
router.post('/transfer', async (req: AuthRequest, res: Response): Promise<any> => {
  try {
    const { amount, accountId, direction } = req.body; // direction: 'TO_ACCOUNT' | 'TO_WALLET'
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Invalid amount' });
    if (!accountId) return res.status(400).json({ error: 'Account required' });

    const user = await prisma.user.findUnique({ where: { id: req.user!.id } });
    const account = await prisma.tradingAccount.findUnique({ where: { id: accountId, userId: req.user!.id } });

    if (!user || !account) return res.status(404).json({ error: 'User or account not found' });

    const parsedAmount = parseFloat(amount);

    if (direction === 'TO_ACCOUNT') {
      if (user.walletBalance < parsedAmount) return res.status(400).json({ error: 'Insufficient wallet balance' });
      
      // Perform atomic transaction
      await prisma.$transaction([
        prisma.user.update({ where: { id: user.id }, data: { walletBalance: { decrement: parsedAmount } } }),
        prisma.tradingAccount.update({ where: { id: account.id }, data: { balance: { increment: parsedAmount } } }),
        prisma.transaction.create({
          data: {
            userId: user.id,
            type: 'TRANSFER_OUT',
            amount: parsedAmount,
            method: 'INTERNAL',
            tradingAccountId: account.id,
            status: 'COMPLETED',
          }
        })
      ]);
    } else if (direction === 'TO_WALLET') {
      if (account.balance < parsedAmount) return res.status(400).json({ error: 'Insufficient account balance' });

      await prisma.$transaction([
        prisma.tradingAccount.update({ where: { id: account.id }, data: { balance: { decrement: parsedAmount } } }),
        prisma.user.update({ where: { id: user.id }, data: { walletBalance: { increment: parsedAmount } } }),
        prisma.transaction.create({
          data: {
            userId: user.id,
            type: 'TRANSFER_IN',
            amount: parsedAmount,
            method: 'INTERNAL',
            tradingAccountId: account.id,
            status: 'COMPLETED',
          }
        })
      ]);
    } else {
      return res.status(400).json({ error: 'Invalid direction' });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Transfer failed' });
  }
});

export default router;
