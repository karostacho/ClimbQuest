import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/photos/logo.gif';
import '../styles/navbar.css';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
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
                <h1>You are not logged in</h1>
                <div className="text-container">
                  <p>
                    Log in to your profile or sign up to add new routes and boulders to your
                    climbing journal, and keep an eye on your progress!
                  </p>
                </div>
                <div className="buttons">
                  <div className="sign-up-button">
                    <Link className="sign_up" to="/register">
                      Sign up
                    </Link>
                  </div>
                  <div className="log-in-button">
                    <Link className="log_in" to="/login">
                      Have account? Log in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          <li className="grade-converter-tab">
            <Link className="grade-converter-tab" to="/">
              Grade converter
            </Link>
          </li>

          {user ? (
            <>
              <li className="journal-dropdown">
                <Link className="journal-tab" to="/journal">
                  Journal
                </Link>
              </li>
              <li>
                <a className="login" href="#logout" onClick={(e) => { e.preventDefault(); handleLogout(); }}>
                  Log out
                </a>
              </li>
            </>
          ) : (
            <>
              <li className="journal-dropdown-inactive">
                <button className="journal-tab-inactive" onClick={() => setShowLoggedOutNotice(true)}>
                  Journal <i className="fa-solid fa-chevron-down" />
                </button>
              </li>
              <li>
                <Link className="login" to="/login">
                  Log in
                </Link>
              </li>
            </>
          )}
        </div>
      </ul>
    </div>
  );
}
