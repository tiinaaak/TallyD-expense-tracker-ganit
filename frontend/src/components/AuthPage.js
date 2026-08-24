import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { registerUser, loginUser } from '../api/auth';
import ForgotPassword from './ForgotPassword';
import Logo from './Logo';
import './Auth.css';

function getPasswordStrength(password) {
  if (!password) return { label: '', hasMinLength: false, hasLetter: false, hasNumber: false, hasSpecial: false };
  const hasMinLength = password.length >= 8;
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const meetsAll = hasMinLength && hasLetter && hasNumber && hasSpecial;
  if (!hasMinLength) return { label: 'Weak', hasMinLength, hasLetter, hasNumber, hasSpecial };
  if (meetsAll) return { label: 'Strong', hasMinLength, hasLetter, hasNumber, hasSpecial };
  return { label: 'Medium', hasMinLength, hasLetter, hasNumber, hasSpecial };
}

function AuthPage({ onLoginSuccess }) {
  const location = useLocation();
  const [mode, setMode] = useState(location.state?.mode || 'login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  const passwordStrength = getPasswordStrength(password);

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

    if (mode === 'register') {
      if (!username.trim() || !email.trim() || !password.trim()) {
        setError('Username, email, and password are all required.');
        return;
      }
      if (passwordStrength.label === 'Weak') {
        setError('Password must be at least 8 characters and include a letter, a number, and a special character.');
        return;
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Email and password are required.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'register') {
        await registerUser(username, email, password);
        setMessage('Account created! Logging you in...');
        toast.success('Account created!');
        const loginResponse = await loginUser(email, password);
        const { token, username: loggedInUsername, is_staff } = loginResponse.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', loggedInUsername);
        localStorage.setItem('is_staff', is_staff);
        setTimeout(() => onLoginSuccess(), 800);
      } else {
        const response = await loginUser(email, password);
        const { token, username: loggedInUsername, is_staff } = response.data;
        localStorage.setItem('authToken', token);
        localStorage.setItem('username', loggedInUsername);
        localStorage.setItem('is_staff', is_staff);
        setMessage(`Welcome back, ${loggedInUsername}!`);
        toast.success('Welcome back!');
        setTimeout(() => onLoginSuccess(), 600);
      }
    } catch (err) {
      if (mode === 'register') {
        const data = err.response?.data;
        const specificError =
          data?.email?.[0] || data?.username?.[0] || data?.password?.[0] ||
          'Registration failed. Please check your details.';
        setError(specificError);
        toast.error(specificError);
      } else {
        setError('Invalid email or password.');
        toast.error('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-shape-1" />
      <div className="auth-shape-2" />

      <div className="auth-card">
        <div className="auth-brand">
          <Logo size={44} />
          <h1>{mode === 'login' ? 'Welcome back! 👋' : 'Create your account'}</h1>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Log in to your account' : 'Start your journey to better financial health.'}
          </p>
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
          {mode === 'register' && (
            <div className="auth-field">
              <label>Username *</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label>Email *</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
          </div>

          <div className="auth-field">
            <label>Password *</label>
            <div className="input-with-icon">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="input-icon-btn" onClick={() => setShowPassword((p) => !p)} tabIndex={-1}>
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {mode === 'register' && password && (
              <ul className="password-checklist">
                <li className={passwordStrength.hasMinLength ? 'valid' : 'invalid'}>
                  {passwordStrength.hasMinLength ? '✓' : '✗'} At least 8 characters
                </li>
                <li className={passwordStrength.hasLetter ? 'valid' : 'invalid'}>
                  {passwordStrength.hasLetter ? '✓' : '✗'} Contains a letter
                </li>
                <li className={passwordStrength.hasNumber ? 'valid' : 'invalid'}>
                  {passwordStrength.hasNumber ? '✓' : '✗'} Contains a number
                </li>
                <li className={passwordStrength.hasSpecial ? 'valid' : 'invalid'}>
                  {passwordStrength.hasSpecial ? '✓' : '✗'} Contains a special character
                </li>
              </ul>
            )}
          </div>

          {mode === 'login' && (
            <div className="auth-forgot">
              <button type="button" className="auth-forgot-link" onClick={() => setShowForgotPassword(true)}>
                Forgot password?
              </button>
            </div>
          )}

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        {message && <div className="auth-message success">{message}</div>}
        {error && <div className="auth-message error">{error}</div>}

        <div className="auth-divider"><span>OR</span></div>

        <button type="button" className="auth-oauth-button" onClick={() => alert('Google Sign-In coming soon.')}>
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