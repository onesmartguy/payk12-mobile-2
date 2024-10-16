
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { useEffect } from 'react';
import 'react-native-reanimated';
import 'react-native-gesture-handler';
import theme from '@/utils/theme';
import { ThemeProvider } from '@shopify/restyle';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useSessionStore from '@/auth/stores/useSessionStore';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginScreen from './login';
const queryClient = new QueryClient();

// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const isAuthenticated  = useSessionStore(x => x.token);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const router = useRouter();
  useEffect(() => {
   
      if (loaded) {
        //SplashScreen.hideAsync();
      }
  }, [loaded]);


  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
         
          {isAuthenticated ? <Drawer screenOptions={{ headerShown: false, }} /> : <LoginScreen />}
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
