
import { Images } from '@/assets';
import Box from '@/features/common/components/Box';
import Button from '@/features/common/components/Button';
import TextView from '@/features/common/components/TextView';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, StyleSheet, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function GetStartedScreen() {
  const router = useRouter();
  const win = Dimensions.get('window');
  const logoWidth = (win.width / 3) * 2;

  return (
    <SafeAreaView style={StyleSheet.absoluteFill}>
      <Box flex={1} justifyContent="center" alignItems="center">
        <Image
          source={Images.logo}
          style={{ width: logoWidth, resizeMode: 'contain' }}
        />
        <TextView
          textTransform="uppercase"
          letterSpacing={4}
          marginTop="s"
          color="headerText"
          fontWeight="500"
        >
          BOX OFFICE
        </TextView>
      </Box>
      <Box flex={1} justifyContent="center" alignItems="center">
        <Box
          flex={1}
          width="70%"
          justifyContent="space-around"
          alignItems="center"
        >
          <TextView
            textTransform="uppercase"
            marginTop="lg"
            textAlign="center"
            color="infoText"
            letterSpacing={3}
          >
            VERSION V1.0.8
          </TextView>
          <TextView marginTop="lg" textAlign="center">
            Elite-level event and stadium ticketing mobile app
          </TextView>
        </Box>
      </Box>
      <Box flex={1} marginHorizontal="m" justifyContent="center">
        <Button variant="primary" label="Sign In" onPress={() => router.push('login')} />
      </Box>
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
