import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/users/me — get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true, email: true, firstName: true, lastName: true,
        phone: true, country: true, dob: true, role: true,
        status: true, createdAt: true,
        accounts: true,
        kycDocuments: { select: { id: true, type: true, status: true, createdAt: true } },
      },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PATCH /api/users/me — update profile
router.patch('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, country } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data: { firstName, lastName, phone, country },
      select: { id: true, email: true, firstName: true, lastName: true, phone: true, country: true },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/users/kyc — upload a KYC document
router.post('/kyc', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { type, fileUrl } = req.body;
    if (!type) return res.status(400).json({ error: 'Document type is required' });
    
    const existing = await prisma.kycDocument.findFirst({
      where: { userId: req.user!.id, type: { contains: type.split(' ')[0] } }
    });

    if (existing && existing.status !== 'REJECTED') {
      return res.status(400).json({ error: 'Document already submitted' });
    }

    if (existing && existing.status === 'REJECTED') {
      const doc = await prisma.kycDocument.update({
        where: { id: existing.id },
        data: { status: 'PENDING', fileUrl: fileUrl || 'uploaded-file.jpg', notes: null }
      });
      return res.json(doc);
    }

    const doc = await prisma.kycDocument.create({
      data: {
        userId: req.user!.id,
        type,
        fileUrl: fileUrl || 'uploaded-file.jpg',
        status: 'PENDING'
      }
    });
    res.status(201).json(doc);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
