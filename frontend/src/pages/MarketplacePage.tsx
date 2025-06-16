import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Chip,
  Rating,
  Avatar,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Dialog,
  DialogContent,
  DialogActions,
  IconButton,
  Fab,
  Badge,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Star as StarIcon,
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  WhatsApp as WhatsAppIcon,
  Add as AddIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Verified as VerifiedIcon,
} from '@mui/icons-material';

interface Service {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  priceType: 'fixed' | 'hourly' | 'custom';
  images: string[];
  provider: {
    id: number;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    isVerified: boolean;
    responseTime: string;
  };
  location: string;
  tags: string[];
  availability: boolean;
  isFavorite: boolean;
  portfolio: string[];
}

interface CartItem {
  serviceId: number;
  quantity: number;
  customRequirements?: string;
}

const MarketplacePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  const categories = [
    { value: 'all', label: 'Todos' },
    { value: 'photography', label: 'Fotografia' },
    { value: 'catering', label: 'Buffet/Catering' },
    { value: 'decoration', label: 'Decoração' },
    { value: 'music', label: 'Música/DJ' },
    { value: 'venue', label: 'Locais' },
    { value: 'security', label: 'Segurança' },
    { value: 'transport', label: 'Transporte' },
    { value: 'entertainment', label: 'Entretenimento' },
    { value: 'equipment', label: 'Equipamentos' },
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, selectedCategory, searchTerm]);

  const loadServices = async () => {
    try {
      setLoading(true);
      
      // Simular dados do marketplace
      const mockServices: Service[] = [
        {
          id: 1,
          title: "Fotografia Profissional para Eventos",
          description: "Cobertura completa do seu evento com equipamentos profissionais. Entrega das fotos editadas em até 7 dias.",
          category: "photography",
          price: 800,
          priceType: "fixed",
          images: [
            "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400",
            "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400"
          ],
          provider: {
            id: 1,
            name: "João Fotografias",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
            rating: 4.8,
            reviewCount: 127,
            isVerified: true,
            responseTime: "Responde em 2h"
          },
          location: "São Paulo, SP",
          tags: ["casamento", "festa", "corporativo", "social"],
          availability: true,
          isFavorite: false,
          portfolio: [
            "https://images.unsplash.com/photo-1519741497674-611481863552?w=300",
            "https://images.unsplash.com/photo-1464207687429-7505649dae38?w=300"
          ]
        },
        {
          id: 2,
          title: "Buffet Premium - Gastronomia Italiana",
          description: "Serviço completo de buffet com pratos da culinária italiana. Inclui garçons, louças e decoração de mesa.",
          category: "catering",
          price: 65,
          priceType: "custom",
          images: [
            "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
            "https://images.unsplash.com/photo-1484659619207-9165d119dafe?w=400"
          ],
          provider: {
            id: 2,
            name: "Bella Vista Gastronomia",
            avatar: "https://images.unsplash.com/photo-1595475038665-8d7fab45c90a?w=100",
            rating: 4.9,
            reviewCount: 89,
            isVerified: true,
            responseTime: "Responde em 1h"
          },
          location: "Rio de Janeiro, RJ",
          tags: ["italiano", "premium", "buffet", "casamento"],
          availability: true,
          isFavorite: true,
          portfolio: [
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300",
            "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300"
          ]
        },
        {
          id: 3,
          title: "DJ e Som Profissional",
          description: "Animação musical para todos os tipos de evento. Equipamento de som profissional e playlist personalizada.",
          category: "music",
          price: 400,
          priceType: "fixed",
          images: [
            "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
            "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400"
          ],
          provider: {
            id: 3,
            name: "DJ Marcus Sound",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
            rating: 4.7,
            reviewCount: 203,
            isVerified: false,
            responseTime: "Responde em 4h"
          },
          location: "Belo Horizonte, MG",
          tags: ["dj", "som", "festa", "música"],
          availability: true,
          isFavorite: false,
          portfolio: [
            "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300",
            "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=300"
          ]
        },
        {
          id: 4,
          title: "Decoração Temática Personalizada",
          description: "Criamos a decoração perfeita para seu evento. Desde aniversários infantis até casamentos sofisticados.",
          category: "decoration",
          price: 1200,
          priceType: "custom",
          images: [
            "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400",
            "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=400"
          ],
          provider: {
            id: 4,
            name: "Arte & Festa Decorações",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
            rating: 4.6,
            reviewCount: 156,
            isVerified: true,
            responseTime: "Responde em 3h"
          },
          location: "Salvador, BA",
          tags: ["decoração", "temático", "personalizado", "casamento"],
          availability: true,
          isFavorite: false,
          portfolio: [
            "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300",
            "https://images.unsplash.com/photo-1519167758481-83f29c5c6ca0?w=300"
          ]
        }
      ];
      
      setServices(mockServices);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = services;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredServices(filtered);
  };

  const formatPrice = (service: Service) => {
    switch (service.priceType) {
      case 'fixed':
        return `R$ ${service.price.toLocaleString('pt-BR')}`;
      case 'hourly':
        return `R$ ${service.price.toLocaleString('pt-BR')}/hora`;
      case 'custom':
        return `A partir de R$ ${service.price.toLocaleString('pt-BR')}`;
      default:
        return 'Consulte';
    }
  };

  const toggleFavorite = (serviceId: number) => {
    setServices(prev => prev.map(service =>
      service.id === serviceId
        ? { ...service, isFavorite: !service.isFavorite }
        : service
    ));
  };

  const addToCart = (serviceId: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.serviceId === serviceId);
      if (existing) {
        return prev.map(item =>
          item.serviceId === serviceId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prev, { serviceId, quantity: 1 }];
      }
    });
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const handleContact = (provider: Service['provider'], method: 'phone' | 'email' | 'whatsapp') => {
    switch (method) {
      case 'phone':
        window.open('tel:+5511999999999');
        break;
      case 'email':
        window.open(`mailto:contato@${provider.name.toLowerCase().replace(/\s/g, '')}.com`);
        break;
      case 'whatsapp':
        window.open('https://wa.me/5511999999999');
        break;
    }
  };

  const TabPanel: React.FC<{ children: React.ReactNode; value: number; index: number }> = ({ 
    children, 
    value, 
    index 
  }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Marketplace de Serviços
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Encontre os melhores profissionais para tornar seu evento inesquecível
        </Typography>
      </Box>

      {/* Filtros e Busca */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Categoria</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Categoria"
              >
                {categories.map((category) => (
                  <MenuItem key={category.value} value={category.value}>
                    {category.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterIcon />}
            >
              Filtros
            </Button>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Typography variant="body2" color="text.secondary">
                {filteredServices.length} serviços encontrados
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Lista de Serviços */}
      <Grid container spacing={3}>
        {filteredServices.map((service) => (
          <Grid item xs={12} sm={6} md={4} key={service.id}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                position: 'relative',
                '&:hover': { boxShadow: 6 }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={service.images[0]}
                alt={service.title}
              />
              
              <IconButton
                sx={{ position: 'absolute', top: 8, right: 8 }}
                onClick={() => toggleFavorite(service.id)}
              >
                {service.isFavorite ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon sx={{ color: 'white' }} />
                )}
              </IconButton>
              
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Chip
                    label={categories.find(c => c.value === service.category)?.label}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                  {!service.availability && (
                    <Chip
                      label="Indisponível"
                      size="small"
                      color="error"
                      sx={{ ml: 1 }}
                    />
                  )}
                </Box>
                
                <Typography variant="h6" component="h3" gutterBottom>
                  {service.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, height: 40, overflow: 'hidden' }}
                >
                  {service.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={service.provider.avatar}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  >
                    {service.provider.name[0]}
                  </Avatar>
                  <Box sx={{ flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography variant="body2" fontWeight="bold">
                        {service.provider.name}
                      </Typography>
                      {service.provider.isVerified && (
                        <VerifiedIcon color="primary" sx={{ ml: 0.5, fontSize: 16 }} />
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={service.provider.rating} size="small" readOnly />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        ({service.provider.reviewCount})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <LocationIcon fontSize="small" color="action" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {service.location}
                  </Typography>
                </Box>
                
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {formatPrice(service)}
                </Typography>
                
                <Box sx={{ mt: 1 }}>
                  {service.tags.slice(0, 3).map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </CardContent>
              
              <CardActions sx={{ p: 2, pt: 0 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => setSelectedService(service)}
                  disabled={!service.availability}
                >
                  Ver Detalhes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => addToCart(service.id)}
                  disabled={!service.availability}
                >
                  <CartIcon />
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Dialog de Detalhes do Serviço */}
      <Dialog
        open={!!selectedService}
        onClose={() => setSelectedService(null)}
        maxWidth="md"
        fullWidth
      >
        {selectedService && (
          <>
            <DialogContent>
              <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)}>
                <Tab label="Visão Geral" />
                <Tab label="Portfólio" />
                <Tab label="Avaliações" />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Box sx={{ mb: 3 }}>
                  <img
                    src={selectedService.images[0]}
                    alt={selectedService.title}
                    style={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 8 }}
                  />
                </Box>
                
                <Typography variant="h5" gutterBottom>
                  {selectedService.title}
                </Typography>
                
                <Typography variant="body1" paragraph>
                  {selectedService.description}
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar 
                    src={selectedService.provider.avatar}
                    sx={{ width: 48, height: 48, mr: 2 }}
                  >
                    {selectedService.provider.name[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {selectedService.provider.name}
                      {selectedService.provider.isVerified && (
                        <VerifiedIcon color="primary" sx={{ ml: 1, fontSize: 20 }} />
                      )}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Rating value={selectedService.provider.rating} size="small" readOnly />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {selectedService.provider.rating} ({selectedService.provider.reviewCount} avaliações)
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {selectedService.provider.responseTime}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h6" color="primary" gutterBottom>
                  {formatPrice(selectedService)}
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  {selectedService.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{ mr: 0.5, mb: 0.5 }}
                    />
                  ))}
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  {selectedService.portfolio.map((image, index) => (
                    <Grid item xs={6} key={index}>
                      <img
                        src={image}
                        alt={`Portfolio ${index + 1}`}
                        style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 8 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Typography variant="body1">
                  Sistema de avaliações em desenvolvimento...
                </Typography>
              </TabPanel>
            </DialogContent>
            
            <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
                <IconButton onClick={() => handleContact(selectedService.provider, 'phone')}>
                  <PhoneIcon />
                </IconButton>
                <IconButton onClick={() => handleContact(selectedService.provider, 'email')}>
                  <EmailIcon />
                </IconButton>
                <IconButton onClick={() => handleContact(selectedService.provider, 'whatsapp')}>
                  <WhatsAppIcon />
                </IconButton>
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, width: '100%' }}>
                <Button onClick={() => setSelectedService(null)}>
                  Fechar
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => addToCart(selectedService.id)}
                >
                  Solicitar Orçamento
                </Button>
              </Box>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* FAB do Carrinho */}
      <Badge badgeContent={getCartItemCount()} color="error">
        <Fab
          color="secondary"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
        >
          <CartIcon />
        </Fab>
      </Badge>

      {/* FAB para Adicionar Serviço */}
      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 100, right: 16 }}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default MarketplacePage; 