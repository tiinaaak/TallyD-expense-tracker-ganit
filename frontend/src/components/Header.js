import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings } from 'lucide-react';
import Logo from './Logo';

function Header({ onLogout }) {
  const username = localStorage.getItem('username') || 'User';
  const initial = username.charAt(0).toUpperCase();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Logo size={30} />
        <span>TallyD</span>
      </div>

      <div className="topbar-profile-wrap" ref={menuRef}>
        <button
          className="topbar-profile"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Account menu"
        >
          {initial}
        </button>

        {open && (
          <div className="topbar-dropdown">
            <div className="topbar-dropdown-username">{username}</div>
            <button
              className="topbar-dropdown-item"
              onClick={() => {
                setOpen(false);
                navigate('/dashboard/settings');
              }}
            >
              <Settings size={16} /> Settings
            </button>
            <button
              className="topbar-dropdown-item topbar-dropdown-logout"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;