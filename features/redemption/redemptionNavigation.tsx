import * as React from 'react';
import { Stack } from 'expo-router';




export const RedemptionNavigator = ({ navigation }: any) => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminSchoolSelector" />
      <Stack.Screen name="AdminEventSelector" />
      <Stack.Screen name="TicketScanner" />
      <Stack.Screen name="EventTicketList" />
    </Stack>
  );
};
export default { RedemptionNavigator };
