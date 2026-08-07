import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import logo from '../assets/photos/logo.gif';
import '../styles/navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showLoggedOutNotice, setShowLoggedOutNotice] = useState(false);

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <div className="navbar">
      <ul>
        <li>
          <Link to="/">
            <img className="logo" src={logo} alt="ClimbQuest" />
          </Link>
        </li>

        <div className="navbar-wrapper">
          {showLoggedOutNotice && (
            <div className="pop-up-window">
              <div className="not-logged-in-window" id="notLoggedInWindow">
                <span
                  className="close-window"
                  id="closeLoggedIn"
                  onClick={() => setShowLoggedOutNotice(false)}
                >
                  <i className="fa-solid fa-xmark" />
                </span>
                <h1>{t('nav_notLoggedInTitle')}</h1>
                <div className="text-container">
                  <p>{t('nav_notLoggedInBody')}</p>
                </div>
                <div className="buttons">
                  <div className="sign-up-button">
                    <Link className="sign_up" to="/register">
                      {t('nav_signUp')}
                    </Link>
                  </div>
                  <div className="log-in-button">
                    <Link className="log_in" to="/login">
                      {t('nav_haveAccountLogin')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <li className={location.pathname === '/' ? 'grade-converter-tab active-tab' : 'grade-converter-tab'}>
            <Link className="grade-converter-tab" to="/">
              {t('nav_gradeConverter')}
            </Link>
          </li>

          {user ? (
            <>
              <li className={location.pathname === '/journal' ? 'journal-dropdown active-tab' : 'journal-dropdown'}>
                <Link className="journal-tab" to="/journal">
                  {t('nav_journal')}
                </Link>
              </li>
              <li>
                <a className="login" href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  {t('nav_logout')}
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="journal-dropdown-inactive">
                <button
                  className="journal-tab-inactive"
                  onClick={() => setShowLoggedOutNotice(true)}
                  title={t('nav_loginRequiredTooltip')}
                >
                  <i className="fa-solid fa-lock" /> {t('nav_journal')}
                </button>
              </li>
              <li>
                <Link className="login" to="/login">
                  {t('nav_login')}
                </Link>
              </li>
            </>
          )}

          <LanguageToggle />
        </div>
      </ul>
    </div>
  );
}
