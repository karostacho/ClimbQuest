import { Link } from 'react-router-dom';

export function RegisterSuccessPage() {
  return (
    <div className="content-wrapper">
      <div className="form-container">
        <div className="form-body">
          <h1>Account created</h1>
          <p>Your account was created successfully.</p>
          <Link className="submit-btn" to="/login">
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
}
