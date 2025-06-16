import React, { useEffect, useState } from 'react';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  StatusBar,
  useColorScheme,
  Alert,
  AppState,
  AppStateStatus,
} from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SplashScreen from 'react-native-splash-screen';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { QueryClient, QueryClientProvider } from 'react-query';

// Screens
import LoginScreen from './screens/auth/LoginScreen';
import RegisterScreen from './screens/auth/RegisterScreen';
import HomeScreen from './screens/main/HomeScreen';
import EventsScreen from './screens/main/EventsScreen';
import CreateEventScreen from './screens/main/CreateEventScreen';
import EventDetailsScreen from './screens/main/EventDetailsScreen';
import ProfileScreen from './screens/main/ProfileScreen';
import FriendsScreen from './screens/main/FriendsScreen';
import MessagesScreen from './screens/main/MessagesScreen';
import NotificationsScreen from './screens/main/NotificationsScreen';
import SettingsScreen from './screens/main/SettingsScreen';
import QRScannerScreen from './screens/main/QRScannerScreen';
import TicketsScreen from './screens/main/TicketsScreen';
import MarketplaceScreen from './screens/main/MarketplaceScreen';

// Context
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { OfflineProvider } from './contexts/OfflineContext';

// Services
import { setupNotifications } from './services/notificationService';
import { syncOfflineData } from './services/offlineService';

// Types
type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  EventDetails: { eventId: number };
  CreateEvent: undefined;
  QRScanner: undefined;
};

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type MainTabParamList = {
  Home: undefined;
  Events: undefined;
  Messages: undefined;
  Profile: undefined;
  More: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Auth Navigator
const AuthNavigator = () => (
  <AuthStack.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: 'transparent' },
    }}
  >
    <AuthStack.Screen name="Login" component={LoginScreen} />
    <AuthStack.Screen name="Register" component={RegisterScreen} />
  </AuthStack.Navigator>
);

// Main Tab Navigator
const MainNavigator = () => {
  const { theme } = useTheme();
  
  return (
    <MainTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';
          
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'Events':
              iconName = 'event';
              break;
            case 'Messages':
              iconName = 'message';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            case 'More':
              iconName = 'more-horiz';
              break;
          }
          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.onPrimary,
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Início' }}
      />
      <MainTab.Screen 
        name="Events" 
        component={EventsScreen}
        options={{ title: 'Eventos' }}
      />
      <MainTab.Screen 
        name="Messages" 
        component={MessagesScreen}
        options={{ title: 'Mensagens' }}
      />
      <MainTab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{ title: 'Perfil' }}
      />
      <MainTab.Screen 
        name="More" 
        component={MoreScreen}
        options={{ title: 'Mais' }}
      />
    </MainTab.Navigator>
  );
};

// More Screen (Stack Navigator)
const MoreStack = createStackNavigator();
const MoreScreen = () => (
  <MoreStack.Navigator>
    <MoreStack.Screen 
      name="MoreMain" 
      component={MoreMainScreen}
      options={{ title: 'Mais' }}
    />
    <MoreStack.Screen 
      name="Friends" 
      component={FriendsScreen}
      options={{ title: 'Amigos' }}
    />
    <MoreStack.Screen 
      name="Notifications" 
      component={NotificationsScreen}
      options={{ title: 'Notificações' }}
    />
    <MoreStack.Screen 
      name="Tickets" 
      component={TicketsScreen}
      options={{ title: 'Meus Ingressos' }}
    />
    <MoreStack.Screen 
      name="Marketplace" 
      component={MarketplaceScreen}
      options={{ title: 'Marketplace' }}
    />
    <MoreStack.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{ title: 'Configurações' }}
    />
  </MoreStack.Navigator>
);

// More Main Screen
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const MoreMainScreen = ({ navigation }: any) => {
  const { theme } = useTheme();
  
  const menuItems = [
    { title: 'Amigos', icon: 'people', screen: 'Friends' },
    { title: 'Notificações', icon: 'notifications', screen: 'Notifications' },
    { title: 'Meus Ingressos', icon: 'confirmation-number', screen: 'Tickets' },
    { title: 'Marketplace', icon: 'store', screen: 'Marketplace' },
    { title: 'Configurações', icon: 'settings', screen: 'Settings' },
  ];
  
  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.menuItem, { backgroundColor: theme.colors.surface }]}
          onPress={() => navigation.navigate(item.screen)}
        >
          <Icon name={item.icon} size={24} color={theme.colors.primary} />
          <Text style={[styles.menuText, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Icon name="chevron-right" size={24} color={theme.colors.text} />
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Main App Component
const AppContent = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { theme } = useTheme();
  const [isConnected, setIsConnected] = useState(true);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    // Esconder splash screen
    SplashScreen.hide();
    
    // Setup notificações
    setupNotifications();
    
    // Monitorar conectividade
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      if (state.isConnected) {
        syncOfflineData();
      }
    });
    
    // Monitorar estado do app
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        // App voltou ao foreground
        syncOfflineData();
      }
      setAppState(nextAppState);
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      unsubscribe();
      subscription?.remove();
    };
  }, [appState]);

  // Mostrar indicador de loading durante autenticação
  if (authLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Carregando...</Text>
      </View>
    );
  }

  const navigationTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      background: theme.colors.background,
      card: theme.colors.surface,
      text: theme.colors.text,
      border: theme.colors.outline,
    },
  };

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar
        barStyle={theme.dark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.primary}
      />
      
      {!isConnected && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>Sem conexão com a internet</Text>
        </View>
      )}
      
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <RootStack.Screen name="Main" component={MainNavigator} />
            <RootStack.Screen 
              name="EventDetails" 
              component={EventDetailsScreen}
              options={{ headerShown: true, title: 'Detalhes do Evento' }}
            />
            <RootStack.Screen 
              name="CreateEvent" 
              component={CreateEventScreen}
              options={{ headerShown: true, title: 'Criar Evento' }}
            />
            <RootStack.Screen 
              name="QRScanner" 
              component={QRScannerScreen}
              options={{ headerShown: true, title: 'Scanner QR' }}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

// Main App with Providers
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider initialTheme={isDarkMode ? 'dark' : 'light'}>
        <AuthProvider>
          <OfflineProvider>
            <PaperProvider>
              <AppContent />
            </PaperProvider>
          </OfflineProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  offlineIndicator: {
    backgroundColor: '#f44336',
    padding: 8,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
  },
});

export default App; 