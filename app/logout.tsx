
import { Image, StyleSheet, Platform, Dimensions, Linking, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import useLogin from '@/auth/hooks/useLogin';
import useSessionStore from '@/auth/stores/useSessionStore';
import { LoginForm } from '@/auth/components/LoginForm';
import LoadingBlock from '@/common/components/LoadingBlock';
import { useEffect } from 'react';



const LogoutScreen = () => {

  const logout = useSessionStore(x => x.logout);
  useEffect(() => {
    console.log('logout')
    logout();
  }, [])
  return (
    <>
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <LoadingBlock />
    </SafeAreaView>
    </>
  );
}

export default LogoutScreen;
