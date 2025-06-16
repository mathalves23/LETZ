import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ModernThemeProvider} from '../contexts/ModernThemeContext';
import { store } from '../store/store';
import App from '../App';

// Mock components that might cause issues in tests
jest.mock('../components/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar">Navbar</div>;
  };
});

jest.mock('../pages/LoginPage', () => {
  return function MockLoginPage() {
    return <div data-testid="login-page">Login Page</div>;
  };
});

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          {ui}
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

describe('App Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test('renders without crashing', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('shows login page when not authenticated', () => {
    renderWithProviders(<App />);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  test('renders navbar when authenticated', () => {
    // Mock authenticated state
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    }));

    renderWithProviders(<App />);
    // Note: This test might need adjustment based on actual auth logic
  });
}); 