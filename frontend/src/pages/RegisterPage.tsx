import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Alert,
  CircularProgress,
  Grid,
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { register, clearError } from '../store/slices/authSlice';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error, isAuthenticated } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    bio: '',
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.firstName.trim()) {
      errors.push('Nome é obrigatório');
    }

    if (!formData.lastName.trim()) {
      errors.push('Sobrenome é obrigatório');
    }

    if (!formData.username.trim()) {
      errors.push('Nome de usuário é obrigatório');
    } else if (formData.username.length < 3) {
      errors.push('Nome de usuário deve ter pelo menos 3 caracteres');
    }

    if (!formData.email.trim()) {
      errors.push('Email é obrigatório');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push('Email inválido');
    }

    if (!formData.password.trim()) {
      errors.push('Senha é obrigatória');
    } else if (formData.password.length < 6) {
      errors.push('Senha deve ter pelo menos 6 caracteres');
    }

    if (formData.password !== formData.confirmPassword) {
      errors.push('Senhas não coincidem');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
      setValidationErrors(errors);
      return;
    }

    const { confirmPassword, ...registrationData } = formData;
    dispatch(register(registrationData));
  };

  const textFieldStyle = {
    backgroundColor: '#ffffff',
    color: '#000000',
  };

  const labelStyle = {
    color: '#6b7280',
  };

  return (
    <div style={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '20px'
    }}>
      <Container component="main" maxWidth="sm">
        <Paper
          elevation={3}
          style={{
            padding: '32px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h4"
            style={{
              color: '#6366f1',
              fontWeight: 'bold',
              marginBottom: '16px'
            }}
          >
            LETZ
          </Typography>

          <Typography 
            variant="h5"
            style={{
              color: '#000000',
              fontWeight: '600',
              marginBottom: '24px'
            }}
          >
            Criar Conta
          </Typography>

          {(error || validationErrors.length > 0) && (
            <Alert severity="error" style={{ marginBottom: '16px', textAlign: 'left' }}>
              {error || validationErrors.map((err, index) => (
                <div key={index}>{err}</div>
              ))}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="Nome"
                  name="firstName"
                  autoComplete="given-name"
                  autoFocus
                  value={formData.firstName}
                  onChange={handleChange}
                  disabled={isLoading}
                  InputProps={{ style: textFieldStyle }}
                  InputLabelProps={{ style: labelStyle }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff !important',
                      '& input': {
                        color: '#000000 !important',
                      },
                      '& fieldset': {
                        borderColor: '#d1d5db !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280 !important',
                      '&.Mui-focused': {
                        color: '#6366f1 !important',
                      },
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Sobrenome"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  disabled={isLoading}
                  InputProps={{ style: textFieldStyle }}
                  InputLabelProps={{ style: labelStyle }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff !important',
                      '& input': {
                        color: '#000000 !important',
                      },
                      '& fieldset': {
                        borderColor: '#d1d5db !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280 !important',
                      '&.Mui-focused': {
                        color: '#6366f1 !important',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nome de Usuário"
              name="username"
              autoComplete="username"
              value={formData.username}
              onChange={handleChange}
              disabled={isLoading}
              helperText="Mínimo 3 caracteres"
              InputProps={{ style: textFieldStyle }}
              InputLabelProps={{ style: labelStyle }}
              FormHelperTextProps={{ style: { color: '#6b7280' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff !important',
                  '& input': {
                    color: '#000000 !important',
                  },
                  '& fieldset': {
                    borderColor: '#d1d5db !important',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280 !important',
                  '&.Mui-focused': {
                    color: '#6366f1 !important',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#6b7280 !important',
                },
              }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{ style: textFieldStyle }}
              InputLabelProps={{ style: labelStyle }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff !important',
                  '& input': {
                    color: '#000000 !important',
                  },
                  '& fieldset': {
                    borderColor: '#d1d5db !important',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280 !important',
                  '&.Mui-focused': {
                    color: '#6366f1 !important',
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              id="phoneNumber"
              label="Telefone (opcional)"
              name="phoneNumber"
              autoComplete="tel"
              type="tel"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{ style: textFieldStyle }}
              InputLabelProps={{ style: labelStyle }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff !important',
                  '& input': {
                    color: '#000000 !important',
                  },
                  '& fieldset': {
                    borderColor: '#d1d5db !important',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280 !important',
                  '&.Mui-focused': {
                    color: '#6366f1 !important',
                  },
                },
              }}
            />

            <TextField
              margin="normal"
              fullWidth
              id="bio"
              label="Bio (opcional)"
              name="bio"
              multiline
              rows={2}
              value={formData.bio}
              onChange={handleChange}
              disabled={isLoading}
              helperText="Conte um pouco sobre você"
              InputProps={{ style: textFieldStyle }}
              InputLabelProps={{ style: labelStyle }}
              FormHelperTextProps={{ style: { color: '#6b7280' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff !important',
                  '& textarea': {
                    color: '#000000 !important',
                  },
                  '& fieldset': {
                    borderColor: '#d1d5db !important',
                  },
                  '&:hover fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6366f1 !important',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#6b7280 !important',
                  '&.Mui-focused': {
                    color: '#6366f1 !important',
                  },
                },
                '& .MuiFormHelperText-root': {
                  color: '#6b7280 !important',
                },
              }}
            />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="password"
                  label="Senha"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                  helperText="Mínimo 6 caracteres"
                  InputProps={{ style: textFieldStyle }}
                  InputLabelProps={{ style: labelStyle }}
                  FormHelperTextProps={{ style: { color: '#6b7280' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff !important',
                      '& input': {
                        color: '#000000 !important',
                      },
                      '& fieldset': {
                        borderColor: '#d1d5db !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280 !important',
                      '&.Mui-focused': {
                        color: '#6366f1 !important',
                      },
                    },
                    '& .MuiFormHelperText-root': {
                      color: '#6b7280 !important',
                    },
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="confirmPassword"
                  label="Confirmar Senha"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={isLoading}
                  InputProps={{ style: textFieldStyle }}
                  InputLabelProps={{ style: labelStyle }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#ffffff !important',
                      '& input': {
                        color: '#000000 !important',
                      },
                      '& fieldset': {
                        borderColor: '#d1d5db !important',
                      },
                      '&:hover fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6366f1 !important',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: '#6b7280 !important',
                      '&.Mui-focused': {
                        color: '#6366f1 !important',
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isLoading}
              style={{
                marginTop: '24px',
                marginBottom: '16px',
                backgroundColor: '#6366f1',
                color: '#ffffff',
                padding: '12px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              {isLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Criar Conta'
              )}
            </Button>

            <div style={{ textAlign: 'center' }}>
              <Link 
                component={RouterLink} 
                to="/login" 
                variant="body2"
                style={{
                  color: '#6366f1',
                  textDecoration: 'none',
                }}
              >
                Já tem uma conta? Faça login
              </Link>
            </div>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default RegisterPage; 