import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import MobileBottomNav from './components/MobileBottomNav';
import AuthPage from './components/AuthPage';
import ResetPassword from './components/ResetPassword';
import LandingPage from './components/LandingPage';
import DashboardHome from './components/DashboardHome';
import ExpensesPage from './components/ExpensesPage';
import BudgetsPage from './components/BudgetsPage';
import AnalyticsPage from './components/AnalyticsPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './components/Dashboard.css';

function DashboardLayout({ onLogout }) {
  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={onLogout} />
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
        <Header />
        <main className="dashboard-main">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="budgets" element={<BudgetsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="categories" element={<div>Categories — coming soon</div>} />
            <Route path="settings" element={<div>Settings — coming soon</div>} />
          </Routes>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
}

function AppRoutes() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    navigate('/dashboard');
  };

  return (
    <Routes>
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <AuthPage onLoginSuccess={handleLoginSuccess} />}
      />
      <Route
        path="/dashboard/*"
        element={isLoggedIn ? <DashboardLayout onLogout={handleLogout} /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LandingPage />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </>
  );
}

export default App;