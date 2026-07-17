import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/photos/logo.gif';
import '../styles/mobile_navbar.css';

export function MobileNavbar() {
  const { user, logout } = useAuth();
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
                  Logout
                </a>
              </li>
              <li>
                <Link to="/" onClick={() => setOpen(false)}>
                  Grade Converter
                </Link>
              </li>
              <li>
                <Link to="/journal" onClick={() => setOpen(false)}>
                  Journal
                </Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </li>
              <li>
                <Link to="/" onClick={() => setOpen(false)}>
                  Grade Converter
                </Link>
              </li>
              <li className="inactive-link">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Journal
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </>
  );
}
