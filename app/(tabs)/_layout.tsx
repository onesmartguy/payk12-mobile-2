import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useThemeColor';
import useSessionStore from '@/stores/useSessionStore';
import { SafeAreaView } from 'react-native';
import HeaderView from '@/components/HeaderView';
import LoadingModal from '@/components/modals/LoadingModal';
import useUiStore from '@/stores/useUiStore';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const {} = useSessionStore();
  const { showHeader, isLoading } = useUiStore();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' } }>
      <HeaderView {...{}} />
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
    </Tabs>
    {isLoading && <LoadingModal />}
    </SafeAreaView>
  );
}


