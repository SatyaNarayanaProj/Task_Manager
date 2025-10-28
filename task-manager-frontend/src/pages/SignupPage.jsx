import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../api/api.js'; 

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);
    try {
      await signupUser({ username, email, password }); 
      setMessage('Signup successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed. Please try again.';
      setError(errorMsg);
      setIsLoading(false); 
    }
  };

  return (
    <div className="auth-form-container"> 
      <h2>Sign Up</h2> 
      <form onSubmit={handleSubmit}>
        <div> 
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            placeholder="Choose a username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            id="password"
            type="password"
            placeholder="Create a password (min. 6 chars)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6} 
          />
        </div>
        
        {error && <p className="form-error">{error}</p>} 
        {message && <p className="form-message" style={{ color: 'green' }}>{message}</p>} 

        <button 
          type="submit" 
          className="btn-primary" 
          disabled={isLoading} 
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'} 
        </button>
      </form>
      <p className="form-link-text"> 
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default SignupPage;
