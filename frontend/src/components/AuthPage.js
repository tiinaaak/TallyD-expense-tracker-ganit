import { useState } from 'react';
import { registerUser, loginUser } from '../api/auth';
import './Auth.css';

function AuthPage({ onLoginSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage('');
    setError('');
    setUsername('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      if (mode === 'register') {
        await registerUser(username, email, password);
        setMessage('Account created! You can log in now.');
        setTimeout(() => switchMode('login'), 1200);
      } else {
        const response = await loginUser(username, password);
        const { token, username: loggedInUsername } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', loggedInUsername);
        setMessage(`Welcome back, ${loggedInUsername}!`);
        setTimeout(() => onLoginSuccess(), 600);
      }
    } catch (err) {
      setError(
        mode === 'register'
          ? 'Registration failed. Please check your details.'
          : 'Invalid username or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
        <div className="auth-logo">T</div>
        <h1>Tallyd</h1>
        <p className="auth-tagline">Every expense counted.</p>
        </div>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('login')}
            type="button"
          >
            Log In
          </button>
          <button
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            onClick={() => switchMode('register')}
            type="button"
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {mode === 'register' && (
            <div className="auth-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'login' && (
            <div className="auth-forgot">
              <a href="/forgot-password">Forgot password?</a>
            </div>
          )}

<button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {message && <div className="auth-message success">{message}</div>}
        {error && <div className="auth-message error">{error}</div>}

        <div className="auth-divider"><span>OR</span></div>

        <button
          type="button"
          className="auth-oauth-button"
          onClick={() => alert('Google Sign-In coming soon — requires backend OAuth setup.')}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 009 18z"/>
            <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default AuthPage;