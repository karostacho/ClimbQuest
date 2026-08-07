import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ApiError } from '../api/client';
import logo from '../assets/photos/logo.gif';
import signUpImage from '../assets/photos/sign_up.jpg';
import '../styles/general_form_page.css';

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
// Matches the server's rule exactly (schemas.py: any non-alphanumeric
// counts as a special character) - a narrower client-side whitelist here
// previously rejected passwords the server would have accepted.
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^a-zA-Z0-9]).{8,}$/;

export function RegisterPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [mismatchError, setMismatchError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const isEmailValid = EMAIL_REGEX.test(email);
    const isPasswordValid = PASSWORD_REGEX.test(password);
    const isMatch = password === repeatPassword;

    setEmailError(isEmailValid ? null : t('auth_invalidEmail'));
    setPasswordError(isPasswordValid ? null : t('auth_passwordHint'));
    setMismatchError(isMatch ? null : t('auth_passwordsDontMatch'));

    return isEmailValid && isPasswordValid && isMatch;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register(name, email, password);
      navigate('/register/success');
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : t('auth_somethingWentWrong'));
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
          <h1>{t('auth_signUpTitle')}</h1>
          <div className="first-p">
            <p>{t('auth_signUpSubtitle')}</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">{t('auth_name')}</label>
              <input className="box" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="email">{t('auth_email')}</label>
              <input
                className="box"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {emailError && <p className="field-error">{emailError}</p>}
            </div>

            <div className="field">
              <label htmlFor="password">{t('auth_password')}</label>
              <input
                className="box"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {passwordError && <p className="field-error">{passwordError}</p>}
            </div>

            <div className="field">
              <label htmlFor="repeat_password">{t('auth_repeatPassword')}</label>
              <input
                className="box"
                type="password"
                id="repeat_password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
              {mismatchError && <p className="field-error">{mismatchError}</p>}
            </div>

            {serverError && (
              <div className="flash-container">
                <div className="flash-message error" role="alert">
                  {serverError}
                </div>
              </div>
            )}

            <div className="submit-btn-container">
              <button className="submit-btn" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t('auth_signingUp') : t('auth_signUpButton')}
              </button>
            </div>
          </form>

          <h2 className="second-p">
            {t('auth_haveAccount')} <Link to="/login">{t('auth_logIn')}</Link>
          </h2>
        </div>
      </div>

      <div className="graphic">
        <img src={signUpImage} alt="" />
      </div>
    </div>
  );
}
