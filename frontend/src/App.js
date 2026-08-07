import { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import AuthPage from './components/AuthPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('authToken'));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <AuthPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const username = localStorage.getItem('username');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ padding: '20px', flex: 1 }}>
          <h2>Welcome, {username}</h2>
          <p>Expense and budget features coming soon.</p>
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default App;