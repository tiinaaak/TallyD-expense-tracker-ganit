import { useState } from 'react';
import { Mail } from 'lucide-react';
import { requestPasswordReset } from '../api/auth';
import Logo from './Logo';
import './Auth.css';

function ForgotPassword({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      await requestPasswordReset(email);
      setMessage('If that email exists, a reset link has been sent. Check the console/email for the link.');
    } catch (err) {
      setError('Something went wrong. Please try again.');
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
          <h1>Reset your password</h1>
          <p className="auth-subtitle">We'll email you a link to get back in.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <div className="input-with-icon">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary auth-submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        {message && <div className="auth-message success">{message}</div>}
        {error && <div className="auth-message error">{error}</div>}

        <p className="auth-switch-text">
          <button type="button" onClick={onBackToLogin}>Back to Log In</button>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;