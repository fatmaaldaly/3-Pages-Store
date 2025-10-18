import React from 'react';
import { View} from 'react-native';
import { Provider } from 'react-redux';
import { store } from './store';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAppLock } from './hooks/useAppLock';
import LockOverlay from './components/LockOverlay';
import LoginScreen from './screens/LoginScreen';
import CategoryScreen from './screens/CategoryScreen';
import Tabs from './navigation/Tabs';
import { ThemeProvider, useThemeContext } from './context/ThemeContext';



const Stack = createNativeStackNavigator();
const queryClient = new QueryClient();

function MainApp() {
  const { locked, setLocked, resetTimer } = useAppLock(10000);
  const { theme } = useThemeContext();

  return (
    <NavigationContainer theme={theme}>
      <View
        style={{ flex: 1 }}
        onStartShouldSetResponder={() => {
          resetTimer();
          return false;
        }}
      >
  
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="Category" component={CategoryScreen} />
        </Stack.Navigator>
        {locked && <LockOverlay onUnlock={() => setLocked(false)} />}
      </View>
     

    </NavigationContainer>
  );
}

  
export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
       
        <ThemeProvider>
          <MainApp />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}

