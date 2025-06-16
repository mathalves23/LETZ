import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          {/* Logo e Título Principal */}
          <Box
            sx={{
              textAlign: 'center',
              mb: 4,
            }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                mb: 1,
              }}
            >
              LETZ
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255,255,255,0.9)',
                fontWeight: 300,
              }}
            >
              Conecte-se e organize seus eventos
            </Typography>
          </Box>

          {/* Card de Login */}
          <Card
            sx={{
              width: '100%',
              maxWidth: 400,
              borderRadius: 3,
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              backdropFilter: 'blur(10px)',
              background: 'rgba(255,255,255,0.95)',
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Typography
                component="h2"
                variant="h5"
                sx={{
                  textAlign: 'center',
                  mb: 3,
                  fontWeight: 600,
                  color: 'text.primary',
                }}
              >
                Entrar
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
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
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.98)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255,255,255,1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#000000 !important',
                      '&.Mui-focused': {
                        color: '#000000 !important',
                      },
                      '&.Mui-error': {
                        color: '#d32f2f !important',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#000000 !important',
                      '&::placeholder': {
                        color: 'rgba(0,0,0,0.5)',
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
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      '& fieldset': {
                        borderColor: 'rgba(0,0,0,0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.98)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(255,255,255,1)',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#000000 !important',
                      '&.Mui-focused': {
                        color: '#000000 !important',
                      },
                      '&.Mui-error': {
                        color: '#d32f2f !important',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      color: '#000000 !important',
                      '&::placeholder': {
                        color: 'rgba(0,0,0,0.5)',
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
                    borderRadius: 2,
                    background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                    boxShadow: '0 3px 5px 2px rgba(102, 126, 234, .3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
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
                      color: 'primary.main',
                      textDecoration: 'none',
                      '&:hover': {
                        textDecoration: 'underline',
                      },
                    }}
                  >
                    Não tem uma conta? Cadastre-se
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Card de Usuários Demo */}
          <Card
            sx={{
              mt: 3,
              width: '100%',
              maxWidth: 400,
              borderRadius: 2,
              background: 'rgba(0,0,0,0.3)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{
                  mb: 2,
                  fontWeight: 600,
                  color: 'white',
                  textAlign: 'center',
                  textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                🎯 Usuários Demo para Teste
              </Typography>
              
              <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.3)' }} />
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    👨‍💼 Admin
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Email: admin@letz.com
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Senha: admin123
                  </Typography>
                </Box>
                
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    👤 Demo User
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Email: demo@letz.com
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Senha: demo123
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    👨 João
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Email: joao@exemplo.com
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Senha: admin123
                  </Typography>
                </Box>

                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Typography variant="body2" sx={{ color: '#ffffff', fontWeight: 600, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    👩 Maria
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Email: maria@exemplo.com
                  </Typography>
                  <br />
                  <Typography variant="caption" sx={{ color: '#ffffff', textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
                    Senha: admin123
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage; 