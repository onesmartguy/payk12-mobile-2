import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  DrawerScreenProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import moment from 'moment';
import {useNavigation, useIsFocused, useRoute} from '@react-navigation/native';
import {isArray} from 'lodash';

import * as Icons from '../../../assets/icon';
import {MainLayout} from '../../../components';
import {Text, Box, Button, LoadingBlock} from '../../../ui';
import {Event, Redemption} from '../../common/types';
import QRScanner, {BarcodeResult} from '../../../components/QRScanner';
import {EventUtils} from '../../../utils';
import {useMultiScanner} from '../hooks/useMultiScanner';
import {useAppContext} from '../../auth/authSlice';
import {
  RedemptionLogSheet,
  RedemptionLogBottomSheet,
  MultiScanErrorBottomSheet,
  MultiScanErrorSheet,
} from '../sheets';
import {palette} from '../../../ui/theme';
import { StackParamList } from '@app/navigation';

type Props = DrawerScreenProps<StackParamList, 'TicketScanner'>;

const eventDates = (event: Event) => ({
  date: moment(event.startTime).format('MM/DD/YY'),
  day: moment(event.startTime).format('ddd'),
  time: moment(event.startTime).format('hh:mma'),
});

export const TicketScanResult = ({
  redemptionStatus,
}: {
  redemptionStatus?: Redemption;
}) => {
  const readyToScannText = 'Ready to Scan';
  const df = redemptionStatus ? EventUtils.getDateAsString(new Date()) : '';
  const previousScansText = `${df}`;
  const details = 'Ticket {0}';
  const lastScan = JSON.stringify(redemptionStatus);

  if (!redemptionStatus) {
    return (
      <Box alignItems="center" backgroundColor="mainBackground">
        <Text fontSize={24} lineHeight={28} marginBottom="m">
          Ready to scan
        </Text>
        <Icons.QrCodeIcon height={72} width={72} />
      </Box>
    );
  }

  let Icon = Icons.ValidIcon;
  let lastStatus = 'Invalid Ticket/Pass';
  let lastStatusDetails = '';
  let color = palette.red;
  let detailColor = palette.red;
  switch (redemptionStatus.status.toLowerCase()) {
    case 'valid':
      Icon = Icons.ValidIcon;
      lastStatus = '';
      color = palette.green;
      break;
    case 'duplicate':
      Icon = Icons.DuplicateIcon;
      lastStatus = 'Duplicate Ticket/Pass';
      lastStatusDetails = redemptionStatus.message;
      color = palette.black;
      detailColor = palette.red;
      break;
    case 'conflict':
      Icon = Icons.InvalidIcon;
      lastStatus = 'Ticket/Pass Not Supported';
      color = palette.black;
      break;
    default:
      Icon = Icons.InvalidIcon;
      lastStatus = 'Invalid Ticket/Pass';
      color = palette.black;
      break;
  }

  return (
    <Box alignItems="center" marginTop="m" marginHorizontal="lg">
      {Icon && <Icon height={72} width={72} />}
      <Text
        marginTop="m"
        fontSize={22}
        lineHeight={24}
        style={{color}}
        textAlign="center">
        {lastStatus}
      </Text>
      <Text
        fontSize={14}
        lineHeight={16}
        style={{color: detailColor}}
        textAlign="center">
        {lastStatusDetails}
      </Text>
    </Box>
  );
};

export const TicketScannerScreen = ({ navigation, route }: Props) => {
  const redemptionLogRef = useRef<RedemptionLogSheet>(null);
  const multiScanErrorRef = useRef<MultiScanErrorSheet>(null);
  const { events } = route.params!;
  // variables
  const [lastScan, setLastScan] = useState();
  const handleOpenPress = () => {
    if (redemptionLogRef.current) {
      redemptionLogRef.current.show();
    }
  };

  useEffect(() => {
    if (!events) {
      navigation.navigate('AdminEventSelector');
    }
  }, [events]);
  const isFocused = useIsFocused();
  const {isUpdating, redeemTicket, redemptions} = useMultiScanner(events);
  let statusTimeout: any;
  const resetLastStatus = () => {
    if (statusTimeout) clearTimeout(statusTimeout);
    setLastScan(undefined);
  };
  const validateTicket = async (code: BarcodeResult) => {
    if (code.rawValue) {
      let ticketNumbers: string | string[] = code.rawValue || '';
      if (ticketNumbers.includes('|')) {
        ticketNumbers = ticketNumbers.split('|');
      }
      try {
        const results = await redeemTicket(ticketNumbers);
        if (results != null) {
          if (isArray(results)) {
            if (results.length === 1) {
              setLastScan(results[0] as any);
              statusTimeout = setTimeout(resetLastStatus, 2000);
            }
            if (results.length > 1) {
              if (results.every(x => x.isValid)) {
                statusTimeout = setTimeout(resetLastStatus, 2000);
                setLastScan(results[0] as any);
              } else {
                statusTimeout = setTimeout(resetLastStatus, 2000);
                setLastScan(results.find(x => !x.isValid) as any);
                if (multiScanErrorRef.current) {
                  multiScanErrorRef.current.show(results);
                }
              }
            }
          }
        }
      } catch (error) {
        resetLastStatus();
      }
    }
  };

  var currentEvent = events[0];
  const renderContent = () => {
    if (!isFocused) return null;
    if (!currentEvent) return <LoadingBlock />;
    const titleText = currentEvent?.name;
    const df = eventDates(currentEvent!);
    const eventDate = `${df.date} - ${df.day} - ${df.time}`;
    return (
      <>
        <Box
          marginVertical="m">
          <Text variant="header" textAlign="center">
            {titleText}
          </Text>
          <Text marginTop="m" textAlign="center">
            {eventDate}
          </Text>
        </Box>
        <Box flex={1} backgroundColor="bodyText">
          <QRScanner
            {...StyleSheet.absoluteFillObject}
            onBarcodeFound={code => validateTicket(code)}
          />
        </Box>
        <Box flex={1}>
          <Box flex={1} alignItems="center" justifyContent="center">
            <TicketScanResult redemptionStatus={lastScan} />
          </Box>
          <Box paddingHorizontal="2xl">
            <Button
              label="Customer Check-In"
              variant="primary"
              onPress={() => navigation.navigate('EventTicketList', {events: events})}
            />
            <Button label="View Previous Scans" onPress={handleOpenPress} />
          </Box>
        </Box>
      </>
    );
  };
  return (
    <BottomSheetModalProvider>
      <MainLayout
        showHeader
        headerOptions={{
          onBackPress: () => navigation.navigate('AdminEventSelector'),
        }}>
        <Box flex={1}>{renderContent()}</Box>
        <RedemptionLogBottomSheet ref={redemptionLogRef} events={events} />
        <MultiScanErrorBottomSheet ref={multiScanErrorRef} />
      </MainLayout>
    </BottomSheetModalProvider>
  );
};

export default TicketScannerScreen;
