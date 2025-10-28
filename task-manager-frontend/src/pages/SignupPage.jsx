import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true); // Start loading
    try {
      await auth.signup(username, email, password);
      navigate('/login'); // Redirect to login after successful signup
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Signup failed. Please try again.';
      setError(errorMsg);
    } finally {
      setIsLoading(false); // Stop loading regardless of success or failure
    }
  };

  return (
    <div className="auth-form-container"> {/* Use the new container class */}
      <h2>Sign Up</h2> {/* Larger, bolder heading */}
      <form onSubmit={handleSubmit}>
        <div> {/* Group label and input */}
          <label htmlFor="username">Username:</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username" // Add a placeholder
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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="form-error">{error}</p>} {/* Error message with class */}
        <button 
          type="submit" 
          className="btn-primary" // Use btn-primary for styling
          disabled={isLoading} // Disable during loading
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'} {/* Loading text */}
        </button>
      </form>
      <p className="form-link-text"> {/* Use new class for link text */}
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default SignupPage;
