import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiError } from '../api/client';
import logo from '../assets/photos/logo.gif';
import loginImage from '../assets/photos/log_in.jpg';
import '../styles/general_form_page.css';

export function LoginPage() {
  const { login } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password, rememberMe);
      navigate('/journal');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t('auth_somethingWentWrong'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="content-wrapper">
      <div className="logo-container">
        <Link to="/">
          <img className="logo" src={logo} alt="ClimbQuest" />
        </Link>
      </div>

      <div className="form-container">
        <div className="form-body">
          <h1>{t('auth_signInTitle')}</h1>
          <div className="first-p">
            <p>{t('auth_signInSubtitle')}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="email">{t('auth_email')}</label>
              <input
                className="box"
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">{t('auth_password')}</label>
              <input
                className="box"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="field field-checkbox">
              <label htmlFor="remember_me">
                <input
                  type="checkbox"
                  id="remember_me"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {t('auth_keepLoggedIn')}
              </label>
            </div>

            {error && (
              <div className="flash-container">
                <div className="flash-message error" role="alert">
                  {error}
                </div>
              </div>
            )}

            <div className="submit-btn-container">
              <button className="submit-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('auth_loggingIn') : t('auth_loginButton')}
              </button>
            </div>
          </form>

          <h2 className="second-p">
            {t('auth_noAccount')} <Link to="/register">{t('auth_createNewAccount')}</Link>
          </h2>
        </div>
      </div>

      <div className="graphic">
        <img src={loginImage} alt="" />
      </div>
    </div>
  );
}
