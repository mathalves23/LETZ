import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Grid,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ptBR } from 'date-fns/locale';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
  Save as SaveIcon,
  BugReport as TestIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { createEvent } from '../store/slices/eventSlice';
import { testEventCreation, testLogin } from '../utils/testEventCreation';

const eventTypes = [
  { value: 'CHURRASCO', label: 'Churrasco' },
  { value: 'FESTA', label: 'Festa' },
  { value: 'JANTAR', label: 'Jantar' },
  { value: 'REUNIAO', label: 'Reunião' },
  { value: 'ANIVERSARIO', label: 'Aniversário' },
  { value: 'OUTROS', label: 'Outros' },
];

const CreateEventPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.events);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    startDateTime: new Date(),
    endDateTime: null as Date | null,
    location: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    maxParticipants: '',
    isPrivate: true,
    requiresApproval: false,
    totalCost: '',
    hasCostSharing: false,
  });

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [testLoading, setTestLoading] = useState(false);

  const handleChange = (field: string) => (value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Limpar erros de validação
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    handleChange(name)(value);
  };

  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push('Título é obrigatório');
    }

    if (!formData.type) {
      errors.push('Tipo do evento é obrigatório');
    }

    if (!formData.location.trim()) {
      errors.push('Local é obrigatório');
    }

    if (formData.startDateTime <= new Date()) {
      errors.push('Data de início deve ser no futuro');
    }

    if (formData.endDateTime && formData.endDateTime <= formData.startDateTime) {
      errors.push('Data de fim deve ser após a data de início');
    }

    if (formData.maxParticipants && parseInt(formData.maxParticipants) < 1) {
      errors.push('Número máximo de participantes deve ser maior que 0');
    }

    if (formData.totalCost && parseFloat(formData.totalCost) < 0) {
      errors.push('Custo total não pode ser negativo');
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

    const eventData = {
      ...formData,
      startDateTime: formData.startDateTime.toISOString(),
      endDateTime: formData.endDateTime ? formData.endDateTime.toISOString() : undefined,
      maxParticipants: formData.maxParticipants ? parseInt(formData.maxParticipants) : undefined,
      totalCost: formData.totalCost ? parseFloat(formData.totalCost) : undefined,
      latitude: formData.latitude || undefined,
      longitude: formData.longitude || undefined,
    };

    try {
      const result = await dispatch(createEvent(eventData));
      if (createEvent.fulfilled.match(result)) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro ao criar evento:', error);
    }
  };

  const handleTestEvent = async () => {
    setTestLoading(true);
    try {
      // Primeiro fazer login
      await testLogin();
      
      // Depois criar evento
      await testEventCreation();
      
      alert('Teste realizado com sucesso! Verifique o console para detalhes.');
    } catch (error) {
      console.error('Erro no teste:', error);
      alert('Erro no teste. Verifique o console para detalhes.');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <EventIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h4" component="h1">
            Criar Evento
          </Typography>
        </Box>

        {/* Botão de teste para debug */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={testLoading ? <CircularProgress size={20} /> : <TestIcon />}
            onClick={handleTestEvent}
            disabled={testLoading}
          >
            {testLoading ? 'Testando...' : 'Teste de Criação de Evento'}
          </Button>
        </Box>

        {(error || validationErrors.length > 0) && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || validationErrors.map((err, index) => (
              <div key={index}>{err}</div>
            ))}
          </Alert>
        )}

        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Informações Básicas */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Informações Básicas
                </Typography>
              </Grid>

              <Grid item xs={12} md={8}>
                <TextField
                  fullWidth
                  required
                  name="title"
                  label="Título do Evento"
                  value={formData.title}
                  onChange={handleTextFieldChange}
                  disabled={isLoading}
                  placeholder="Ex: Churrasco de fim de semana"
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel>Tipo de Evento</InputLabel>
                  <Select
                    value={formData.type}
                    label="Tipo de Evento"
                    onChange={(e) => handleChange('type')(e.target.value)}
                    disabled={isLoading}
                  >
                    {eventTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  name="description"
                  label="Descrição"
                  value={formData.description}
                  onChange={handleTextFieldChange}
                  disabled={isLoading}
                  placeholder="Descreva seu evento..."
                />
              </Grid>

              {/* Data e Hora */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Data e Hora
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Data e Hora de Início"
                  value={formData.startDateTime}
                  onChange={handleChange('startDateTime')}
                  disabled={isLoading}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      required: true
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <DateTimePicker
                  label="Data e Hora de Fim (opcional)"
                  value={formData.endDateTime}
                  onChange={handleChange('endDateTime')}
                  disabled={isLoading}
                  slotProps={{
                    textField: {
                      fullWidth: true
                    }
                  }}
                />
              </Grid>

              {/* Localização */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Localização
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  name="location"
                  label="Local"
                  value={formData.location}
                  onChange={handleTextFieldChange}
                  disabled={isLoading}
                  placeholder="Ex: Casa do João"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="address"
                  label="Endereço Completo"
                  value={formData.address}
                  onChange={handleTextFieldChange}
                  disabled={isLoading}
                  placeholder="Rua, número, bairro, cidade"
                />
              </Grid>

              {/* Configurações */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Configurações
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="maxParticipants"
                  label="Máximo de Participantes"
                  type="number"
                  value={formData.maxParticipants}
                  onChange={handleTextFieldChange}
                  disabled={isLoading}
                  placeholder="Deixe vazio para ilimitado"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PeopleIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  name="totalCost"
                  label="Custo Estimado (R$)"
                  type="number"
                  value={formData.totalCost}
                  onChange={handleTextFieldChange}
                  disabled={isLoading}
                  inputProps={{ step: "0.01" }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isPrivate}
                      onChange={(e) => handleChange('isPrivate')(e.target.checked)}
                      disabled={isLoading}
                    />
                  }
                  label="Evento Privado (apenas convidados)"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.requiresApproval}
                      onChange={(e) => handleChange('requiresApproval')(e.target.checked)}
                      disabled={isLoading}
                    />
                  }
                  label="Requer aprovação para participar"
                />
              </Grid>

              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.hasCostSharing}
                      onChange={(e) => handleChange('hasCostSharing')(e.target.checked)}
                      disabled={isLoading}
                    />
                  }
                  label="Dividir custos entre participantes"
                />
              </Grid>

              {/* Botões */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/dashboard')}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando...' : 'Criar Evento'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </LocalizationProvider>
      </Paper>
    </Container>
  );
};

export default CreateEventPage; 