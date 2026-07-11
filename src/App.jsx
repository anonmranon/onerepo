import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

import Home from './pages/Home';
import Markets from './pages/Markets';
import ShareCFDs from './pages/ShareCFDs';
import Forex from './pages/Forex';
import Indices from './pages/Indices';
import Commodities from './pages/Commodities';
import Company from './pages/Company';
import CompanyNews from './pages/CompanyNews';
import Partnership from './pages/Partnership';
import Education from './pages/Education';
import TradingStrategy from './pages/TradingStrategy';
import ForexCourse from './pages/ForexCourse';
import TradingPlatforms from './pages/TradingPlatforms';
import MetaTrader5 from './pages/MetaTrader5';
import ComparePlatforms from './pages/ComparePlatforms';
import AccountTypes from './pages/AccountTypes';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import Resources from './pages/Resources';
import NotFound from './pages/NotFound';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import RiskDisclosure from './pages/RiskDisclosure';
import Contact from './pages/Contact';
import Article from './pages/Article';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import DashboardAccounts from './pages/dashboard/DashboardAccounts';
import DashboardProfile from './pages/dashboard/DashboardProfile';
import DashboardKYC from './pages/dashboard/DashboardKYC';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminUsers from './pages/admin/AdminUsers';
import AdminKYC from './pages/admin/AdminKYC';
import AdminBlog from './pages/admin/AdminBlog';
import AdminPartners from './pages/admin/AdminPartners';
import AdminMessages from './pages/admin/AdminMessages';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminSettings from './pages/admin/AdminSettings';
import DashboardWallet from './pages/dashboard/DashboardWallet';
import DashboardTrading from './pages/dashboard/DashboardTrading';
import ChatWidget from './components/ChatWidget';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="markets" element={<Markets />} />
            <Route path="markets/share-cfds" element={<ShareCFDs />} />
            <Route path="markets/forex" element={<Forex />} />
            <Route path="markets/indices" element={<Indices />} />
            <Route path="markets/commodities" element={<Commodities />} />
            <Route path="company" element={<Company />} />
            <Route path="company/news" element={<CompanyNews />} />
            <Route path="company/partnership" element={<Partnership />} />
            <Route path="education" element={<Education />} />
            <Route path="education/strategy" element={<TradingStrategy />} />
            <Route path="education/course" element={<ForexCourse />} />
            <Route path="platforms" element={<TradingPlatforms />} />
            <Route path="platforms/mt5" element={<MetaTrader5 />} />
            <Route path="platforms/compare" element={<ComparePlatforms />} />
            <Route path="accounts" element={<AccountTypes />} />
            <Route path="create-account" element={<CreateAccount />} />
            <Route path="login" element={<Login />} />
            <Route path="resources" element={<Resources />} />
            <Route path="terms" element={<Terms />} />
            <Route path="privacy" element={<Privacy />} />
            <Route path="risk-disclosure" element={<RiskDisclosure />} />
            <Route path="contact" element={<Contact />} />
            <Route path="article/:slug" element={<Article />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          {/* Dashboard — auth-guarded, uses its own layout */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="accounts" element={<DashboardAccounts />} />
            <Route path="wallet" element={<DashboardWallet />} />
            <Route path="trading" element={<DashboardTrading />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="kyc" element={<DashboardKYC />} />
          </Route>
          {/* Admin — role-guarded, uses its own layout */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="transactions" element={<AdminTransactions />} />
            <Route path="kyc" element={<AdminKYC />} />
            <Route path="blog" element={<AdminBlog />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
        {/* AI Chatbot — shown on all public pages */}
        <ChatWidget />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
