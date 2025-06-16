import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Alert,
  Tab,
  Tabs,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Speed as SpeedIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

interface SystemMetrics {
  activeUsers: number;
  totalEvents: number;
  errorRate: number;
  avgResponseTime: number;
  uptime: string;
  memoryUsage: number;
  cpuUsage: number;
}

interface ErrorLog {
  id: string;
  message: string;
  timestamp: Date;
  userId?: string;
  url: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolved: boolean;
}

interface PerformanceData {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

const MonitoringDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [metrics, setMetrics] = useState<SystemMetrics>({
    activeUsers: 0,
    totalEvents: 0,
    errorRate: 0,
    avgResponseTime: 0,
    uptime: '0h 0m',
    memoryUsage: 0,
    cpuUsage: 0,
  });
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [performance, setPerformance] = useState<PerformanceData>({
    pageLoadTime: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    firstInputDelay: 0,
    cumulativeLayoutShift: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSystemMetrics();
    loadErrorLogs();
    loadPerformanceData();
    
    // Atualizar métricas a cada 30 segundos
    const interval = setInterval(() => {
      loadSystemMetrics();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadSystemMetrics = async () => {
    try {
      const response = await fetch('/api/monitoring/metrics', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Erro ao carregar métricas:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadErrorLogs = async () => {
    try {
      const response = await fetch('/api/monitoring/errors', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setErrors(data);
      }
    } catch (error) {
      console.error('Erro ao carregar logs de erro:', error);
    }
  };

  const loadPerformanceData = async () => {
    try {
      const response = await fetch('/api/monitoring/performance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setPerformance(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de performance:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getHealthStatus = () => {
    if (metrics.errorRate > 5) return { color: 'error', text: 'Crítico' };
    if (metrics.errorRate > 2) return { color: 'warning', text: 'Atenção' };
    return { color: 'success', text: 'Saudável' };
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Carregando dashboard de monitoramento...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard de Monitoramento
      </Typography>

      {/* Status Geral */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PeopleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{metrics.activeUsers}</Typography>
              </Box>
              <Typography color="text.secondary">Usuários Ativos</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">{metrics.totalEvents}</Typography>
              </Box>
              <Typography color="text.secondary">Total de Eventos</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <SpeedIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">{metrics.avgResponseTime}ms</Typography>
              </Box>
              <Typography color="text.secondary">Tempo de Resposta</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ErrorIcon color="error" sx={{ mr: 1 }} />
                <Typography variant="h6">{metrics.errorRate}%</Typography>
              </Box>
              <Typography color="text.secondary">Taxa de Erro</Typography>
              <Chip 
                label={getHealthStatus().text}
                color={getHealthStatus().color as any}
                size="small"
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Status do Sistema */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Status do Sistema</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Uptime"
                    secondary={metrics.uptime}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Uso de Memória"
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={metrics.memoryUsage} 
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2">
                          {metrics.memoryUsage}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Uso de CPU"
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <LinearProgress 
                          variant="determinate" 
                          value={metrics.cpuUsage}
                          color={metrics.cpuUsage > 80 ? 'error' : 'primary'}
                          sx={{ mb: 1 }}
                        />
                        <Typography variant="body2">
                          {metrics.cpuUsage}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>Performance Web</Typography>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Page Load Time"
                    secondary={`${performance.pageLoadTime}ms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="First Contentful Paint"
                    secondary={`${performance.firstContentfulPaint}ms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Largest Contentful Paint"
                    secondary={`${performance.largestContentfulPaint}ms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="First Input Delay"
                    secondary={`${performance.firstInputDelay}ms`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Cumulative Layout Shift"
                    secondary={performance.cumulativeLayoutShift.toFixed(3)}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs para Logs e Alertas */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label="Logs de Erro" />
            <Tab label="Alertas" />
          </Tabs>
        </Box>

        {tabValue === 0 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Logs de Erro Recentes
            </Typography>
            {errors.length === 0 ? (
              <Alert severity="success">
                Nenhum erro encontrado no sistema!
              </Alert>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Timestamp</TableCell>
                      <TableCell>Mensagem</TableCell>
                      <TableCell>Severidade</TableCell>
                      <TableCell>URL</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {errors.slice(0, 10).map((error) => (
                      <TableRow key={error.id}>
                        <TableCell>
                          {new Date(error.timestamp).toLocaleString()}
                        </TableCell>
                        <TableCell>{error.message}</TableCell>
                        <TableCell>
                          <Chip
                            label={error.severity}
                            color={
                              error.severity === 'critical' ? 'error' :
                              error.severity === 'high' ? 'warning' :
                              'default'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" noWrap>
                            {error.url}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={error.resolved ? 'Resolvido' : 'Pendente'}
                            color={error.resolved ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        )}

        {tabValue === 1 && (
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Alertas do Sistema
            </Typography>
            
            {metrics.errorRate > 5 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Taxa de erro crítica: {metrics.errorRate}%
              </Alert>
            )}
            
            {metrics.cpuUsage > 80 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Alto uso de CPU: {metrics.cpuUsage}%
              </Alert>
            )}
            
            {metrics.memoryUsage > 90 && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                Alto uso de memória: {metrics.memoryUsage}%
              </Alert>
            )}
            
            {metrics.avgResponseTime > 1000 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Tempo de resposta elevado: {metrics.avgResponseTime}ms
              </Alert>
            )}

            {metrics.errorRate <= 5 && metrics.cpuUsage <= 80 && 
             metrics.memoryUsage <= 90 && metrics.avgResponseTime <= 1000 && (
              <Alert severity="success">
                Todos os sistemas funcionando normalmente!
              </Alert>
            )}
          </CardContent>
        )}
      </Card>
    </Box>
  );
};

export default MonitoringDashboard; 