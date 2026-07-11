import express from 'express';
import cors from 'cors';
import "dotenv/config";
import authRoutes from './routes/auth.routes';
import usersRoutes from './routes/users.routes';
import accountsRoutes from './routes/accounts.routes';
import blogRoutes from './routes/blog.routes';
import contactRoutes from './routes/contact.routes';
import adminRoutes from './routes/admin.routes';
import walletRoutes from './routes/wallet.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
