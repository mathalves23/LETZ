import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff, Email, Lock, Celebration } from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { login, clearError } from '../store/slices/authSlice';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Limpar erros quando componente monta
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login(formData));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 50%, #00C4B4 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              borderRadius: 3,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            {/* Logo e título */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 3,
              }}
            >
              <Celebration
                sx={{
                  fontSize: 40,
                  color: '#6A0DAD',
                  mr: 1,
                }}
              />
              <Typography
                component="h1"
                variant="h3"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.02em',
                }}
              >
                LETZ
              </Typography>
            </Box>

            <Typography
              component="h2"
              variant="h5"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: '#333333',
              }}
            >
              Bem-vindo de volta!
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mb: 3,
                color: '#666666',
                textAlign: 'center',
              }}
            >
              Entre na sua conta para organizar eventos incríveis
            </Typography>

            {error && (
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 23, 68, 0.1)',
                  border: '1px solid rgba(255, 23, 68, 0.2)',
                }}
              >
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#6A0DAD' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(106, 13, 173, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6A0DAD',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6A0DAD',
                    },
                  },
                }}
              />
              
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#6A0DAD' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        edge="end"
                        sx={{ color: '#6A0DAD' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(106, 13, 173, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#6A0DAD',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#6A0DAD',
                    },
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                  boxShadow: '0 4px 20px rgba(106, 13, 173, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #8A2BE2 0%, #40A9FF 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 25px rgba(106, 13, 173, 0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(106, 13, 173, 0.3)',
                  },
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Entrar'
                )}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{
                    color: '#6A0DAD',
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  Não tem uma conta? Cadastre-se
                </Link>
              </Box>
            </Box>
          </Paper>

          {/* Informações de Usuários de Teste */}
          <Paper
            elevation={0}
            sx={{
              mt: 2,
              p: 2,
              width: '100%',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: 2,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                mb: 1,
                fontWeight: 600,
                color: '#333333',
                textAlign: 'center',
              }}
            >
              🧪 Usuários de Teste
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="caption" sx={{ color: '#666666' }}>
                <strong>Admin:</strong> admin@letz.com / admin123
              </Typography>
              <Typography variant="caption" sx={{ color: '#666666' }}>
                <strong>João:</strong> joao@exemplo.com / admin123
              </Typography>
              <Typography variant="caption" sx={{ color: '#666666' }}>
                <strong>Maria:</strong> maria@exemplo.com / admin123
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;

