import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js'; // Make sure this path is correct

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await auth.login(email, password);
      navigate('/'); // Redirect to dashboard
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Invalid email or password';
      setError(errorMsg);
    }
  };

  return (
    // This component is now wrapped by "form-container"
    // The "app-container" is in App.jsx
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={6} // Good to add validation here
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary">Login</button>
      </form>
      <p className="form-link">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
};

export default LoginPage;