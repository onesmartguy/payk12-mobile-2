import { loginUser } from '@/api/auth';
import { Images } from '@/assets';
import { Box, Button, palette, TextField, TextView } from '@/components';
import { faTimesCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, Platform, Dimensions, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useSessionStore  from '@/stores/useSessionStore';
import { LoginForm } from '@/components/forms/LoginForm';
import { useRouter } from 'expo-router';
import useLogin from '@/hooks/useLogin';



export default function LoginScreen() {

  const win = Dimensions.get('window');
  const logoWidth = (win.width / 3) * 2;
  const router = useRouter();
  const { mutateAsync } = useLogin();
  const isAuthenticated = useSessionStore(x => x.isAuthenticated);

  const handleSubmit = async (values: { username: string; password: string }) => {
    await mutateAsync(values);
  };




  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <LoginForm onSubmit={handleSubmit} value={{username: 'test1@test.com', password: 'SuperPass@2024!'}} />
    </SafeAreaView>
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
