import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Box, CircularProgress, Alert } from '@mui/material';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

interface MapProps {
  center: google.maps.LatLngLiteral;
  zoom: number;
  markers?: google.maps.LatLngLiteral[];
  onMapClick?: (location: google.maps.LatLngLiteral) => void;
  height?: string;
  width?: string;
}

const Map: React.FC<MapProps> = ({ 
  center, 
  zoom, 
  markers = [], 
  onMapClick,
  height = '400px',
  width = '100%' 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }]
          }
        ]
      });

      setMap(newMap);

      // Add click listener if provided
      if (onMapClick) {
        newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            onMapClick({
              lat: e.latLng.lat(),
              lng: e.latLng.lng()
            });
          }
        });
      }
    }
  }, [ref, map, center, zoom, onMapClick]);

  // Add markers
  useEffect(() => {
    if (map && markers.length > 0) {
      markers.forEach((position) => {
        new window.google.maps.Marker({
          position,
          map,
          animation: google.maps.Animation.DROP,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
            scaledSize: new google.maps.Size(32, 32)
          }
        });
      });
    }
  }, [map, markers]);

  return <div ref={ref} style={{ height, width }} />;
};

const render = (status: Status) => {
  switch (status) {
    case Status.LOADING:
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          height="400px"
        >
          <CircularProgress />
        </Box>
      );
    case Status.FAILURE:
      return (
        <Alert severity="error">
          Erro ao carregar o Google Maps. Verifique sua conexão e tente novamente.
        </Alert>
      );
    case Status.SUCCESS:
      return <Map center={{ lat: -23.5505, lng: -46.6333 }} zoom={10} />;
  }
};

interface GoogleMapProps extends MapProps {
  apiKey?: string;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  apiKey = GOOGLE_MAPS_API_KEY,
  ...mapProps 
}) => {
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <Alert severity="warning">
        Google Maps API Key não configurada. Configure REACT_APP_GOOGLE_MAPS_API_KEY no arquivo .env
      </Alert>
    );
  }

  return (
    <Wrapper apiKey={apiKey} render={render}>
      <Map {...mapProps} />
    </Wrapper>
  );
};

// Componente para seleção de localização
interface LocationPickerProps {
  onLocationSelect: (location: google.maps.LatLngLiteral & { address?: string }) => void;
  initialLocation?: google.maps.LatLngLiteral;
  height?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  onLocationSelect,
  initialLocation = { lat: -23.5505, lng: -46.6333 }, // São Paulo
  height = '300px'
}) => {
  const [selectedLocation, setSelectedLocation] = useState<google.maps.LatLngLiteral>(initialLocation);

  const handleMapClick = async (location: google.maps.LatLngLiteral) => {
    setSelectedLocation(location);
    
    // Reverse geocoding to get address
    try {
      const geocoder = new google.maps.Geocoder();
      const response = await geocoder.geocode({ location });
      
      if (response.results[0]) {
        onLocationSelect({
          ...location,
          address: response.results[0].formatted_address
        });
      } else {
        onLocationSelect(location);
      }
    } catch (error) {
      console.error('Erro no reverse geocoding:', error);
      onLocationSelect(location);
    }
  };

  return (
    <GoogleMap
      center={selectedLocation}
      zoom={15}
      markers={[selectedLocation]}
      onMapClick={handleMapClick}
      height={height}
    />
  );
};

export default GoogleMap; 