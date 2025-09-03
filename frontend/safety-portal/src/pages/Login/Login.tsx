import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Avatar,
  InputAdornment,
  IconButton,
  CircularProgress
} from '@mui/material';
import {
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Person as PersonIcon
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Card sx={{ width: '100%', maxWidth: 400, p: 4 }}>
          <CardContent>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                mb: 4
              }}
            >
              <Avatar sx={{ m: 1, bgcolor: 'primary.main', width: 64, height: 64 }}>
                <LockIcon fontSize="large" />
              </Avatar>
              <Typography component="h1" variant="h4" gutterBottom>
                Safety Portal
              </Typography>
              <Typography variant="h6" color="text.secondary" textAlign="center">
                Sign in to your account
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                }}
                autoComplete="email"
                autoFocus
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                autoComplete="current-password"
              />

              <LoadingButton
                type="submit"
                fullWidth
                variant="contained"
                loading={loading}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                size="large"
              >
                Sign In
              </LoadingButton>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Safety Management System v1.0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Powered by S3 Connections
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Login;