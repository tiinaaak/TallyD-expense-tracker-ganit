import { useState } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';

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
import CategoriesPage from './components/CategoriesPage';
import SettingsPage from './components/SettingsPage';
import AdminPanel from './components/AdminPanel';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './components/Dashboard.css';

import useIdleLogout from './hooks/useIdleLogout';


function DashboardLayout({ onLogout }) {
  return (
    <div className="dashboard-layout">

      <Sidebar onLogout={onLogout} />

      <div className="dashboard-content-wrap">

        <Header onLogout={onLogout} />

        <main className="dashboard-main">

          <Routes>

            {/* Main Dashboard */}
            <Route
              index
              element={<DashboardHome />}
            />

            {/* User Pages */}
            <Route
              path="expenses"
              element={<ExpensesPage />}
            />

            <Route
              path="budgets"
              element={<BudgetsPage />}
            />

            <Route
              path="analytics"
              element={<AnalyticsPage />}
            />

            <Route
              path="categories"
              element={<CategoriesPage />}
            />

            <Route
              path="settings"
              element={<SettingsPage />}
            />

            {/* Admin Panel */}
            <Route
              path="admin/*"
              element={<AdminPanel />}
            />

          </Routes>

        </main>

        <Footer />

        <MobileBottomNav />

      </div>

    </div>
  );
}


function AppRoutes() {

  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('authToken')
  );

  const navigate = useNavigate();


  // -----------------------------
  // LOGOUT
  // -----------------------------

  const handleLogout = () => {

    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('is_staff');

    setIsLoggedIn(false);

    navigate('/');
  };


  // -----------------------------
  // LOGIN SUCCESS
  // -----------------------------

  const handleLoginSuccess = () => {

    setIsLoggedIn(true);

    navigate('/dashboard');
  };


  // -----------------------------
  // IDLE LOGOUT
  // -----------------------------

  useIdleLogout(
    isLoggedIn,
    handleLogout
  );


  return (

    <Routes>

      {/* Password Reset */}
      <Route
        path="/reset-password/:uid/:token"
        element={<ResetPassword />}
      />


      {/* Login */}
      <Route
        path="/login"
        element={
          isLoggedIn
            ? <Navigate to="/dashboard" replace />
            : <AuthPage onLoginSuccess={handleLoginSuccess} />
        }
      />


      {/* Dashboard */}
      <Route
        path="/dashboard/*"
        element={
          isLoggedIn
            ? <DashboardLayout onLogout={handleLogout} />
            : <Navigate to="/login" replace />
        }
      />


      {/* Landing Page */}
      <Route
        path="/"
        element={
          isLoggedIn
            ? <Navigate to="/dashboard" replace />
            : <LandingPage />
        }
      />


      {/* Unknown Route */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>

  );
}


function App() {

  return (

    <>

      <ToastContainer
        position="top-right"
        autoClose={3000}
      />

      <BrowserRouter>

        <AppRoutes />

      </BrowserRouter>

    </>

  );
}


export default App;