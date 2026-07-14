import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';
import { EmailService } from '../lib/email';
import bcrypt from 'bcryptjs';

const router = Router();

// Admin guard middleware
function adminOnly(req: AuthRequest, res: Response, next: Function) {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

router.use(authenticateToken);
router.use(adminOnly as any);

// ── Dashboard Stats ──────────────────────────────────────
router.get('/stats', async (req, res) => {
  try {
    const [totalUsers, activeUsers, pendingKyc, partnerApps, contactMsgs, accounts] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: 'ACTIVE' } }),
      prisma.kycDocument.count({ where: { status: 'PENDING' } }),
      prisma.partnerApplication.count({ where: { status: 'PENDING' } }),
      prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
      prisma.tradingAccount.count(),
    ]);
    res.json({ totalUsers, activeUsers, pendingKyc, partnerApps, contactMsgs, accounts });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Settings ──────────────────────────────────────
router.get('/settings', async (req, res) => {
  try {
    let settings = await prisma.platformSettings.findUnique({ where: { id: 'default' } });
    if (!settings) settings = await prisma.platformSettings.create({ data: { id: 'default' } });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/settings', async (req, res) => {
  try {
    const { btcWallet, ethWallet, usdtWallet, adaWallet, xrpWallet, solWallet, bnbWallet, dogeWallet, maticWallet, dotWallet, ltcWallet } = req.body;
    const settings = await prisma.platformSettings.upsert({
      where: { id: 'default' },
      update: { btcWallet, ethWallet, usdtWallet, adaWallet, xrpWallet, solWallet, bnbWallet, dogeWallet, maticWallet, dotWallet, ltcWallet },
      create: { id: 'default', btcWallet, ethWallet, usdtWallet, adaWallet, xrpWallet, solWallet, bnbWallet, dogeWallet, maticWallet, dotWallet, ltcWallet },
    });
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── User Management ──────────────────────────────────────
router.get('/users', async (req, res) => {
  try {
    const { search, status, role } = req.query;
    const users = await prisma.user.findMany({
      where: {
        ...(status ? { status: String(status) } : {}),
        ...(role ? { role: String(role) } : {}),
        ...(search ? {
          OR: [
            { email: { contains: String(search) } },
            { firstName: { contains: String(search) } },
            { lastName: { contains: String(search) } },
          ],
        } : {}),
      },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        role: true, status: true, country: true, createdAt: true,
        phone: true, dob: true, walletBalance: true,
        kycDocuments: true,
        _count: { select: { accounts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/users/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const VALID = ['ACTIVE', 'SUSPENDED', 'BANNED'];
    if (!VALID.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { status },
      select: { id: true, email: true, status: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/users/:id/role', async (req, res) => {
  try {
    const { role } = req.body;
    if (!['USER', 'ADMIN'].includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { role },
      select: { id: true, email: true, role: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Admin: Credit / Debit wallet balance ──────────────────
router.post('/users/:id/wallet/credit', async (req: AuthRequest, res: Response) => {
  try {
    const uid = String(req.params.id);
    const { amount, note } = req.body;
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const user = await prisma.user.update({
      where: { id: uid },
      data: { walletBalance: { increment: parsedAmount } },
    });

    await prisma.transaction.create({
      data: {
        userId: uid,
        type: 'DEPOSIT',
        amount: parsedAmount,
        method: 'INTERNAL',
        status: 'COMPLETED',
        txHash: String(note || `Admin credit by ${req.user?.id}`),
      },
    });

    EmailService.sendDepositApprovedAlert(user.email, user.firstName, parsedAmount, 'USD');
    res.json({ success: true, newBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to credit wallet' });
  }
});

router.post('/users/:id/wallet/debit', async (req: AuthRequest, res: Response) => {
  try {
    const uid = String(req.params.id);
    const { amount, note } = req.body;
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.walletBalance < parsedAmount) return res.status(400).json({ error: 'Insufficient balance' });

    const updated = await prisma.user.update({
      where: { id: uid },
      data: { walletBalance: { decrement: parsedAmount } },
    });

    await prisma.transaction.create({
      data: {
        userId: uid,
        type: 'WITHDRAWAL',
        amount: parsedAmount,
        method: 'INTERNAL',
        status: 'COMPLETED',
        txHash: String(note || `Admin debit by ${req.user?.id}`),
      },
    });

    res.json({ success: true, newBalance: updated.walletBalance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to debit wallet' });
  }
});

// ── Admin: Add promo / bonus funds ────────────────────────
router.post('/users/:id/wallet/bonus', async (req: AuthRequest, res: Response) => {
  try {
    const uid = String(req.params.id);
    const { amount, promoCode } = req.body;
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return res.status(400).json({ error: 'Invalid amount' });

    const user = await prisma.user.update({
      where: { id: uid },
      data: { walletBalance: { increment: parsedAmount } },
    });

    await prisma.transaction.create({
      data: {
        userId: uid,
        type: 'DEPOSIT',
        amount: parsedAmount,
        method: 'INTERNAL',
        status: 'COMPLETED',
        txHash: `PROMO:${promoCode || 'ADMIN_BONUS'}`,
      },
    });

    res.json({ success: true, newBalance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bonus' });
  }
});

// ── Admin: Reset user password ────────────────────────────
router.post('/users/:id/reset-password', async (req: AuthRequest, res: Response) => {
  try {
    const uid = String(req.params.id);
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
    const passwordHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({ where: { id: uid }, data: { passwordHash } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// ── Admin: Manage trading accounts ────────────────────────
router.get('/users/:id/accounts', async (req, res) => {
  try {
    const accounts = await prisma.tradingAccount.findMany({ where: { userId: String(req.params.id) } });
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/users/:id/accounts/:accountId', async (req, res) => {
  try {
    const { type, balance, leverage, status } = req.body;
    const account = await prisma.tradingAccount.update({
      where: { id: String(req.params.accountId) },
      data: {
        ...(type ? { type } : {}),
        ...(balance !== undefined ? { balance: parseFloat(balance) } : {}),
        ...(leverage ? { leverage: parseInt(leverage) } : {}),
        ...(status ? { status } : {}),
      },
    });
    res.json(account);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trading account' });
  }
});

router.delete('/users/:id/accounts/:accountId', async (req, res) => {
  try {
    await prisma.tradingAccount.delete({ where: { id: String(req.params.accountId) } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trading account' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const uid = String(req.params.id);
    await prisma.transaction.deleteMany({ where: { userId: uid } });
    await prisma.kycDocument.deleteMany({ where: { userId: uid } });
    await prisma.tradingAccount.deleteMany({ where: { userId: uid } });
    await prisma.user.delete({ where: { id: uid } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// ── KYC Management ──────────────────────────────────────
router.get('/kyc', async (req, res) => {
  try {
    const docs = await prisma.kycDocument.findMany({
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/kyc/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    if (!['APPROVED', 'REJECTED'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const doc = await prisma.kycDocument.update({
      where: { id: req.params.id },
      data: { status, notes, reviewedAt: new Date() },
    });
    res.json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Partner Applications ──────────────────────────────────
router.get('/partners', async (req, res) => {
  try {
    const apps = await prisma.partnerApplication.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/partners/:id', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const app = await prisma.partnerApplication.update({
      where: { id: req.params.id },
      data: { status, notes },
    });
    res.json(app);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Blog CMS ──────────────────────────────────────
router.get('/blog', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/blog', async (req, res) => {
  try {
    const { title, slug, category, author, excerpt, content, status } = req.body;
    if (!title || !slug || !category || !author || !excerpt || !content) {
      return res.status(400).json({ error: 'All fields required' });
    }
    const post = await prisma.blogPost.create({
      data: {
        title, slug, category, author, excerpt, content,
        status: status || 'DRAFT',
        publishedAt: status === 'PUBLISHED' ? new Date() : null,
      },
    });
    res.status(201).json(post);
  } catch (error: any) {
    if (error.code === 'P2002') return res.status(409).json({ error: 'Slug already exists' });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/blog/:id', async (req, res) => {
  try {
    const { title, slug, category, author, excerpt, content, status } = req.body;
    const post = await prisma.blogPost.update({
      where: { id: req.params.id },
      data: {
        title, slug, category, author, excerpt, content, status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
    });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/blog/:id', async (req, res) => {
  try {
    await prisma.blogPost.delete({ where: { id: req.params.id } });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Contact Messages ──────────────────────────────────────
router.get('/messages', async (req, res) => {
  try {
    const msgs = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(msgs);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/messages/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const msg = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(msg);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Transactions Management ────────────────────────────────
router.get('/transactions', async (req, res) => {
  try {
    const txs = await prisma.transaction.findMany({
      include: { user: { select: { firstName: true, lastName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.json(txs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

router.post('/transactions/:id/approve', async (req, res) => {
  try {
    const tx = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    if (!tx || tx.status !== 'PENDING') return res.status(400).json({ error: 'Invalid transaction' });

    if (tx.type === 'DEPOSIT') {
      await prisma.$transaction([
        prisma.user.update({ where: { id: tx.userId }, data: { walletBalance: { increment: tx.amount } } }),
        prisma.transaction.update({ where: { id: tx.id }, data: { status: 'COMPLETED', reviewedAt: new Date() } })
      ]);
    } else if (tx.type === 'WITHDRAWAL') {
      await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'COMPLETED', reviewedAt: new Date() } });
    }

    // Send email alert
    const user = await prisma.user.findUnique({ where: { id: tx.userId } });
    if (user) {
      if (tx.type === 'DEPOSIT') {
        EmailService.sendDepositApprovedAlert(user.email, user.firstName, tx.amount, 'USD');
      } else if (tx.type === 'WITHDRAWAL') {
        EmailService.sendWithdrawalApprovedAlert(user.email, user.firstName, tx.amount, 'USD');
      }
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to approve transaction' });
  }
});

router.post('/transactions/:id/reject', async (req, res) => {
  try {
    const tx = await prisma.transaction.findUnique({ where: { id: req.params.id } });
    if (!tx || tx.status !== 'PENDING') return res.status(400).json({ error: 'Invalid transaction' });

    if (tx.type === 'WITHDRAWAL') {
      await prisma.$transaction([
        prisma.user.update({ where: { id: tx.userId }, data: { walletBalance: { increment: tx.amount } } }),
        prisma.transaction.update({ where: { id: tx.id }, data: { status: 'REJECTED', reviewedAt: new Date() } })
      ]);
    } else if (tx.type === 'DEPOSIT') {
      await prisma.transaction.update({ where: { id: tx.id }, data: { status: 'REJECTED', reviewedAt: new Date() } });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reject transaction' });
  }
});

export default router;
