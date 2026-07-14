// Central API service — all backend calls go through here
const API_BASE = 'https://onerepo.fly.dev/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// Auth
export const authApi = {
  register: (body: object) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: object) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
};

// User
export const usersApi = {
  me: () => request('/users/me'),
  updateMe: (body: object) =>
    request('/users/me', { method: 'PATCH', body: JSON.stringify(body) }),
  uploadKyc: (body: object) =>
    request('/users/kyc', { method: 'POST', body: JSON.stringify(body) }),
};

// Trading Accounts
export const accountsApi = {
  list: () => request('/accounts'),
  create: (body: object) =>
    request('/accounts', { method: 'POST', body: JSON.stringify(body) }),
};

// Blog
export const blogApi = {
  list: (category?: string) =>
    request(`/blog${category ? `?category=${category}` : ''}`),
  post: (slug: string) => request(`/blog/${slug}`),
};

// Contact / Partner
export const contactApi = {
  send: (body: object) =>
    request('/contact', { method: 'POST', body: JSON.stringify(body) }),
  partner: (body: object) =>
    request('/contact/partner', { method: 'POST', body: JSON.stringify(body) }),
};

// Admin
export const adminApi = {
  stats: () => request('/admin/stats'),
  settings: () => request('/admin/settings'),
  updateSettings: (body: object) => request('/admin/settings', { method: 'PATCH', body: JSON.stringify(body) }),

  // Users
  users: (params?: { search?: string; status?: string; role?: string }) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params || {}).filter(([_, v]) => v !== undefined && v !== '')
    );
    const q = new URLSearchParams(cleanParams as any).toString();
    return request(`/admin/users${q ? `?${q}` : ''}`);
  },
  updateUserStatus: (id: string, status: string) =>
    request(`/admin/users/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  updateUserRole: (id: string, role: string) =>
    request(`/admin/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),
  creditWallet: (id: string, amount: number, note?: string) =>
    request(`/admin/users/${id}/wallet/credit`, { method: 'POST', body: JSON.stringify({ amount, note }) }),
  debitWallet: (id: string, amount: number, note?: string) =>
    request(`/admin/users/${id}/wallet/debit`, { method: 'POST', body: JSON.stringify({ amount, note }) }),
  addBonus: (id: string, amount: number, promoCode?: string) =>
    request(`/admin/users/${id}/wallet/bonus`, { method: 'POST', body: JSON.stringify({ amount, promoCode }) }),
  resetPassword: (id: string, newPassword: string) =>
    request(`/admin/users/${id}/reset-password`, { method: 'POST', body: JSON.stringify({ newPassword }) }),
  getUserAccounts: (id: string) =>
    request(`/admin/users/${id}/accounts`),
  updateTradingAccount: (userId: string, accountId: string, body: object) =>
    request(`/admin/users/${userId}/accounts/${accountId}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteTradingAccount: (userId: string, accountId: string) =>
    request(`/admin/users/${userId}/accounts/${accountId}`, { method: 'DELETE' }),
  deleteUser: (id: string) =>
    request(`/admin/users/${id}`, { method: 'DELETE' }),

  // KYC
  kyc: () => request('/admin/kyc'),
  reviewKyc: (id: string, status: string, notes?: string) =>
    request(`/admin/kyc/${id}`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),

  // Partner Applications
  partners: () => request('/admin/partners'),
  reviewPartner: (id: string, status: string, notes?: string) =>
    request(`/admin/partners/${id}`, { method: 'PATCH', body: JSON.stringify({ status, notes }) }),

  // Blog CMS
  blog: () => request('/admin/blog'),
  createPost: (body: object) =>
    request('/admin/blog', { method: 'POST', body: JSON.stringify(body) }),
  updatePost: (id: string, body: object) =>
    request(`/admin/blog/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deletePost: (id: string) =>
    request(`/admin/blog/${id}`, { method: 'DELETE' }),

  // Contact Messages
  messages: () => request('/admin/messages'),
  updateMessageStatus: (id: string, status: string) =>
    request(`/admin/messages/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),

  // Transactions
  transactions: () => request('/admin/transactions'),
  approveTransaction: (id: string) =>
    request(`/admin/transactions/${id}/approve`, { method: 'POST' }),
  rejectTransaction: (id: string) =>
    request(`/admin/transactions/${id}/reject`, { method: 'POST' }),
};

// Wallet
export const walletApi = {
  settings: () => request('/wallet/settings'),
  history: () => request('/wallet/history'),
  deposit: (body: object) => request('/wallet/deposit', { method: 'POST', body: JSON.stringify(body) }),
  withdraw: (body: object) => request('/wallet/withdraw', { method: 'POST', body: JSON.stringify(body) }),
  transfer: (body: object) => request('/wallet/transfer', { method: 'POST', body: JSON.stringify(body) }),
};
