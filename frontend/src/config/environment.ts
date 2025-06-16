// Configurações de ambiente para LETZ
export const config = {
  // API Configuration
  apiUrl: process.env.REACT_APP_API_URL || 'http://localhost:5005',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
  version: process.env.REACT_APP_VERSION || '1.0.0',
  
  // PWA
  pwaEnabled: process.env.REACT_APP_PWA_ENABLED === 'true',
  
  // Analytics
  googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID,
  
  // Maps
  googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  
  // Social Login
  facebookAppId: process.env.REACT_APP_FACEBOOK_APP_ID,
  googleClientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  
  // Payment
  stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  
  // Features flags
  features: {
    gamification: true,
    analytics: true,
    socialLogin: true,
    darkMode: true,
    pwa: true,
    chat: true,
    maps: true,
    payments: true,
    ai: true
  }
};

export const isProduction = config.environment === 'production';
export const isDevelopment = config.environment === 'development'; 