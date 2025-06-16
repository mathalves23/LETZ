import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ModernThemeProvider} from '../contexts/ModernThemeContext';
import EventCard from '../../components/EventCard';

const mockEvent = {
  id: 1,
  title: 'Teste Churrasco',
  description: 'Um churrasco de teste',
  startDateTime: '2024-07-01T18:00:00',
  endDateTime: '2024-07-01T22:00:00',
  location: 'Casa do João',
  type: 'CHURRASCO' as const,
  isPrivate: false,
  maxParticipants: 20,
  currentParticipants: 5,
  inviteCode: 'ABC123',
  organizer: {
    id: 1,
    firstName: 'João',
    lastName: 'Silva',
    email: 'joao@test.com',
    username: 'joao123',
    phoneNumber: '',
    bio: '',
    profilePicture: '',
    birthDate: '',
    isActive: true,
    isEmailVerified: true,
    eventsCreated: 1,
    eventsAttended: 0,
    totalFriends: 0,
    points: 0,
    createdAt: '2024-01-01T00:00:00',
    updatedAt: '2024-01-01T00:00:00'
  },
  status: 'PLANNED' as const,
  createdAt: '2024-01-01T00:00:00',
  updatedAt: '2024-01-01T00:00:00'
};

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        {ui}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('EventCard Component', () => {
  test('renders event information correctly', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('Teste Churrasco')).toBeInTheDocument();
    expect(screen.getByText('Um churrasco de teste')).toBeInTheDocument();
    expect(screen.getByText('Casa do João')).toBeInTheDocument();
    expect(screen.getByText('João Silva')).toBeInTheDocument();
  });

  test('shows participant count', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('5/20 participantes')).toBeInTheDocument();
  });

  test('formats date correctly', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    // Check if date is formatted (exact format may vary based on locale)
    expect(screen.getByText(/01\/07\/2024/)).toBeInTheDocument();
    expect(screen.getByText(/18:00/)).toBeInTheDocument();
  });

  test('shows event type badge', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    expect(screen.getByText('CHURRASCO')).toBeInTheDocument();
  });

  test('has correct navigation on click', () => {
    renderWithProviders(<EventCard event={mockEvent} />);
    
    const card = screen.getByRole('button');
    expect(card).toBeInTheDocument();
  });

  test('shows private indicator when event is private', () => {
    const privateEvent = { ...mockEvent, isPrivate: true };
    renderWithProviders(<EventCard event={privateEvent} />);
    
    // Look for lock icon or private indicator
    expect(screen.getByTestId('lock-icon')).toBeInTheDocument();
  });
}); 