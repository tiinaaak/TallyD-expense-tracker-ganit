import { NavLink } from 'react-router-dom';
import { LayoutGrid, Wallet, Target, BarChart3, Tags, Settings, LogOut } from 'lucide-react';
import Logo from './Logo';
import './Dashboard.css';

function Sidebar({ onLogout }) {
  const navItems = [
    { to: '/dashboard', end: true, label: 'Overview', icon: LayoutGrid },
    { to: '/dashboard/expenses', label: 'Expenses', icon: Wallet },
    { to: '/dashboard/budgets', label: 'Budgets', icon: Target },
    { to: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/dashboard/categories', label: 'Categories', icon: Tags },
    { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Logo size={34} />
        <span>TallyD</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <button className="sidebar-logout" onClick={onLogout}>
        <LogOut size={18} />
        <span>Log Out</span>
      </button>
    </aside>
  );
}

export default Sidebar;