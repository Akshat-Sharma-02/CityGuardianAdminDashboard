import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Login({ setAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/admin/login', { email, password });
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('adminUser', JSON.stringify(response.data.user));
        
        // Update App state
        setAuth(true);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      width: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#F8FAFC',
      backgroundImage: 'radial-gradient(circle at 50% 0%, #e0e7ff 0%, transparent 70%)'
    }}>
      <Paper elevation={0} sx={{ 
        p: 5, 
        width: '100%', 
        maxWidth: 420, 
        borderRadius: 4, 
        border: '1px solid #F1F5F9',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 10px 10px -5px rgba(0,0,0,0.02)',
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center' 
      }}>
        <Box sx={{ mb: 3 }}>
          <img src="/logo.png" alt="City Guardian" style={{ width: 80, height: 80, objectFit: 'contain' }} />
        </Box>
        
        <Typography variant="h5" sx={{ fontWeight: 800, color: 'text.primary', mb: 1, letterSpacing: '-0.5px' }}>
          Admin Portal
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Sign in with your administrator credentials to access the dashboard.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ mb: 4, '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ 
              py: 1.5, 
              borderRadius: 2, 
              fontSize: '1rem',
              textTransform: 'none',
              fontWeight: 700,
              boxShadow: '0 4px 6px -1px rgba(11, 17, 32, 0.2)'
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
