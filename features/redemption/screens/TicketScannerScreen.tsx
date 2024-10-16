import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  DrawerScreenProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import { format } from 'date-fns';
import { EventModel, RedemptionModel } from '@/common/types';
import EventUtils from '@/utils/events';
import Box from '@/common/components/Box';
import TextView from '@/common/components/TextView';
import * as Icons from '@/assets/svgs';
import { palette } from '@/utils/theme';
import { MultiScanErrorBottomSheet, MultiScanErrorSheet, RedemptionLogBottomSheet, RedemptionLogSheet } from '../sheets';
import { useRouter } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import useMultiScanner from '../hooks/useMultiScanner';
import QRScanner, { BarcodeResult } from '@/common/components/QRScanner';
import { isArray } from 'lodash';
import Button from '@/common/components/Button';
import LoadingBlock from '@/common/components/LoadingBlock';


const eventDates = (event: EventModel) => ({
  date: format(event.startTime, 'MM/dd/yy'),
  day: format(event.startTime, 'ddd'),
  time: format(event.startTime, 'hh:mma'),
});

export const TicketScanResult = ({
  redemptionStatus,
}: {
  redemptionStatus?: RedemptionModel;
}) => {
  const readyToScannText = 'Ready to Scan';
  const df = redemptionStatus ? EventUtils.getDateAsString(new Date()) : '';
  const previousScansText = `${df}`;
  const details = 'Ticket {0}';
  const lastScan = JSON.stringify(redemptionStatus);

  if (!redemptionStatus) {
    return (
      <Box alignItems="center" backgroundColor="mainBackground">
        <TextView fontSize={24} lineHeight={28} marginBottom="m">
          Ready to scan
        </TextView>
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
      <TextView
        marginTop="m"
        fontSize={22}
        lineHeight={24}
        style={{color}}
        textAlign="center">
        {lastStatus}
      </TextView>
      <TextView
        fontSize={14}
        lineHeight={16}
        style={{color: detailColor}}
        textAlign="center">
        {lastStatusDetails}
      </TextView>
    </Box>
  );
};

export const TicketScannerScreen = ({events}:{events: EventModel[]}) => {
  const router = useRouter()
  const redemptionLogRef = useRef<RedemptionLogSheet>(null);
  const multiScanErrorRef = useRef<MultiScanErrorSheet>(null);
  // variables
  const [lastScan, setLastScan] = useState();
  const handleOpenPress = () => {
    if (redemptionLogRef.current) {
      redemptionLogRef.current.show();
    }
  };

  useEffect(() => {
    if (!events) {
      router.navigate('AdminEventSelector');
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
        ticketNumbers = (ticketNumbers as string).split('|');
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
          <TextView variant="header" textAlign="center">
            {titleText}
          </TextView>
          <TextView marginTop="m" textAlign="center">
            {eventDate}
          </TextView>
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
              onPress={() => router.navigate('EventTicketList', {events: events})}
            />
            <Button label="View Previous Scans" onPress={handleOpenPress} />
          </Box>
        </Box>
      </>
    );
  };
  return (
    <BottomSheetModalProvider>
      
        <Box flex={1}>{renderContent()}</Box>
        <RedemptionLogBottomSheet ref={redemptionLogRef} events={events} />
        <MultiScanErrorBottomSheet ref={multiScanErrorRef} />
      
    </BottomSheetModalProvider>
  );
};

export default TicketScannerScreen;
