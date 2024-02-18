import React, { useState } from 'react';
import './SignupPage.css';


const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (password !== passwordConfirm) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:1234/api/v1/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, passwordConfirm }),
      });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      setError('An error occurred during signup.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <input
        className="signup-input"
        type="text"
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="signup-input"
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="signup-input"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        className="signup-input"
        type="password"
        placeholder="Repeat Password"
        value={passwordConfirm}
        onChange={(e) => setPasswordConfirm(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="signup-button" onClick={handleSignup}>Sign Up</button>
    </div>
  );
};

export default SignupPage;
