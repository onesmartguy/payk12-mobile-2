import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  LayoutRectangle,
  Linking,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';

import { TicketIcon } from '../../../assets';
import { WEBSITE_URL } from '../../common/constants';
import {
  Button,
  Text,
  Box,
} from '../../../ui';
import { MainLayout } from '../../../components';
import { useRedeemTicketAsAdminMutation } from '../../redemption/service';
import { PassView } from '../../../components/PassView';
import {
  SchoolSelectorView,
  EventSelectorView,
  PassSelectorView,
} from '../../common/components';
import { Theme } from '../../../ui/theme';
import { PassShareSheet, PassShareBottomSheet, BasicBottomSheet, BasicSheet } from '../../common/sheets';
import usePasses from '@app/hooks/usePasses';
import { School, Event, Pass } from '@app/features/common/types';
import { PassholderScreens } from '../ticketNavigation';
import { StackScreenProps } from '@react-navigation/stack';
import useSharing, { ShareResult } from '@app/hooks/useSharing';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useCurrentUser } from '@app/features/auth/authSlice';
import { useQueryClient } from '@tanstack/react-query';
import { useRedemptionHub } from '@app/hooks/useRedemptionHub';

interface Props extends StackScreenProps<PassholderScreens, 'PassSelector' > {}

export const PassSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const shareRef = useRef<PassShareSheet>(null);
  const basicSheetRef = useRef<BasicSheet>(null);
  
  const [filter, setFilter] = useState<{school?: School, event?: Event, pass?: Pass}>({});
  
  const [redeemPassAsync, redeemPassStatus] = useRedeemTicketAsAdminMutation();
  const isFocused = useIsFocused()
  const {
    passes,
    schools,
    error,
    refetchByUser,
    isRefetchingByUser,
    isLoading
  } = usePasses();
  const { sharePass } = useSharing()
  const { id } = useCurrentUser()
  const queryClient = useQueryClient()
  const [itemWidth, setItemWidth] = useState<number | undefined>();
  const [showLoading, setShowLoading] = useState(false);
  const theme = useTheme<Theme>();
  const margin = theme.spacing.m;
  const handleLayoutChange = ({ width }: LayoutRectangle) => {
    setItemWidth(width - 2 * margin);
  };


  useEffect(() => {
    if(!filter.school && schools.length == 1){
      setFilter(f => ({...f, school: schools[0]}))
    }
  }, [passes, isFocused, isRefetchingByUser])

  const redeemPass = async (pass: Pass, event: Event) => {
    setShowLoading(true);
    
    if (!filter.school || !filter.event) return;
    const passes = [pass.formattedNumber] as any;

    const data = {
      schoolId: filter.school.id,
      events: [filter.event.id],
      tickets: passes,
    };
    const results = await redeemPassAsync(data);
    console.log('results', JSON.stringify(results, null, 2))
    await refetchByUser();

    setShowLoading(false);
  };
  const { ticketSharedEvent, ticketRedeemedEvent } = useRedemptionHub({userId: id}, [id])
  useEffect(() => {
    if(ticketRedeemedEvent){
      queryClient.invalidateQueries(['mypasses'])
      refetchByUser()
    }
  }, [ticketRedeemedEvent, ticketSharedEvent])
  const onShare = (pass: Pass) => {
    if (shareRef.current) {
      shareRef.current?.show(pass);
    }
  };
  const isShareable = (pass: Pass) => {
    return pass.isShareable;
  };
  const NoResults = () => (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TicketIcon />
      <Text variant="header2" marginTop="lg">
        No passes for upcoming events
      </Text>
      <Box marginTop="3xl" padding="lg">
        <Button
          variant="primary"
          label="Find Events"
          onPress={() => {
            Linking.openURL(`${WEBSITE_URL}`);
          }}
        />
        <Text marginTop="lg" textAlign="center" padding="lg">
          Seach our virtual marketplace to find an event for your school.
        </Text>
      </Box>
    </Box>
  );

  const ShareResultView = (result: ShareResult) => (
    <Box padding='m' justifyContent="center" alignItems="center">
      {result.isSuccess ? <Box marginVertical='m'>
        <Text variant='header2' textAlign='center'>Ticket(s) successfully sent to</Text>
        <Text variant='EventRowTicketCount' textAlign='center'>{result.email}</Text>
      </Box> : <Box><Text textAlign='center'>Ticket(s) could not be shared</Text></Box>}
      <Box onTouchEnd={() => {basicSheetRef.current?.close()}}>
        <FontAwesomeIcon icon={faTimes} size={24} />
      </Box>
    </Box>
  )
  const renderContent = () => {
    const isRedeemed = filter.event ? !filter.event.isAvailable : false;
    if (isLoading)
      return (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size={48} />
        </Box>
      );
    
    if (!passes || passes.length == 0) return <NoResults />;


    if (!filter.school){

      return (
        <SchoolSelectorView
          schools={schools}
          onSelected={school => setFilter(f => ({...f, school}))}
        />
      );
    }

    if (filter.school && !filter.pass){
      const passList = passes.filter(p => p.schoolId === filter.school?.id).map(x => ({...x, eventsLeft: x.isMultiEventPass
        ? x.remainingUses
        : (x.events ?? []).length}))
      return (
        <PassSelectorView
          school={filter.school}
          passes={passList}
          onSelected={pass => {
            setFilter(s => ({...s, pass}));
          }}
          onShare={p => onShare(p)}
          isShareable={isShareable}
        />
      );
    }
    if (filter.school && filter.pass && !filter.event)
      return (
        <Box marginHorizontal="lg">
          <Box marginBottom="xl">
            <Text variant="title" marginBottom="lg">
              Events
            </Text>
            <Text>
              Select event to scan tickets at the gate or search for a customer
              to check in.
            </Text>
          </Box>
          <EventSelectorView
            events={passes.find(x => x.id === filter.pass?.id)?.events.map(e => ({...e, isShareable: false})) || []}
            onSelected={evt => setFilter(f => ({...f, event: evt}))}
          />
        </Box>
      );
    return (
      <Box
        onLayout={({ nativeEvent: { layout } }) => handleLayoutChange(layout)}
        marginHorizontal="lg"
        marginBottom="3xl"
      >
        {filter.pass && (
          <PassView
            pass={filter.pass!}
            event={filter.event}
            isRedeemed={isRedeemed}
            width={itemWidth!}
            onPressToRedeem={redeemPass}
          />
        )}
      </Box>
    );
  };

  return (
    <MainLayout
      showHeader
      headerOptions={{
        onBackPress: () => {
          if (filter.event) {
            setFilter(f => ({...f, event: undefined}));
            return;
          }
          if (filter.pass) {
            setFilter(f => ({...f, pass: undefined}));
            return;
          }

          if (filter.school) {
            setFilter(f => ({...f, school: undefined}));
            return;
          }
          navigation.goBack();
        },
      }}
      showLoading={showLoading}
    >
      <Box flex={1}>
        <Box flex={1}>{renderContent()}</Box>
      </Box>
      <PassShareBottomSheet
        ref={shareRef}
        onSubmit={async data => {
          const shareResult = await sharePass(data);

          shareRef.current?.close();
          basicSheetRef.current?.show(<ShareResultView {...shareResult} />)
        }}
        onClose={() => {

        }}
      />
      <BasicBottomSheet
        ref={basicSheetRef} />
    </MainLayout>
  );
};

export default PassSelectionScreen;
