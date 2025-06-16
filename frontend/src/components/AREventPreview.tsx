import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Fab,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  CameraAlt as CameraIcon,
  ViewInAr as ARIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  CenterFocusStrong as FocusIcon,
} from '@mui/icons-material';

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  startDateTime: string;
  imageUrl?: string;
  capacity: number;
  participantCount: number;
}

interface AREventPreviewProps {
  event: Event;
  open: boolean;
  onClose: () => void;
}

declare global {
  interface Window {
    WebXR?: any;
    XRSession?: any;
  }
}

const AREventPreview: React.FC<AREventPreviewProps> = ({ event, open, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [arObjects, setArObjects] = useState<any[]>([]);

  useEffect(() => {
    checkARSupport();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (open && isARSupported) {
      initializeAR();
    }
  }, [open, isARSupported]);

  const checkARSupport = () => {
    // Verificar suporte WebXR
    if ('xr' in navigator && 'XRSystem' in window) {
      navigator.xr?.isSessionSupported('immersive-ar').then((supported) => {
        setIsARSupported(supported);
      }).catch(() => {
        setIsARSupported(false);
      });
    } else {
      // Fallback para câmera básica
      setIsARSupported(!!navigator.mediaDevices?.getUserMedia);
    }
  };

  const initializeAR = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Inicializar câmera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Câmera traseira
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Tentar inicializar WebXR
      if ('xr' in navigator) {
        try {
          const session = await navigator.xr?.requestSession('immersive-ar', {
            requiredFeatures: ['local'],
            optionalFeatures: ['dom-overlay'],
            domOverlay: { root: document.body }
          });

          if (session) {
            setupXRSession(session);
          }
        } catch (xrError) {
          console.log('WebXR não disponível, usando fallback');
          setupFallbackAR();
        }
      } else {
        setupFallbackAR();
      }
    } catch (err) {
      setError('Erro ao acessar câmera: ' + (err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const setupXRSession = (session: any) => {
    // Configurar session WebXR
    session.addEventListener('end', () => {
      setIsTracking(false);
    });

    // Inicializar rastreamento
    setIsTracking(true);
    
    // Adicionar objetos AR do evento
    addEventARObjects();
  };

  const setupFallbackAR = () => {
    // Setup básico para AR sem WebXR
    setIsTracking(true);
    startCameraTracking();
    addEventARObjects();
  };

  const startCameraTracking = () => {
    // Simulação de rastreamento usando canvas
    if (!canvasRef.current || !videoRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const processFrame = () => {
      if (videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        
        // Desenhar vídeo
        ctx.drawImage(videoRef.current, 0, 0);
        
        // Adicionar overlays AR
        drawAROverlays(ctx);
      }
      
      if (isTracking) {
        requestAnimationFrame(processFrame);
      }
    };

    processFrame();
  };

  const drawAROverlays = (ctx: CanvasRenderingContext2D) => {
    // Desenhar informações do evento em AR
    ctx.save();
    
    // Card do evento no centro
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
    
    // Fundo do card
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.roundRect(centerX - 150, centerY - 100, 300, 200, 10);
    ctx.fill();
    
    // Texto do evento
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(event.title, centerX, centerY - 60);
    
    ctx.font = '14px Arial';
    ctx.fillText(`📍 ${event.location}`, centerX, centerY - 30);
    ctx.fillText(`👥 ${event.participantCount}/${event.capacity}`, centerX, centerY);
    ctx.fillText(`📅 ${new Date(event.startDateTime).toLocaleDateString('pt-BR')}`, centerX, centerY + 30);
    
    // Indicador de rastreamento
    ctx.fillStyle = '#4CAF50';
    ctx.beginPath();
    ctx.arc(50, 50, 20, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('AR', 50, 55);
    
    ctx.restore();
  };

  const addEventARObjects = () => {
    // Adicionar objetos 3D virtuais relacionados ao evento
    const objects = [
      {
        type: 'eventCard',
        position: { x: 0, y: 0, z: -2 },
        content: event
      },
      {
        type: 'locationMarker',
        position: { x: 0, y: -1, z: -1 },
        content: event.location
      },
      {
        type: 'participantCounter',
        position: { x: 1, y: 0.5, z: -1.5 },
        content: `${event.participantCount}/${event.capacity}`
      }
    ];
    
    setArObjects(objects);
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsTracking(false);
    onClose();
  };

  const restartAR = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    initializeAR();
  };

  if (!isARSupported) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogContent>
          <Alert severity="warning">
            <Typography variant="h6" gutterBottom>
              AR não suportado
            </Typography>
            <Typography>
              Seu dispositivo não suporta realidade aumentada. 
              Para melhor experiência, use um dispositivo com suporte a WebXR ou câmera.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      fullScreen
      PaperProps={{
        sx: { backgroundColor: 'black' }
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'hidden' }}>
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
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              zIndex: 10,
            }}
          >
            <Box textAlign="center" color="white">
              <CircularProgress sx={{ mb: 2 }} />
              <Typography>Inicializando AR...</Typography>
            </Box>
          </Box>
        )}

        {error && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              right: 20,
              zIndex: 10,
            }}
          >
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          </Box>
        )}

        {/* Vídeo da câmera */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />

        {/* Canvas para AR fallback */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        />

        {/* Controles AR */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            right: 20,
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Fab
            onClick={restartAR}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <RefreshIcon sx={{ color: 'white' }} />
          </Fab>
          
          <Fab
            onClick={() => {/* Implementar foco automático */}}
            sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          >
            <FocusIcon sx={{ color: 'white' }} />
          </Fab>
        </Box>

        {/* Status AR */}
        {isTracking && (
          <Box
            sx={{
              position: 'absolute',
              top: 20,
              left: 20,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'rgba(76, 175, 80, 0.8)',
              borderRadius: 20,
              px: 2,
              py: 1,
            }}
          >
            <ARIcon sx={{ color: 'white', mr: 1 }} />
            <Typography variant="body2" sx={{ color: 'white' }}>
              AR Ativo
            </Typography>
          </Box>
        )}

        {/* Instruções */}
        <Box
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            borderRadius: 1,
            p: 2,
            maxWidth: 250,
          }}
        >
          <Typography variant="body2" sx={{ color: 'white', mb: 1 }}>
            📱 Instruções:
          </Typography>
          <Typography variant="caption" sx={{ color: 'white' }}>
            • Aponte a câmera para uma superfície plana{'\n'}
            • Mova o dispositivo lentamente{'\n'}
            • As informações do evento aparecerão em AR
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
};

// Extensão para Canvas roundRect (compatibilidade)
declare global {
  interface CanvasRenderingContext2D {
    roundRect(x: number, y: number, w: number, h: number, r: number): void;
  }
}

if (!CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(
    x: number, 
    y: number, 
    w: number, 
    h: number, 
    r: number
  ) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    this.beginPath();
    this.moveTo(x + r, y);
    this.arcTo(x + w, y, x + w, y + h, r);
    this.arcTo(x + w, y + h, x, y + h, r);
    this.arcTo(x, y + h, x, y, r);
    this.arcTo(x, y, x + w, y, r);
    this.closePath();
  };
}

export default AREventPreview; 