import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle,
  Add as AddIcon,
  People as PeopleIcon,
  Home as HomeIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  EmojiEvents as TrophyIcon,
  Message as MessageIcon,
  Settings as SettingsIcon,
  Celebration as CelebrationIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { logout } from '../store/slices/authSlice';
import { useTheme } from '../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { mode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleClose();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleClose();
  };

  const userLevel = Math.floor((user?.points || 0) / 100) + 1;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(106, 13, 173, 0.1)',
        color: '#333333',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        {/* Logo/Título */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            },
          }}
          onClick={() => navigate('/dashboard')}
        >
          <CelebrationIcon
            sx={{
              fontSize: 32,
              color: '#6A0DAD',
              mr: 1,
            }}
          />
          <Typography
            variant="h5"
            component="div"
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

        {/* Menu Central - Desktop */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Button
            startIcon={<HomeIcon />}
            onClick={() => navigate('/dashboard')}
            sx={{
              color: '#333333',
              fontWeight: 500,
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(106, 13, 173, 0.05)',
                color: '#6A0DAD',
              },
            }}
          >
            Início
          </Button>
          
          <Button
            startIcon={<AddIcon />}
            onClick={() => navigate('/events/create')}
            sx={{
              color: '#333333',
              fontWeight: 500,
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(0, 123, 255, 0.05)',
                color: '#007BFF',
              },
            }}
          >
            Criar Evento
          </Button>
          
          <Button
            startIcon={<PeopleIcon />}
            onClick={() => navigate('/friends')}
            sx={{
              color: '#333333',
              fontWeight: 500,
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(0, 196, 180, 0.05)',
                color: '#00C4B4',
              },
            }}
          >
            Amigos
          </Button>

          <Button
            startIcon={<TrophyIcon />}
            onClick={() => navigate('/achievements')}
            sx={{
              color: '#333333',
              fontWeight: 500,
              borderRadius: 2,
              px: 2,
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.05)',
                color: '#FFD700',
              },
            }}
          >
            Conquistas
          </Button>
        </Box>

        {/* Menu do Usuário */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Level Badge */}
          <Chip
            icon={<StarIcon sx={{ fontSize: 16 }} />}
            label={`Nv. ${userLevel}`}
            size="small"
            sx={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FF69B4 100%)',
              color: '#000000',
              fontWeight: 600,
              fontSize: '0.75rem',
              display: { xs: 'none', sm: 'flex' },
            }}
          />

          {/* Toggle Dark Mode */}
          <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
            <IconButton
              size="medium"
              onClick={toggleTheme}
              sx={{
                color: '#6A0DAD',
                '&:hover': {
                  backgroundColor: 'rgba(106, 13, 173, 0.1)',
                },
              }}
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Tooltip>

          {/* Mensagens */}
          <Tooltip title="Mensagens">
            <IconButton
              size="medium"
              onClick={() => navigate('/messages')}
              sx={{
                color: '#007BFF',
                '&:hover': {
                  backgroundColor: 'rgba(0, 123, 255, 0.1)',
                },
              }}
            >
              <Badge
                badgeContent={2}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #FF1744 0%, #FF69B4 100%)',
                  },
                }}
              >
                <MessageIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Notificações */}
          <Tooltip title="Notificações">
            <IconButton
              size="medium"
              onClick={() => navigate('/notifications')}
              sx={{
                color: '#00C4B4',
                '&:hover': {
                  backgroundColor: 'rgba(0, 196, 180, 0.1)',
                },
              }}
            >
              <Badge
                badgeContent={4}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #FF1744 0%, #FF69B4 100%)',
                  },
                }}
              >
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          {/* Avatar do Usuário */}
          <Tooltip title="Menu do usuário">
            <IconButton
              size="medium"
              onClick={handleMenu}
              sx={{
                p: 0.5,
                '&:hover': {
                  backgroundColor: 'rgba(106, 13, 173, 0.1)',
                },
              }}
            >
              {user?.profilePicture ? (
                <Avatar
                  src={user.profilePicture}
                  alt={user.firstName}
                  sx={{
                    width: 40,
                    height: 40,
                    border: '2px solid',
                    borderColor: 'transparent',
                    background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                  }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                    fontSize: '1.2rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.firstName?.charAt(0) || <AccountCircle />}
                </Avatar>
              )}
            </IconButton>
          </Tooltip>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            sx={{
              '& .MuiPaper-root': {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2,
                mt: 1,
                minWidth: 220,
              },
            }}
          >
            <MenuItem
              onClick={handleProfile}
              sx={{
                flexDirection: 'column',
                alignItems: 'flex-start',
                py: 2,
                borderBottom: '1px solid rgba(106, 13, 173, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(106, 13, 173, 0.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                    fontSize: '0.9rem',
                  }}
                >
                  {user?.firstName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user?.firstName} {user?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    @{user?.username}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  icon={<TrophyIcon sx={{ fontSize: 14 }} />}
                  label={`Nível ${userLevel}`}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FF69B4 100%)',
                    color: '#000000',
                    fontSize: '0.7rem',
                  }}
                />
                <Chip
                  icon={<StarIcon sx={{ fontSize: 14 }} />}
                  label={`${user?.points || 0} pts`}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #6A0DAD 0%, #007BFF 100%)',
                    color: '#ffffff',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>
            </MenuItem>
            
            <MenuItem
              onClick={() => { navigate('/profile'); handleClose(); }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(106, 13, 173, 0.05)',
                },
              }}
            >
              👤 Meu Perfil
            </MenuItem>

            <MenuItem
              onClick={() => { navigate('/achievements'); handleClose(); }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 215, 0, 0.05)',
                },
              }}
            >
              🏆 Conquistas
            </MenuItem>
            
            <MenuItem
              onClick={() => { navigate('/events'); handleClose(); }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 123, 255, 0.05)',
                },
              }}
            >
              📅 Meus Eventos
            </MenuItem>

            <MenuItem
              onClick={() => { navigate('/analytics'); handleClose(); }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(0, 196, 180, 0.05)',
                },
              }}
            >
              📊 Analytics
            </MenuItem>
            
            <MenuItem
              onClick={() => { navigate('/settings'); handleClose(); }}
              sx={{
                '&:hover': {
                  backgroundColor: 'rgba(255, 105, 180, 0.05)',
                },
              }}
            >
              ⚙️ Configurações
            </MenuItem>
            
            <MenuItem
              onClick={handleLogout}
              sx={{
                color: '#FF1744',
                borderTop: '1px solid rgba(106, 13, 173, 0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255, 23, 68, 0.05)',
                },
              }}
            >
              🚪 Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

