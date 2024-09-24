import { DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import theme from '@/utils/theme';
import { useColorScheme } from '@/hooks/useThemeColor';
import { ThemeProvider } from '@shopify/restyle';
import { QueryClient, QueryClientProvider } from 'react-query';
import useSessionStore from '@/stores/useSessionStore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
const queryClient = new QueryClient();
// Prevent the splash screen from auto-hiding before asset loading is complete.
//SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { isAuthenticated } = useSessionStore();
  const router = useRouter();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
   
      if (loaded) {
        //SplashScreen.hideAsync();
        if(!isAuthenticated)
          router.push('login');
      }
  }, [loaded]);
  useEffect(() => {
    if (isAuthenticated) {
      router.push('(home)');
    }
  }, [isAuthenticated]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Stack> 
            <Stack.Screen name="(home)" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="get-started" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </QueryClientProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
