import { eventAPI } from '../services/api';

export const testEventCreation = async () => {
  try {
    const eventData = {
      title: "Teste de Evento Frontend",
      description: "Evento criado para teste do frontend",
      type: "CHURRASCO",
      startDateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Amanhã
      location: "Casa do Teste",
      isPrivate: true,
      requiresApproval: false,
      hasCostSharing: false
    };

    console.log('Enviando dados do evento:', eventData);
    
    const response = await eventAPI.createEvent(eventData);
    
    console.log('Evento criado com sucesso:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Erro ao criar evento:', error);
    console.error('Resposta do erro:', error.response?.data);
    throw error;
  }
};

export const testLogin = async () => {
  try {
    const loginData = {
      email: "admin@letz.com",
      password: "admin123"
    };

    console.log('Fazendo login...');
    
    const response = await fetch('http://localhost:5005/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData)
    });

    const data = await response.json();
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('Login realizado com sucesso, token salvo');
      return data;
    } else {
      throw new Error('Token não recebido');
    }
  } catch (error) {
    console.error('Erro no login:', error);
    throw error;
  }
}; 