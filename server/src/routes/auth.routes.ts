import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-change-in-production';

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, country, submitKyc } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        country,
        ...(submitKyc ? {
          kycDocuments: {
            create: [
              { type: 'Government ID', fileUrl: 'uploaded-id.jpg', status: 'PENDING' },
              { type: 'Proof of Address', fileUrl: 'uploaded-poa.jpg', status: 'PENDING' }
            ]
          }
        } : {})
      },
    });

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Registration error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: 'Internal server error', detail: String(error) });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: `Account is ${user.status.toLowerCase()}` });
    }

    // Generate JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('Login error:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    res.status(500).json({ error: 'Internal server error', detail: String(error) });
  }
});

export default router;
