import { Stack } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { palette } from '@/utils/theme';
import { useColorScheme, useThemeColor } from '@/hooks/useThemeColor';
import useSessionStore from '@/stores/useSessionStore';
import { SafeAreaView } from 'react-native';
import HeaderView from '@/components/HeaderView';
import LoadingModal from '@/components/modals/LoadingModal';
import useUiStore from '@/stores/useUiStore';
import Box from '@/components/ui/Box';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const {} = useSessionStore();
  const { showHeader, isLoading } = useUiStore();
  return (
    <SafeAreaView style={{ flex: 1 } }>
      <Box flex={1}>
        <HeaderView {...{}} />
        <Stack screenOptions={{ headerShown: false }} />
      </Box>
    {isLoading && <LoadingModal />}
    </SafeAreaView>
  );
}


