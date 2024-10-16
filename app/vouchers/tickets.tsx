import React, { useEffect, useRef, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { BasicBottomSheet, BasicSheet, TicketShareBottomSheet, TicketShareSheet } from '@/common/sheets';
import Box from '@/common/components/Box';
import TicketStack from '@/common/components/CardStack';
import TextView from '@/common/components/TextView';
import EventSelectorView from '@/common/components/EventSelectorView';
import SchoolSelectorView from '@/common/components/SchoolSelectorView';
import { ActivityIndicator, Linking } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import Button from '@/common/components/Button';
import { TicketIcon } from '@/assets';
import { EventModel, SchoolModel, TicketModel } from '@/common/types';
import { useRedemptionHub } from '@/redemption/hooks/useRedemptionHub';
import useSessionStore from '@/auth/stores/useSessionStore';
import { siteUrl } from '@/utils/constants';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import { isBefore } from 'date-fns';
import useTickets from '@/ticketing/hooks/useTickets';
import { ShareResult } from '@/api/ticketing';
import useUserVouchersStore from '@/ticketing/stores/useUserVouchersStore';
import ViewWithHeader from '@/common/components/ViewWithHeader';
import { useNavigation, useRouter } from 'expo-router';



export const TicketListScreen: React.FC<{}> = ({ }) => {
  const shareRef = useRef<TicketShareSheet>(null);
  const basicSheetRef = useRef<BasicSheet>(null);
  const userId = useSessionStore(x => x.user?.id);
  const router = useRouter();
  const isFocused = useIsFocused();
  const {
    tickets,
    error,
    isLoading,
    schools,
    events,
    redeemVouchersAsync
  } = useTickets();
  const  selectedSchool = useUserVouchersStore(x => x.selectedSchool)
  const  selectedEvent = useUserVouchersStore(x => x.selectedEvent) 
  const setSelectedSchool = useUserVouchersStore(x => x.setSelectedSchool)
  const setSelectedEvent = useUserVouchersStore(x => x.setSelectedEvent)

  const { ticketSharedEvent, ticketRedeemedEvent } = useRedemptionHub({ userId: userId! }, [userId!])

  useEffect(() => {
    if (ticketRedeemedEvent) {
      var ticket = tickets?.find(x => x.id == (ticketRedeemedEvent as any).id)
      console.log('redeem', ticketRedeemedEvent, ticket)
    
    }
  }, [ticketRedeemedEvent, ticketSharedEvent])

  const handleHoldToRedeem = async (ticket: TicketModel) => {
    const data = {
      events: [ticket.eventId],
      vouchers: [ticket.code],
      isHoldToRedeem: true
    };
    const results = await redeemVouchersAsync(data);
  };

  const onTicketShare = (event: EventModel) => {
    console.log('event', event)
    console.log('tickets', tickets)

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
          Seach our virtual marketplace to find an event for your school.
        </TextView>
      </Box>
    </Box>
  );

  const ShareResultView: React.FC<{ result: ShareResult, onClose?: () => void }> = ({ result, onClose }) => (
    <Box padding='m' justifyContent="center" alignItems="center">
      {result.isSuccess ? <Box marginVertical='m'>
        <TextView variant='header2' textAlign='center'>Ticket(s) successfully sent to</TextView>
        <TextView variant='EventRowTicketCount' textAlign='center'>{result.email}</TextView>
      </Box> : <Box><TextView textAlign='center'>Ticket(s) could not be shared</TextView></Box>}
      <Box onTouchEnd={() => { onClose }}>
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

    if (!tickets || tickets.length == 0)
      return <NoResults />

    if (error) return <TextView variant="loading">{JSON.stringify(error)}</TextView>;


    if (!selectedSchool) 
      return <SchoolSelectorView schools={schools} onSelected={school => setSelectedSchool(school)} />
   
    if (!selectedEvent) {
      return (
        <Box flex={1} marginHorizontal="lg">
          <Box marginBottom="lg">
            <TextView variant="title" marginBottom="lg">
              Events
            </TextView>
            <TextView>Select event to scan tickets at the gate or search for a customer to check in.</TextView>
          </Box>

          <EventSelectorView
            events={events.filter(x => tickets.some(t => t.eventId == x.id))}
            onSelected={e => {
              setSelectedEvent(e)
            }}
            onShareSelected={event => onTicketShare(event)}
          />
        </Box>
      );
    }

      return (
        <Box flex={1} flexDirection="row" justifyContent="center">
          <TicketStack tickets={tickets.filter(x=> x.eventId == selectedEvent.id)} groupable onHoldToRedeem={handleHoldToRedeem} />
        </Box>
      );
    }
  

  return (

    <ViewWithHeader onBackPress={() => {
      if(selectedEvent){
        setSelectedEvent(null)
        if(events.length > 1) return;
      }
      if(selectedSchool){
        setSelectedSchool(null)
        if(schools.length > 1) return;
      }
      router.canGoBack() ? router.back() : router.navigate('Home')
    }}>
      {renderContent()}
      <TicketShareBottomSheet
        ref={shareRef}
        onSubmit={async data => {
          const shareResult = {} //await shareTicket(data);
          shareRef.current?.close();
          basicSheetRef.current?.show(<ShareResultView result={shareResult as any} onClose={basicSheetRef.current.close} />)
        }}
        onClose={() => {
        }}
      ></TicketShareBottomSheet>
      <BasicBottomSheet ref={basicSheetRef} />
    </ViewWithHeader>
  );
};

export default TicketListScreen;


