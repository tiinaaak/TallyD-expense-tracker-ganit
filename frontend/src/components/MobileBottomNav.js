import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Wallet, Plus, Target, BarChart3 } from 'lucide-react';

function MobileBottomNav() {
  const navigate = useNavigate();

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/dashboard" end className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
        <Home size={22} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/dashboard/expenses" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
        <Wallet size={22} />
        <span>Expenses</span>
      </NavLink>
      <button className="bottom-nav-fab" onClick={() => navigate('/dashboard/expenses')}>
        <Plus size={24} color="white" />
      </button>
      <NavLink to="/dashboard/budgets" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
        <Target size={22} />
        <span>Budgets</span>
      </NavLink>
      <NavLink to="/dashboard/analytics" className={({ isActive }) => `bottom-nav-item${isActive ? ' active' : ''}`}>
        <BarChart3 size={22} />
        <span>Analytics</span>
      </NavLink>
    </nav>
  );
}

export default MobileBottomNav;