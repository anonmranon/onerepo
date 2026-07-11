import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// POST /api/contact — submit a contact message
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }
    const msg = await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    res.status(201).json({ message: 'Message received successfully', id: msg.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/contact/partner — submit a partnership application
router.post('/partner', async (req: Request, res: Response) => {
  try {
    const { name, email, company, phone, type } = req.body;
    if (!name || !email || !company || !phone || !type) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const app = await prisma.partnerApplication.create({
      data: { name, email, company, phone, type },
    });
    res.status(201).json({ message: 'Application received successfully', id: app.id });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
