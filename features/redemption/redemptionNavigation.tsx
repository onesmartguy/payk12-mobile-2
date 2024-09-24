import * as React from 'react';
import { Image } from 'react-native';
import { ParamListBase, useNavigation } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { faArrowLeft, faBars } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { School, Ticket } from '../common/types';
import { Images } from '../../assets';
import { Box } from '../../ui';

import {
  AdminEventSelectionScreen,
  AdminEventTicketListScreen,
  AdminSchoolSelectionScreen,
  TicketScannerScreen,
} from './screens';

export const RedemptionNavigator = ({ navigation }: any) => {
  return (
    <Stack
      screenOptions={{ headerShown: false  }}

    >
      <Stack.Screen
        name="AdminSchoolSelector"
        component={AdminSchoolSelectionScreen}
      />
      <Stack.Screen
        name="AdminEventSelector"
        component={AdminEventSelectionScreen}
      />
      <Stack.Screen name="TicketScanner" component={TicketScannerScreen} />
      <Stack.Screen
        name="EventTicketList"
        component={AdminEventTicketListScreen}
      />
    </Stack.Navigator>
  );
};
export default { RedemptionNavigator };
