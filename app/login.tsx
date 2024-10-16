
import { Image, StyleSheet, Platform, Dimensions, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import useLogin from '@/auth/hooks/useLogin';
import useSessionStore from '@/auth/stores/useSessionStore';
import { LoginForm } from '@/auth/components/LoginForm';
import { useEffect } from 'react';



export default function LoginScreen() {

  const win = Dimensions.get('window');
  const logoWidth = (win.width / 3) * 2;
  const router = useRouter();
  const { mutateAsync } = useLogin();
  const isAuthenticated = useSessionStore(x => x.isAuthenticated);

  const handleSubmit = async (values: { username: string; password: string }) => {
    console.log('values', values);
    await mutateAsync(values);
  };

  return (
    <>
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <LoginForm onSubmit={handleSubmit} value={{username: 'mobiletest@payk12.com', password: 'SuperPass@2024!'}} />
    </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    flex: 1,
  }
});
