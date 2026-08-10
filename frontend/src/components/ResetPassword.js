import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { confirmPasswordReset } from '../api/auth';
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

function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError('Both password fields are required.');
      return;
    }
    if (passwordStrength.label === 'Weak') {
      setError('Password must be at least 8 characters and include a letter, a number, and a special character.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await confirmPasswordReset(uid, token, newPassword);
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'This reset link is invalid or has expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">T</div>
          <h1>TallyD</h1>
          <p className="auth-tagline">Set a new password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>New Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowNewPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {newPassword && (
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

          <div className="auth-field">
            <label>Confirm Password *</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : 'Reset Password'}
          </button>
        </form>

        {message && <div className="auth-message success">{message}</div>}
        {error && <div className="auth-message error">{error}</div>}
      </div>
    </div>
  );
}

export default ResetPassword;