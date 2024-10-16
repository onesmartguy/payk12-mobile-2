import React, {useContext, useEffect, useLayoutEffect} from 'react';
import {DrawerScreenProps} from '@react-navigation/drawer';


import BasicListItem from '@/common/components/BasicListItem';
import Box from '@/features/common/components/Box';
import TextView from '@/features/common/components/TextView';
import useSessionStore from '@/auth/stores/useSessionStore';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerNavigationProps, DrawerParamList } from '@/common/navigation';
import useUserVouchersStore from '@/ticketing/stores/useUserVouchersStore';
import ViewWithHeader from '@/common/components/ViewWithHeader';


export const HomeScreen: React.FC<any> = ({}) => {
  const router = useRouter();
  const { user, permissions, isAuthenticated } = useSessionStore();
  const titleText = `Hi, ${user?.firstName ?? 'there!'}`;
  const subTitleText = `Need to get into an event? Find your ticket or pass by selecting an option below.`;
  const resetFilter = useUserVouchersStore(x => x.resetFilter)
 

  return (
    <ViewWithHeader>
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
              resetFilter()
              router.navigate('vouchers/tickets')
            }}
          />
          <BasicListItem
            label="My Passes"
            onPress={() => {
              resetFilter()
              router.navigate('vouchers/passes');
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
          <BasicListItem
              label="Scanning / Guest Check-In"
              onPress={() => {
                router.navigate('redemption/scanner');
              }}
            />
        </Box>
      </Box>
      </ViewWithHeader>
  );
};

export default HomeScreen