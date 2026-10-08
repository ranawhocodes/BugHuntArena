import { useState, type FormEvent } from 'react';
import { useAuth } from '../../auth/AuthContext';
import './AuthScreen.css';

type Mode = 'signin' | 'signup';

export function AuthScreen() {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const toggleMode = () => {
    setMode((m) => (m === 'signin' ? 'signup' : 'signin'));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setError('Please enter your hunter name.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
    }

    setSubmitting(true);

    try {
      if (mode === 'signup') {
        const { error: err, session: newSession } = await signUp(email, password, name);
        if (err) {
          setError(err);
        } else if (!newSession) {
          setSuccess('Account created! Please check your email to confirm, then sign in.');
          setMode('signin');
          setName('');
          setPassword('');
          setConfirmPassword('');
        }
        // If newSession is present, onAuthStateChange immediately authenticates the user
      } else {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(err);
        }
        // On success, AuthContext will update and App will redirect
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-screen">
      {/* Ambient glow orbs */}
      <div className="auth-orb auth-orb--1" aria-hidden="true" />
      <div className="auth-orb auth-orb--2" aria-hidden="true" />

      <div className="auth-card">
        {/* Logo / Brand */}
        <div className="auth-brand">
          <span className="auth-brand__icon" aria-hidden="true">🐛</span>
          <h1 className="auth-brand__title">Bug Hunt Arena</h1>
          <p className="auth-brand__subtitle">
            {mode === 'signin' ? 'Welcome back, hunter.' : 'Join the hunt.'}
          </p>
        </div>

        {/* Mode toggle pills */}
        <div className="auth-toggle" role="tablist" aria-label="Authentication mode">
          <button
            role="tab"
            type="button"
            aria-selected={mode === 'signin'}
            className={`auth-toggle__tab ${mode === 'signin' ? 'auth-toggle__tab--active' : ''}`}
            onClick={() => { setMode('signin'); setError(null); setSuccess(null); }}
          >
            Sign In
          </button>
          <button
            role="tab"
            type="button"
            aria-selected={mode === 'signup'}
            className={`auth-toggle__tab ${mode === 'signup' ? 'auth-toggle__tab--active' : ''}`}
            onClick={() => { setMode('signup'); setError(null); setSuccess(null); }}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-name" className="auth-field__label">Hunter Name</label>
              <input
                id="auth-name"
                type="text"
                autoComplete="name"
                className="auth-field__input"
                placeholder="e.g. Code Ranger"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={submitting}
              />
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="auth-email" className="auth-field__label">Email</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              className="auth-field__input"
              placeholder="hunter@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="auth-password" className="auth-field__label">Password</label>
            <input
              id="auth-password"
              type="password"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              className="auth-field__input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={submitting}
            />
          </div>

          {mode === 'signup' && (
            <div className="auth-field">
              <label htmlFor="auth-confirm" className="auth-field__label">Confirm Password</label>
              <input
                id="auth-confirm"
                type="password"
                autoComplete="new-password"
                className="auth-field__input"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={submitting}
              />
            </div>
          )}

          {error && (
            <div className="auth-message auth-message--error" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="auth-message auth-message--success" role="status">
              {success}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={submitting}
          >
            {submitting
              ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
              : (mode === 'signin' ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        {/* Footer toggle */}
        <p className="auth-footer">
          {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className="auth-footer__link" onClick={toggleMode}>
            {mode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
