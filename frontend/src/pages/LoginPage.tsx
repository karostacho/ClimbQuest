import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import logo from '../assets/photos/logo.gif';
import loginImage from '../assets/photos/log_in.jpg';
import '../styles/general_form_page.css';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/journal');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong');
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
          <h1>Sign in</h1>
          <div className="first-p">
            <p>Please fill in your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>E-mail</label>
              <br />
              <input
                className="box"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label>Password</label>
              <br />
              <input
                className="box"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="flash-message" role="alert">
                {error}
              </div>
            )}

            <div className="submit-btn-container">
              <button className="submit-btn" type="submit">
                Login
              </button>
            </div>
          </form>

          <h2 className="second-p">
            Don't have account? <Link to="/register">Create new account</Link>
          </h2>
        </div>
      </div>

      <div className="graphic">
        <img src={loginImage} alt="" />
      </div>
    </div>
  );
}
