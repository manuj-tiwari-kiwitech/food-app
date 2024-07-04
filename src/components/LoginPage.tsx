// components/LoginPage.tsx

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../features/auth/authSlice';
import { Button, TextField, Typography } from '@mui/material';
import { signInWithEmailAndPassword } from '../authService'; // Implement your authentication service
import { Navigate, useNavigate } from 'react-router-dom';
import { RootState } from '../app/store';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const isAuthenticated = localStorage.getItem('isAuthenticated');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithEmailAndPassword(email, password);
      dispatch(login(user));
      navigate('/');
      if(user) {
        setLoading(false);
      }
    } catch (error:any) {
      setError(error.message);
    }
  };

  if(isAuthenticated) {
    return <Navigate to='/' />
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ maxWidth: '400px', padding: '20px', textAlign: 'center', border: '1px solid #ccc', borderRadius: '8px' }}>
        <Typography variant="h5" gutterBottom>Login</Typography>
        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <Typography variant="body2" color="error" style={{ marginBottom: '10px' }}>{error}</Typography>}
        <Button disabled={loading} variant="contained" color="primary" onClick={handleLogin}>
          Login
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
