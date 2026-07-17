import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import logo from '../assets/photos/logo.gif';
import signUpImage from '../assets/photos/sign_up.jpg';
import '../styles/general_form_page.css';

const EMAIL_REGEX = /^[^@]+@[^@]+\.[^@]+$/;
const PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
const PASSWORD_HINT =
  'Password must be at least 8 characters and must contain at least: 1 lowercase letter, 1 uppercase letter, 1 numeric character, and 1 special character';

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [mismatchError, setMismatchError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  function validate(): boolean {
    const isEmailValid = EMAIL_REGEX.test(email);
    const isPasswordValid = PASSWORD_REGEX.test(password);
    const isMatch = password === repeatPassword;

    setEmailError(isEmailValid ? null : 'Invalid e-mail');
    setPasswordError(isPasswordValid ? null : PASSWORD_HINT);
    setMismatchError(isMatch ? null : "Passwords don't match");

    return isEmailValid && isPasswordValid && isMatch;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    try {
      await register(name, email, password);
      navigate('/register/success');
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : 'Something went wrong');
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
          <h1>Sign up</h1>
          <div className="first-p">
            <p>Please fill in your details to create your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="name">Name</label>
              <br />
              <input className="box" type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className="field">
              <label htmlFor="email">E-mail</label>
              <br />
              <input
                className="box"
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="field-error">{emailError}</p>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <br />
              <input
                className="box"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="field-error">{passwordError}</p>
            </div>

            <div className="field">
              <label htmlFor="repeat_password">Repeat Password</label>
              <br />
              <input
                className="box"
                type="password"
                id="repeat_password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                required
              />
              <p className="field-error">{mismatchError}</p>
            </div>

            {serverError && (
              <div className="flash-container">
                <div className="flash-message error" role="alert">
                  {serverError}
                </div>
              </div>
            )}

            <div className="submit-btn-container">
              <button className="submit-btn" type="submit">
                Sign up
              </button>
            </div>
          </form>

          <h2 className="second-p">
            Already have account? <Link to="/login">Log in</Link>
          </h2>
        </div>
      </div>

      <div className="graphic">
        <img src={signUpImage} alt="" />
      </div>
    </div>
  );
}
