import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {DrawerScreenProps} from '@react-navigation/drawer';


import BasicListItem from '@/components/BasicListItem';
import Box from '@/ui/Box';
import TextView from '@/ui/TextView';
import { useSessionStore } from '@/stores';


export const HomeScreen: React.FC<any> = ({navigation, route}) => {
  const { user, permissions } = useSessionStore();
  const titleText = `Hi, ${user?.firstName ?? 'there!'}`;
  const subTitleText = `Need to get into an event? Find your ticket or pass by selecting an option below.`;

  return (
  
      <Box flex={1} paddingHorizontal="2xl" >
        <Box>
          <TextView color="secondaryText" variant="title">
            {titleText}
          </TextView>
          <TextView>{subTitleText}</TextView>
        </Box>
        <Box paddingTop="2xl">
          <BasicListItem
            label="My Tickets"
            onPress={() => {
              navigation.navigate('MyTickets');
            }}
          />
          <BasicListItem
            label="My Passes"
            onPress={() => {
              navigation.navigate('MyPasses');
            }}
          />
          {/* {permissions?.canRedeemTickets && (
            <BasicListItem
              label="Scanning / Guest Check-In"
              onPress={() => {
                navigation.navigate('RedemptionHome');
              }}
            />
          )} */}
        </Box>
      </Box>
  );
};

export default HomeScreen