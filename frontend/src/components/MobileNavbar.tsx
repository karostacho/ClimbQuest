import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageToggle } from './LanguageToggle';
import logo from '../assets/photos/logo.gif';
import '../styles/mobile_navbar.css';

export function MobileNavbar() {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    setOpen(false);
    await logout();
    navigate('/');
  }

  return (
    <>
      <div className="navbar-mobile">
        <Link to="/">
          <img id="navbar-logo-mobile" src={logo} alt="ClimbQuest" />
        </Link>
        <button id="navbar-menu-btn" onClick={() => setOpen((value) => !value)}>
          &#9776;
        </button>
      </div>

      <nav id="menu-mobile" className={open ? 'menu-mobile open' : 'menu-mobile'}>
        <ul>
          {user ? (
            <>
              <li>
                <a href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  {t('nav_logout')}
                </a>
              </li>
              <li>
                <Link to="/" onClick={() => setOpen(false)}>
                  {t('nav_gradeConverter')}
                </Link>
              </li>
              <li>
                <Link to="/journal" onClick={() => setOpen(false)}>
                  {t('nav_journal')}
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setOpen(false)}>
                  {t('nav_login')}
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => setOpen(false)}>
                  {t('nav_gradeConverter')}
                </Link>
              </li>
              <li className="inactive-link">
                <Link to="/login" onClick={() => setOpen(false)} title={t('nav_loginRequiredTooltip')}>
                  <i className="fa-solid fa-lock" /> {t('nav_journal')}
                </Link>
              </li>
            </>
          )}
          <li>
            <LanguageToggle />
          </li>
        </ul>
      </nav>
    </>
  );
}
