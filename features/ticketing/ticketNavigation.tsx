import * as React from 'react';
import { ParamListBase } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { School, Ticket } from '../common/types';

import { TicketSelectionScreen, PassSelectionScreen } from './screens';

import { useAppContext } from '../auth/authSlice';

export const NavScreens = {
  redemption: {
    AdminSchoolSelector: 'AdminSchoolSelector',
    AdminEventSelector: 'AdminEventSelector',
    TicketScanner: 'TicketScanner',
    EventTicketList: 'EventTicketList',
  },
  ticketing: {
    SchoolSelector: 'SchoolSelector',
    EventSelector: 'EventSelector',
    TicketSelector: 'TicketSelector',
  },
  Home: 'Home',
  Auth: 'Auth',
  About: 'About',
  Login: 'Login',
  Menu: 'Menu',
};
export interface PassholderScreens extends ParamListBase {
  Home: object | undefined;
  About: any | undefined;
  SchoolSelector: { schools: School[]; onBack: () => void };
  EventSelector: { events?: Event[]; onBack?: () => void };
  SchoolPickerModal: {
    schools: School[];
    onSelected?: (school: School) => void;
    onBack?: () => void;
  };
  EventPickerModal: {
    events: Event[];
    onSelected?: (event: Event) => void;
    onBack?: () => void;
  };
  PassSelector: any | undefined;
  TicketSelector: { tickets?: Ticket[] } | undefined;
  TicketScanner: any | undefined;
  Menu: any | undefined;
  Auth: object | undefined;
  Login: undefined;
}

export const MyPassesNavigator = () => {
  const Stack = createStackNavigator();
  const { user } = useAppContext()
  return (
    <Stack.Navigator
      defaultScreenOptions={{ headerShown: false }}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="PassSelector" component={PassSelectionScreen} />
    </Stack.Navigator>
  );
};
export const MyTicketsNavigator = () => {
  const Stack = createStackNavigator();
  const { user } = useAppContext()
  return (
    <Stack.Navigator
      defaultScreenOptions={{ headerShown: false }}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="TicketViewer" component={TicketSelectionScreen} />
    </Stack.Navigator>
  );
};

export default { MyPassesNavigator, MyTicketsNavigator };
