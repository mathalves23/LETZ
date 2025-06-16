import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  MyLocation as MyLocationIcon,
} from '@mui/icons-material';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface MapPickerProps {
  location?: Location;
  onLocationChange: (location: Location) => void;
  width?: string | number;
  height?: string | number;
}

const MapPicker: React.FC<MapPickerProps> = ({
  location,
  onLocationChange,
  width = '100%',
  height = 400,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState(location?.address || '');

  // Função para carregar o Google Maps
  const loadGoogleMaps = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Verificar se o Google Maps já está carregado
      if (window.google?.maps) {
        initializeMap();
        return;
      }

      // Carregar Google Maps API
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        initializeMap();
      };
      
      script.onerror = () => {
        setError('Erro ao carregar Google Maps API. Verifique sua chave de API.');
        setIsLoading(false);
      };

      document.head.appendChild(script);
    } catch (err) {
      setError('Erro ao inicializar o mapa');
      setIsLoading(false);
    }
  }, []);

  const initializeMap = useCallback(() => {
    if (!mapRef.current) return;

    const defaultLocation = location || { lat: -23.5505, lng: -46.6333 }; // São Paulo

    const map = new google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
    });

    const marker = new google.maps.Marker({
      position: defaultLocation,
      map: map,
      draggable: true,
      title: 'Localização do evento',
    });

    // Listener para quando o marcador é arrastado
    marker.addListener('dragend', () => {
      const position = marker.getPosition();
      if (position) {
        const newLocation = {
          lat: position.lat(),
          lng: position.lng(),
        };
        
        // Buscar endereço usando geocoding reverso
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: newLocation }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const formattedAddress = results[0].formatted_address;
            setAddress(formattedAddress);
            onLocationChange({
              ...newLocation,
              address: formattedAddress,
            });
          } else {
            onLocationChange(newLocation);
          }
        });
      }
    });

    // Listener para cliques no mapa
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const newLocation = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        
        marker.setPosition(e.latLng);
        
        // Buscar endereço
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: newLocation }, (results, status) => {
          if (status === 'OK' && results?.[0]) {
            const formattedAddress = results[0].formatted_address;
            setAddress(formattedAddress);
            onLocationChange({
              ...newLocation,
              address: formattedAddress,
            });
          } else {
            onLocationChange(newLocation);
          }
        });
      }
    });

    mapInstanceRef.current = map;
    markerRef.current = marker;
    setIsLoading(false);
  }, [location, onLocationChange]);

  // Função para buscar localização atual
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          if (mapInstanceRef.current && markerRef.current) {
            mapInstanceRef.current.setCenter(newLocation);
            markerRef.current.setPosition(newLocation);
            
            // Buscar endereço
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: newLocation }, (results, status) => {
              if (status === 'OK' && results?.[0]) {
                const formattedAddress = results[0].formatted_address;
                setAddress(formattedAddress);
                onLocationChange({
                  ...newLocation,
                  address: formattedAddress,
                });
              } else {
                onLocationChange(newLocation);
              }
            });
          }
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          setError('Não foi possível obter sua localização atual');
        }
      );
    } else {
      setError('Geolocalização não é suportada pelo seu navegador');
    }
  }, [onLocationChange]);

  // Função para buscar por endereço
  const searchByAddress = useCallback(() => {
    if (!address.trim()) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results?.[0]) {
        const location = results[0].geometry.location;
        const newLocation = {
          lat: location.lat(),
          lng: location.lng(),
          address: results[0].formatted_address,
        };

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setCenter(location);
          markerRef.current.setPosition(location);
        }

        setAddress(results[0].formatted_address);
        onLocationChange(newLocation);
      } else {
        setError('Endereço não encontrado');
      }
    });
  }, [address, onLocationChange]);

  useEffect(() => {
    loadGoogleMaps();
  }, [loadGoogleMaps]);

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        <LocationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Selecionar Localização
      </Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          label="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchByAddress()}
          placeholder="Digite um endereço..."
        />
        <Button
          variant="outlined"
          onClick={searchByAddress}
          disabled={!address.trim()}
        >
          Buscar
        </Button>
        <Button
          variant="outlined"
          onClick={getCurrentLocation}
          startIcon={<MyLocationIcon />}
        >
          Minha Localização
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          position: 'relative',
          width,
          height,
          border: '1px solid #ddd',
          borderRadius: 1,
        }}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              zIndex: 1,
            }}
          >
            <CircularProgress />
          </Box>
        )}
        
        <div
          ref={mapRef}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
        Clique no mapa ou arraste o marcador para selecionar uma localização
      </Typography>
    </Paper>
  );
};

export default MapPicker; 