import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardActions,
  IconButton,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Fab,
  Chip,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  PhotoCamera as PhotoCameraIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  MoreVert as MoreVertIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Delete as DeleteIcon,
  Report as ReportIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Photo {
  id: number;
  url: string;
  thumbnailUrl: string;
  title?: string;
  description?: string;
  uploadedBy: {
    id: number;
    firstName: string;
    lastName: string;
    profilePicture?: string;
  };
  likesCount: number;
  isLiked: boolean;
  tags: string[];
  uploadedAt: string;
  isOwner: boolean;
}

interface PhotoGalleryProps {
  eventId: number;
  canUpload?: boolean;
  maxPhotos?: number;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ 
  eventId, 
  canUpload = false, 
  maxPhotos = 50 
}) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadPhotos();
  }, [eventId]);

  const loadPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/events/${eventId}/photos`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar fotos');
      }

      const data = await response.json();
      setPhotos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => uploadPhoto(file));
    }
  };

  const uploadPhoto = async (file: File) => {
    if (photos.length >= maxPhotos) {
      setError(`Máximo de ${maxPhotos} fotos permitidas`);
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('photo', file);
      formData.append('eventId', eventId.toString());

      const response = await fetch('/api/photos/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Erro ao fazer upload da foto');
      }

      const newPhoto = await response.json();
      setPhotos(prev => [newPhoto, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  };

  const handleLike = async (photoId: number) => {
    try {
      const response = await fetch(`/api/photos/${photoId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setPhotos(prev => prev.map(photo => 
          photo.id === photoId
            ? {
                ...photo,
                isLiked: !photo.isLiked,
                likesCount: photo.isLiked 
                  ? photo.likesCount - 1 
                  : photo.likesCount + 1
              }
            : photo
        ));

        // Atualizar foto selecionada se for a mesma
        if (selectedPhoto?.id === photoId) {
          setSelectedPhoto(prev => prev ? {
            ...prev,
            isLiked: !prev.isLiked,
            likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1
          } : null);
        }
      }
    } catch (error) {
      console.error('Erro ao curtir foto:', error);
    }
  };

  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `foto-${photo.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erro ao baixar foto:', error);
    }
  };

  const handleShare = async (photo: Photo) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Foto do evento',
          text: photo.description || 'Confira esta foto!',
          url: photo.url,
        });
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para copiar link
      navigator.clipboard.writeText(photo.url);
      // Aqui você pode mostrar um toast de sucesso
    }
  };

  const handleDelete = async (photoId: number) => {
    try {
      const response = await fetch(`/api/photos/${photoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setPhotos(prev => prev.filter(photo => photo.id !== photoId));
        setSelectedPhoto(null);
      }
    } catch (error) {
      console.error('Erro ao deletar foto:', error);
    }
  };

  const openPhotoViewer = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setSelectedIndex(index);
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, selectedIndex - 1)
      : Math.min(photos.length - 1, selectedIndex + 1);
    
    setSelectedIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header com contador e botão de upload */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">
          Galeria de Fotos ({photos.length})
        </Typography>
        
        {canUpload && (
          <Box>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              multiple
              style={{ display: 'none' }}
            />
            <Fab
              size="small"
              color="primary"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading || photos.length >= maxPhotos}
            >
              {uploading ? <CircularProgress size={24} /> : <PhotoCameraIcon />}
            </Fab>
          </Box>
        )}
      </Box>

      {photos.length === 0 ? (
        <Box textAlign="center" p={4}>
          <PhotoCameraIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Nenhuma foto ainda
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {canUpload ? 'Seja o primeiro a compartilhar uma foto!' : 'Aguarde as fotos serem compartilhadas'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {photos.map((photo, index) => (
            <Grid item xs={6} sm={4} md={3} key={photo.id}>
              <Card 
                sx={{ 
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}
                onClick={() => openPhotoViewer(photo, index)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={photo.thumbnailUrl}
                  alt={photo.title || 'Foto do evento'}
                  sx={{ objectFit: 'cover' }}
                />
                
                <CardActions sx={{ p: 1, justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(photo.id);
                      }}
                      color={photo.isLiked ? 'error' : 'default'}
                    >
                      {photo.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
                    <Typography variant="caption">
                      {photo.likesCount}
                    </Typography>
                  </Box>
                  
                  <Avatar
                    src={photo.uploadedBy.profilePicture}
                    sx={{ width: 24, height: 24 }}
                  >
                    {photo.uploadedBy.firstName[0]}
                  </Avatar>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Modal de visualização da foto */}
      <Dialog
        open={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { backgroundColor: 'black' }
        }}
      >
        <DialogContent sx={{ p: 0, position: 'relative' }}>
          {selectedPhoto && (
            <>
              <Box
                component="img"
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                }}
              />
              
              {/* Navegação */}
              {photos.length > 1 && (
                <>
                  <IconButton
                    sx={{ position: 'absolute', left: 16, top: '50%', color: 'white' }}
                    onClick={() => navigatePhoto('prev')}
                    disabled={selectedIndex === 0}
                  >
                    <ArrowBackIcon />
                  </IconButton>
                  
                  <IconButton
                    sx={{ position: 'absolute', right: 16, top: '50%', color: 'white' }}
                    onClick={() => navigatePhoto('next')}
                    disabled={selectedIndex === photos.length - 1}
                  >
                    <ArrowForwardIcon />
                  </IconButton>
                </>
              )}
              
              {/* Info da foto */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: 'white',
                  p: 2,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar
                    src={selectedPhoto.uploadedBy.profilePicture}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  >
                    {selectedPhoto.uploadedBy.firstName[0]}
                  </Avatar>
                  <Box>
                    <Typography variant="body2">
                      {selectedPhoto.uploadedBy.firstName} {selectedPhoto.uploadedBy.lastName}
                    </Typography>
                    <Typography variant="caption">
                      {formatDistanceToNow(new Date(selectedPhoto.uploadedAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </Typography>
                  </Box>
                </Box>
                
                {selectedPhoto.description && (
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {selectedPhoto.description}
                  </Typography>
                )}
                
                {selectedPhoto.tags.length > 0 && (
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {selectedPhoto.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        variant="outlined"
                        sx={{ color: 'white', borderColor: 'white' }}
                      />
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </DialogContent>
        
        <DialogActions sx={{ backgroundColor: 'black', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {selectedPhoto && (
              <>
                <IconButton
                  onClick={() => handleLike(selectedPhoto.id)}
                  color={selectedPhoto.isLiked ? 'error' : 'inherit'}
                  sx={{ color: 'white' }}
                >
                  {selectedPhoto.isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                
                <IconButton
                  onClick={() => handleDownload(selectedPhoto)}
                  sx={{ color: 'white' }}
                >
                  <DownloadIcon />
                </IconButton>
                
                <IconButton
                  onClick={() => handleShare(selectedPhoto)}
                  sx={{ color: 'white' }}
                >
                  <ShareIcon />
                </IconButton>
                
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  sx={{ color: 'white' }}
                >
                  <MoreVertIcon />
                </IconButton>
              </>
            )}
          </Box>
          
          <Button
            onClick={() => setSelectedPhoto(null)}
            sx={{ color: 'white' }}
            startIcon={<CloseIcon />}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menu de opções */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {selectedPhoto?.isOwner && (
          <MenuItem onClick={() => {
            handleDelete(selectedPhoto.id);
            setAnchorEl(null);
          }}>
            <DeleteIcon sx={{ mr: 1 }} />
            Deletar
          </MenuItem>
        )}
        
        <MenuItem onClick={() => setAnchorEl(null)}>
          <ReportIcon sx={{ mr: 1 }} />
          Reportar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default PhotoGallery; 