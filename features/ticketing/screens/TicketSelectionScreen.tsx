import React, {useEffect, useRef, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {ActivityIndicator, Linking} from 'react-native';

import {BasicBottomSheet, BasicSheet, TicketShareBottomSheet, TicketShareSheet} from '../../common/sheets';
import {TicketIcon} from '../../../assets';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { useRedemptionHub } from '../../redemption/hooks/useRedemptionHub'
import { siteUrl } from '@/utils/constants';
import { EventModel, SchoolModel, TicketModel } from '@/common/types';
import useSessionStore from '@/auth/stores/useSessionStore';
import useSharing from '../hooks/useSharing';
import useTickets from '../hooks/useTickets';
import useRedeemVoucher from '@/redemption/hooks/useRedeemVoucher';
import TextView from '@/common/components/TextView';
import Box from '@/common/components/Box';
import SchoolSelectorView from '@/common/components/SchoolSelectorView';
import EventSelectorView from '@/common/components/EventSelectorView';
import TicketStack from '@/common/components/CardStack';
import { ShareResult } from '@/api/ticketing';
import Button from '@/common/components/Button';
import { isBefore } from 'date-fns';
import useEvents from '../../common/hooks/useEvents';
import useSchools from '../../common/hooks/useSchools';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
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



export const TicketSelectionScreen: React.FC<{}> = ({}) => {
  const shareRef = useRef<TicketShareSheet>(null);
  const basicSheetRef = useRef<BasicSheet>(null);
  const [filter, setFilter] = useState<{school?: SchoolModel | null, event?: EventModel | null, ticket?: TicketModel}>({});
  const { id } = useSessionStore(x => x.user!);
  const {mutateAsync: redeemPassAsync, isPending} = useRedeemVoucher();
  const { shareTickets } = useSharing()
  const isFocused = useIsFocused();
  const {
    tickets,
    events,
    schools,
    error,
    isLoading,
  } = useTickets();


  
  const { ticketSharedEvent, ticketRedeemedEvent } = useRedemptionHub({userId: id}, [id])

  useEffect(() => {
    if(ticketRedeemedEvent){
      var ticket = tickets?.find(x => x.id == (ticketRedeemedEvent as any).id)
      console.log('redeem', ticketRedeemedEvent, ticket)
    }
  }, [ticketRedeemedEvent, ticketSharedEvent])

  const redeemPass = async (ticket: TicketModel) => {
    if (!filter.school || !filter.event) return;
    const passes = [ticket.code];
    const data = {
      events: [ticket.eventId],
      vouchers: passes,
    };
    const results = await redeemPassAsync(data);
  };

  const onTicketShare = (event: EventModel) => {
    if (shareRef.current) {
      shareRef.current?.show(event);
    }
  };

  const NoResults = () => (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TicketIcon />
      <TextView variant="header2" marginTop="lg">
        No tickets for upcoming events
      </TextView>
      <Box marginTop="3xl" padding="lg">
        <Button
          variant="primary"
          label="Find Events"
          onPress={() => {
            Linking.openURL(`${siteUrl}`);
          }}
        />
        <TextView marginTop="lg" textAlign="center" padding="lg">
          Search our virtual marketplace to find an event for your school.
        </TextView>
      </Box>
    </Box>
  );
  const ShareResultView = (result: ShareResult) => (
    <Box padding='m' justifyContent="center" alignItems="center">
      {result.isSuccess ? <Box marginVertical='m'>
        <TextView variant='header2' textAlign='center'>Ticket(s) successfully sent to</TextView>
        <TextView variant='EventRowTicketCount' textAlign='center'>{result.email}</TextView>
      </Box> : <Box><TextView textAlign='center'>Ticket(s) could not be shared</TextView></Box>}
      <Box onTouchEnd={() => {basicSheetRef.current?.close()}}>
        <FontAwesomeIcon icon={faTimes} size={24} />
      </Box>
    </Box>
  )
  const renderContent = () => {
    const dte = new Date();
    if (isLoading)
      return (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size={48} />
        </Box>
      );

    if (!tickets || tickets.length == 0) return <NoResults />;

    if (error) return <TextView variant="loading">{JSON.stringify(error)}</TextView>;


    if (!filter.school) {
      return (
        <SchoolSelectorView
          schools={schools}
          onSelected={school => setFilter(f => ({...f, school}))}
        />
      );
    }
    if (!filter.event && events) {
      const titleText = 'Events';
      const subtitleText =
        'Select event to scan tickets at the gate or search for a customer to check in.';

      return (
        <Box flex={1} marginHorizontal="lg">
          <Box marginBottom="lg">
            <TextView variant="title" marginBottom="lg">
              {titleText}
            </TextView>
            <TextView>{subtitleText}</TextView>
          </Box>

          <EventSelectorView
            events={events}
            onSelected={e => setFilter(f => ({...f, event: e}))}
            shareable={(e) => isBefore(e.startTime, dte)}
            onShareSelected={event => onTicketShare(event)}
          />
        </Box>
      );
    }

    return (
      <Box flex={1} flexDirection="row" justifyContent="center">
        <TicketStack tickets={tickets} groupable onHoldToRedeem={redeemPass} />
      </Box>
    );
  };

  return (
    
    <Box>
      <Box flex={1}>
        <Box flex={1}>{renderContent()}</Box>
      </Box>
      <TicketShareBottomSheet
        ref={shareRef}
        onSubmit={async (data) => {

          const shareResult = await shareTickets(data);

          shareRef.current?.close();
          basicSheetRef.current?.show(<ShareResultView {...(shareResult as any)} />)
        }}
        onClose={() => {}}
      />
      <BasicBottomSheet
        ref={basicSheetRef} />
    </Box>
  );
};

export default TicketSelectionScreen;


