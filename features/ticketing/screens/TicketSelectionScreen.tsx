import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import moment from 'moment';
import {StackScreenProps} from '@react-navigation/stack';
import {ActivityIndicator, Linking} from 'react-native';

import {SchoolSelectorView, EventSelectorView} from '../../common/components';
import {BasicBottomSheet, BasicSheet, TicketShareBottomSheet, TicketShareSheet} from '../../common/sheets';
import {TicketStack, MainLayout} from '../../../components';
import {Box, Text, Button} from '../../../ui';
import {useRedeemTicketAsAdminMutation} from '../../redemption/service';
import {PassholderScreens} from '../ticketNavigation';
import {TicketIcon} from '../../../assets';
import {WEBSITE_URL} from '../../common/constants';
import { School, Event, Ticket } from '@app/features/common/types';
import useTickets from '@app/hooks/useTickets';
import useSharing, { ShareResult } from '@app/hooks/useSharing';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useRedemptionHub } from '../../../hooks/useRedemptionHub';
import { useCurrentUser } from '../../auth/authSlice';
import { useQueryClient } from '@tanstack/react-query';
// const MockEventList = times(100, i => {
//   const dte = moment(
//     faker.date.between(faker.date.recent(), faker.date.soon()),
//   ).startOf('day');
//   const sd = dte.add(faker.datatype.number({ min: 8, max: 18 }), 'h');
//   const end = sd.add(faker.datatype.number({ min: 1, max: 3 }), 'h');
//   return {
//     id: faker.datatype.number(),
//     eventId: faker.datatype.number({ min: 23454, max: 23480 }),
//     schoolId: 853,
//     schoolName: 'PayK12 High School',
//     name: faker.name.findName(),
//     eventName: faker.name.findName(),
//     startTime: sd.toDate(),
//     endTime: end.toDate(),
//     type: sample(['T', 'R', 'P']),
//     ownerEmail: faker.internet.email(),
//     ownerName: faker.name.findName(),
//   } as Partial<Ticket>;
// });

interface Props extends StackScreenProps<PassholderScreens, 'TicketSelector'> {}

export const TicketSelectionScreen: React.FC<Props> = ({navigation, route}) => {
  const shareRef = useRef<TicketShareSheet>(null);
  const basicSheetRef = useRef<BasicSheet>(null);
  const [filter, setFilter] = useState<{school?: School, event?: Event, ticket?: Ticket}>({});
  const { id } = useCurrentUser()
  const queryClient = useQueryClient()
  const [redeemPassAsync, redeemPassStatus] = useRedeemTicketAsAdminMutation();

  const { shareTickets } = useSharing()
  const isFocused = useIsFocused();
  const {
    tickets,
    error,
    isLoading,
    schools,
    refetchByUser,
    isRefetchingByUser
  } = useTickets();

  useEffect(() => {
    if(isFocused){
      
      if(!filter.school && schools.length == 1) {
        setFilter(f => ({...f, school: schools[0] }))
      } 
      if (filter.school != null) {
        const school = schools.find(s => s.id == filter.school?.id)
        const event = school?.events.find(s => s.id == filter.event?.id)
        setFilter(f => ({...f, 
          school: school,
          event: event
         }))
      }
    }
  }, [tickets, schools, isFocused])
  const { ticketSharedEvent, ticketRedeemedEvent } = useRedemptionHub({userId: id}, [id])
  useEffect(() => {
    if(ticketRedeemedEvent){
      queryClient.invalidateQueries(['mytickets'])
      var ticket = tickets?.find(x => x.id == (ticketRedeemedEvent as any).id)
      console.log('redeem', ticketRedeemedEvent, ticket)
      refetchByUser()
    }
  }, [ticketRedeemedEvent, ticketSharedEvent])
  const redeemPass = async (ticket: Ticket) => {
    if (!filter.school || !filter.event) return;
    const passes = [ticket.ticketNumber] as any;
    const data = {
      schoolId: ticket.schoolId,
      events: [ticket.eventId],
      tickets: passes,
    };
    const results = await redeemPassAsync(data);
  };

  const onTicketShare = (event: Event) => {
    if (shareRef.current) {
      shareRef.current?.show(event, event.tickets);
    }
  };

  const NoResults = () => (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TicketIcon />
      <Text variant="header2" marginTop="lg">
        No tickets for upcoming events
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
    const dte = moment();
    if (isLoading)
      return (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size={48} />
        </Box>
      );

    if (!tickets || tickets.length == 0) return <NoResults />;

    if (error) return <Text variant="loading">{JSON.stringify(error)}</Text>;


    if (!filter.school) {
      return (
        <SchoolSelectorView
          schools={schools}
          onSelected={school => setFilter(f => ({...f, school}))}
        />
      );
    }
    if (!filter.event && filter.school.events) {
      const titleText = 'Events';
      const subtitleText =
        'Select event to scan tickets at the gate or search for a customer to check in.';
      return (
        <Box flex={1} marginHorizontal="lg">
          <Box marginBottom="lg">
            <Text variant="title" marginBottom="lg">
              {titleText}
            </Text>
            <Text>{subtitleText}</Text>
          </Box>

          <EventSelectorView
            events={filter.school?.events}
            onSelected={e => setFilter(f => ({...f, event: e}))}
            shareable={(e) => {
              return dte.isBefore(e.startTime)}}
            onShareSelected={event => onTicketShare(event)}
          />
        </Box>
      );
    }
    const render = () =>
      filter.event ? (
        <TicketStack tickets={filter.event.tickets} groupable onPressToRedeem={redeemPass} />
      ) : (
        <Text variant="loading">Loading</Text>
      );
    return (
      <Box flex={1} flexDirection="row" justifyContent="center">
        {render()}
      </Box>
    );
  };

  return (
    
    <MainLayout
      showHeader
      headerOptions={{
        onBackPress: () => {
          shareRef.current?.close();
          if (filter.event) {
            setFilter(f => ({...f, event: undefined}))
            return;
          }
          if (filter.school) {
            setFilter(f => ({...f, school: undefined}))
            return;
          }

          navigation.goBack();
        },
      }}>
      <Box flex={1}>
        <Box flex={1}>{renderContent()}</Box>
      </Box>
      <TicketShareBottomSheet
        ref={shareRef}
        onSubmit={async (data) => {

          const shareResult = await shareTickets(data);

          shareRef.current?.close();
          basicSheetRef.current?.show(<ShareResultView {...shareResult} />)
        }}
        onClose={() => {}}
      />
      <BasicBottomSheet
        ref={basicSheetRef} />
    </MainLayout>
  );
};

export default TicketSelectionScreen;


