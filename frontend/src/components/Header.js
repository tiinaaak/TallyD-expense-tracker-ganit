import Logo from './Logo';

function Header() {
  const username = localStorage.getItem('username') || 'User';
  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="topbar">
      <div className="topbar-brand">
        <Logo size={30} />
        <span>TallyD</span>
      </div>
      <div className="topbar-profile">{initial}</div>
    </header>
  );
}

export default Header;