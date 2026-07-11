import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth.middleware';

const router = Router();

// GET /api/blog — public list of published posts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        ...(category ? { category: String(category) } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true, category: true, author: true, excerpt: true, publishedAt: true },
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/blog/:slug — public single post
router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const post = await prisma.blogPost.findFirst({
      where: { slug: String(req.params.slug), status: 'PUBLISHED' },
    });
    if (!post) return res.status(404).json({ error: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
