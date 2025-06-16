import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Box,
  Container,
  Slide,
  useScrollTrigger,
  Fab,
  Zoom,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Home as HomeIcon,
  Event as EventIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  AutoMode as AutoModeIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useModernTheme } from '../contexts/ModernThemeContext';
import { alpha } from '@mui/material/styles';

interface ModernNavbarProps {
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    points?: number;
    level?: number;
  };
  onLogout?: () => void;
}

// 🎯 Hook para esconder navbar no scroll
function HideOnScroll({ children }: { children: React.ReactElement }) {
  const trigger = useScrollTrigger();
  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

// 🚀 Botão de voltar ao topo
function ScrollTop() {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Zoom in={trigger}>
      <Box
        onClick={handleClick}
        role="presentation"
        sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1000 }}
      >
        <Fab
          color="primary"
          size="small"
          aria-label="scroll back to top"
          sx={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            '&:hover': {
              transform: 'scale(1.1)',
            },
          }}
        >
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
}

const ModernNavbar: React.FC<ModernNavbarProps> = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, toggleTheme, isDark, colors } = useModernTheme();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  // 🎨 Detectar scroll para efeito glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 🎯 Navegação
  const navigationItems = [
    { label: 'Início', path: '/', icon: <HomeIcon /> },
    { label: 'Eventos', path: '/events', icon: <EventIcon /> },
    { label: 'Amigos', path: '/friends', icon: <PeopleIcon /> },
    { label: 'Mensagens', path: '/messages', icon: <MessageIcon /> },
  ];

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationsOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationsAnchor(null);
    setMobileMenuAnchor(null);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleMenuClose();
  };

  const getThemeIcon = () => {
    switch (mode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'auto':
        return <AutoModeIcon />;
      default:
        return <LightModeIcon />;
    }
  };

  const getThemeLabel = () => {
    switch (mode) {
      case 'light':
        return 'Modo Claro';
      case 'dark':
        return 'Modo Escuro';
      case 'auto':
        return 'Automático';
      default:
        return 'Modo Claro';
    }
  };

  return (
    <>
      <HideOnScroll>
        <AppBar
          position="fixed"
          elevation={0}
          sx={{
            background: scrolled
              ? isDark
                ? 'rgba(10, 10, 10, 0.8)'
                : 'rgba(255, 255, 255, 0.8)'
              : isDark
              ? 'rgba(10, 10, 10, 0.95)'
              : 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha(
              isDark ? colors.neutral[700] : colors.neutral[200],
              0.3
            )}`,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
              {/* 🎨 Logo */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
                onClick={() => navigate('/')}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '12px',
                    background: colors.gradients.primary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 2,
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: 'white',
                      fontWeight: 800,
                      fontSize: '1.2rem',
                    }}
                  >
                    L
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 800,
                    background: colors.gradients.primary,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    display: { xs: 'none', sm: 'block' },
                  }}
                >
                  LETZ
                </Typography>
              </Box>

              {/* 🧭 Navegação Desktop */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
                {navigationItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Button
                      key={item.path}
                      startIcon={item.icon}
                      onClick={() => handleNavigation(item.path)}
                      sx={{
                        borderRadius: '12px',
                        px: 3,
                        py: 1,
                        color: isActive
                          ? colors.primary[600]
                          : isDark
                          ? colors.neutral[300]
                          : colors.neutral[600],
                        backgroundColor: isActive
                          ? alpha(colors.primary[500], 0.1)
                          : 'transparent',
                        border: isActive
                          ? `1px solid ${alpha(colors.primary[500], 0.3)}`
                          : '1px solid transparent',
                        fontWeight: isActive ? 600 : 500,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(colors.primary[500], 0.1),
                          transform: 'translateY(-1px)',
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </Box>

              {/* 🎛️ Ações */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {/* 🔍 Busca */}
                <Tooltip title="Buscar">
                  <IconButton
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: alpha(colors.neutral[100], 0.5),
                      '&:hover': {
                        backgroundColor: alpha(colors.primary[500], 0.1),
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <SearchIcon />
                  </IconButton>
                </Tooltip>

                {/* ➕ Criar Evento */}
                <Tooltip title="Criar Evento">
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/create-event')}
                    sx={{
                      borderRadius: '12px',
                      background: colors.gradients.primary,
                      px: 3,
                      display: { xs: 'none', sm: 'flex' },
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                      },
                    }}
                  >
                    Criar
                  </Button>
                </Tooltip>

                {/* 🔔 Notificações */}
                <Tooltip title="Notificações">
                  <IconButton
                    onClick={handleNotificationsOpen}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: alpha(colors.neutral[100], 0.5),
                      '&:hover': {
                        backgroundColor: alpha(colors.warning[500], 0.1),
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* 🎨 Toggle Tema */}
                <Tooltip title={getThemeLabel()}>
                  <IconButton
                    onClick={toggleTheme}
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: alpha(colors.neutral[100], 0.5),
                      '&:hover': {
                        backgroundColor: alpha(colors.secondary[500], 0.1),
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {getThemeIcon()}
                  </IconButton>
                </Tooltip>

                {/* 👤 Perfil */}
                {user && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* 🏆 Pontos e Nível */}
                    <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
                      <Chip
                        label={`${user.points || 0} pts`}
                        size="small"
                        sx={{
                          background: colors.gradients.success,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label={`Nv. ${user.level || 1}`}
                        size="small"
                        sx={{
                          background: colors.gradients.warning,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Tooltip title="Perfil">
                      <IconButton
                        onClick={handleProfileMenuOpen}
                        sx={{
                          p: 0,
                          ml: 1,
                          '&:hover': {
                            transform: 'scale(1.05)',
                          },
                        }}
                      >
                        <Avatar
                          src={user.profilePicture}
                          sx={{
                            width: 40,
                            height: 40,
                            background: colors.gradients.sunset,
                            border: `2px solid ${alpha(colors.primary[500], 0.3)}`,
                          }}
                        >
                          {user.firstName[0]}
                        </Avatar>
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}

                {/* 📱 Menu Mobile */}
                <IconButton
                  onClick={handleMobileMenuOpen}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    borderRadius: '12px',
                    backgroundColor: alpha(colors.neutral[100], 0.5),
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </HideOnScroll>

      {/* 📱 Menu Mobile */}
      <Menu
        anchorEl={mobileMenuAnchor}
        open={Boolean(mobileMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '16px',
            background: isDark
              ? 'rgba(26, 26, 26, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(
              isDark ? colors.neutral[700] : colors.neutral[200],
              0.3
            )}`,
            minWidth: 200,
          },
        }}
      >
        {navigationItems.map((item) => (
          <MenuItem
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            sx={{
              borderRadius: '8px',
              mx: 1,
              my: 0.5,
              '&:hover': {
                backgroundColor: alpha(colors.primary[500], 0.1),
              },
            }}
          >
            <Box sx={{ mr: 2 }}>{item.icon}</Box>
            {item.label}
          </MenuItem>
        ))}
      </Menu>

      {/* 🔔 Menu Notificações */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '16px',
            background: isDark
              ? 'rgba(26, 26, 26, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(
              isDark ? colors.neutral[700] : colors.neutral[200],
              0.3
            )}`,
            minWidth: 300,
            maxHeight: 400,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Notificações
          </Typography>
          {/* Aqui viriam as notificações reais */}
          <Typography variant="body2" color="text.secondary">
            Nenhuma notificação nova
          </Typography>
        </Box>
      </Menu>

      {/* 👤 Menu Perfil */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: '16px',
            background: isDark
              ? 'rgba(26, 26, 26, 0.9)'
              : 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(
              isDark ? colors.neutral[700] : colors.neutral[200],
              0.3
            )}`,
            minWidth: 200,
          },
        }}
      >
        <MenuItem
          onClick={() => handleNavigation('/profile')}
          sx={{
            borderRadius: '8px',
            mx: 1,
            my: 0.5,
            '&:hover': {
              backgroundColor: alpha(colors.primary[500], 0.1),
            },
          }}
        >
          <PersonIcon sx={{ mr: 2 }} />
          Perfil
        </MenuItem>
        <MenuItem
          onClick={() => handleNavigation('/settings')}
          sx={{
            borderRadius: '8px',
            mx: 1,
            my: 0.5,
            '&:hover': {
              backgroundColor: alpha(colors.primary[500], 0.1),
            },
          }}
        >
          <SettingsIcon sx={{ mr: 2 }} />
          Configurações
        </MenuItem>
        <MenuItem
          onClick={onLogout}
          sx={{
            borderRadius: '8px',
            mx: 1,
            my: 0.5,
            color: colors.error[500],
            '&:hover': {
              backgroundColor: alpha(colors.error[500], 0.1),
            },
          }}
        >
          <LogoutIcon sx={{ mr: 2 }} />
          Sair
        </MenuItem>
      </Menu>

      {/* 🚀 Scroll to Top */}
      <ScrollTop />
    </>
  );
};

export default ModernNavbar; 