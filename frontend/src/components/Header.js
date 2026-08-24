import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogOut,
  Settings,
  ShieldCheck,
  ArrowLeftCircle,
  Bell,
} from 'lucide-react';
import Logo from './Logo';

function Header({ onLogout }) {
  const username = localStorage.getItem('username') || 'User';
  const isStaff = localStorage.getItem('is_staff') === 'true';
  const initial = username.charAt(0).toUpperCase();

  const [open, setOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const menuRef = useRef(null);
  const notificationRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  const inAdminPanel = location.pathname.startsWith('/dashboard/admin');

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="topbar">

      {/* Brand */}
      <div className="topbar-brand">
        <Logo size={30} />
        <span>TallyD</span>
      </div>

      <div className="topbar-right">

        {/* ==============================
            NOTIFICATIONS
        ============================== */}
        <div
          className="topbar-notif-wrap"
          ref={notificationRef}
        >
          <button
            type="button"
            className="topbar-notif-btn"
            title="Notifications"
            aria-label="Notifications"
            onClick={() =>
              setNotificationsOpen((prev) => !prev)
            }
          >
            <Bell size={18} />

            <span className="notification-badge">
              3
            </span>
          </button>

          {notificationsOpen && (
            <div className="topbar-notif-dropdown">

              <div className="notification-header">
                <strong>Notifications</strong>
                <span>3 new</span>
              </div>

              {/* Budget Alert */}
              <button
                type="button"
                className="notification-item"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/dashboard/budgets');
                }}
              >
                <div className="notification-item-icon budget">
                  🎯
                </div>

                <div className="notification-item-content">
                  <strong>Budget Alert</strong>
                  <p>
                    You've used 80% of your food budget.
                  </p>
                  <small>5 min ago</small>
                </div>
              </button>


              {/* Expense Added */}
              <button
                type="button"
                className="notification-item"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/dashboard/expenses');
                }}
              >
                <div className="notification-item-icon expense">
                  💳
                </div>

                <div className="notification-item-content">
                  <strong>Expense Added</strong>
                  <p>
                    ₹1,200 added to Shopping.
                  </p>
                  <small>1 hour ago</small>
                </div>
              </button>


              {/* New Insight */}
              <button
                type="button"
                className="notification-item"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/dashboard/analytics');
                }}
              >
                <div className="notification-item-icon insight">
                  ✦
                </div>

                <div className="notification-item-content">
                  <strong>New Insight</strong>
                  <p>
                    Your spending is down 12% this month.
                  </p>
                  <small>Yesterday</small>
                </div>
              </button>


              {/* View All */}
              <button
                type="button"
                className="notification-view-all"
                onClick={() => {
                  setNotificationsOpen(false);
                  navigate('/dashboard/analytics');
                }}
              >
                View all notifications →
              </button>

            </div>
          )}
        </div>


        {/* ==============================
            ADMIN PANEL
        ============================== */}
        {isStaff && (
          inAdminPanel ? (
            <button
              className="admin-toggle-btn"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeftCircle size={16} />
              Back to Dashboard
            </button>
          ) : (
            <button
              className="admin-toggle-btn"
              onClick={() =>
                navigate('/dashboard/admin/users')
              }
            >
              <ShieldCheck size={16} />
              Admin Panel
            </button>
          )
        )}


        {/* ==============================
            PROFILE
        ============================== */}
        <div
          className="topbar-profile-wrap"
          ref={menuRef}
        >
          <button
            className="topbar-profile"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Account menu"
          >
            {initial}
          </button>

          {open && (
            <div className="topbar-dropdown">

              <div className="topbar-dropdown-username">
                {username}
              </div>

              {/* Settings */}
              <button
                className="topbar-dropdown-item"
                onClick={() => {
                  setOpen(false);
                  navigate('/dashboard/settings');
                }}
              >
                <Settings size={16} />
                Settings
              </button>

              {/* Logout */}
              <button
                className="topbar-dropdown-item topbar-dropdown-logout"
                onClick={() => {
                  setOpen(false);
                  onLogout();
                }}
              >
                <LogOut size={16} />
                Log Out
              </button>

            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;