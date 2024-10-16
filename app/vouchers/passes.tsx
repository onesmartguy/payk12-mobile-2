import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  LayoutRectangle,
  Linking,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';

import { TicketIcon } from '../../assets';
import { Theme } from '@/utils/theme';
import { BasicBottomSheet, BasicSheet, PassShareBottomSheet, PassShareSheet } from '@/common/sheets';
import { EventModel, PassModel, SchoolModel } from '@/common/types';
import { useRedemptionHub } from '@/redemption/hooks/useRedemptionHub';
import Box from '@/common/components/Box';
import TextView from '@/common/components/TextView';
import Button from '@/common/components/Button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import SchoolSelectorView from '@/common/components/SchoolSelectorView';
import PassSelectorView from '@/common/components/PassSelectorView';
import EventSelectorView from '@/common/components/EventSelectorView';
import PassView from '@/common/components/PassView';
import { siteUrl } from '@/utils/constants';
import useSessionStore from '@/auth/stores/useSessionStore';
import usePasses from '@/ticketing/hooks/usePasses';
import useSharing from '@/ticketing/hooks/useSharing';
import { ShareResult } from '@/api/ticketing';
import ViewWithHeader from '@/common/components/ViewWithHeader';
import { useRouter } from 'expo-router';
import useUserVouchersStore from '@/ticketing/stores/useUserVouchersStore';

const ShareResultView: React.FC<{result: ShareResult, onClose?: () => void}> = ({result, onClose}) => (
  <Box padding='m' justifyContent="center" alignItems="center">
    {result.isSuccess ? <Box marginVertical='m'>
      <TextView variant='header2' textAlign='center'>Ticket(s) successfully sent to</TextView>
      <TextView variant='EventRowTicketCount' textAlign='center'>{result.email}</TextView>
    </Box> : <Box><TextView textAlign='center'>Ticket(s) could not be shared</TextView></Box>}
    <Box onTouchEnd={onClose}>
      <FontAwesomeIcon icon={faTimes} size={24} />
    </Box>
  </Box>
)

export const PassSelectionScreen: React.FC<{}> = () => {
  const shareRef = useRef<PassShareSheet>(null);
  const basicSheetRef = useRef<BasicSheet>(null);
  const router = useRouter()
  
 
  const isFocused = useIsFocused()
  const userId = useSessionStore(x => x.user!.id);
  const {
    passes,
    schools,
    events,
    error,
    refetchByUser,
    isRefetchingByUser,
    isLoading,
    selectedPass,
    setSelectedPass,
    redeemVouchersAsync
  } = usePasses();
  const  selectedSchool = useUserVouchersStore(x => x.selectedSchool)
  const  selectedEvent = useUserVouchersStore(x => x.selectedEvent) 
  const setSelectedSchool = useUserVouchersStore(x => x.setSelectedSchool)
  const setSelectedEvent = useUserVouchersStore(x => x.setSelectedEvent)

  const { sharePass } = useSharing()
  const [itemWidth, setItemWidth] = useState<number | undefined>();
  const [showLoading, setShowLoading] = useState(false);
  const theme = useTheme<Theme>();
  const margin = theme.spacing.m;
  const handleLayoutChange = ({ width }: LayoutRectangle) => {
    setItemWidth(width - 2 * margin);
  };

  useEffect(() => {
    console.log('schools', schools)
  }, [passes, schools])  
  // useEffect(() => {
  //   if(!filter.school && schools.length == 1){
  //     setFilter(f => ({...f, school: schools[0]}))
  //   }
  // }, [passes, isFocused, isRefetchingByUser])

  // const redeemPass = async (pass: PassModel, event: EventModel) => {
  //   setShowLoading(true);
    
  //   if (!filter.school || !filter.event) return;
  //   const passes = [pass.formattedCode] as any;

  //   const data = {
  //     schoolId: filter.school.id,
  //     events: [filter.event.id],
  //     tickets: passes,
  //   };
  //   //const results = await redeemPassAsync(data);
  //   //console.log('results', JSON.stringify(results, null, 2))
  //   await refetchByUser();

  //   setShowLoading(false);
  // };
  //const { ticketSharedEvent, ticketRedeemedEvent } = useRedemptionHub({userId: userId}, [userId])
  // useEffect(() => {
  //   if(ticketRedeemedEvent){
  //     //queryClient.invalidateQueries(['mypasses'])
  //     refetchByUser()
  //   }
  // }, [ticketRedeemedEvent, ticketSharedEvent])

  const onShare = (pass: PassModel) => {
    if (shareRef.current) {
      shareRef.current?.show(pass);
    }
  };
  const isShareable = (pass: PassModel) => {
    return pass.isShareable;
  };
  const NoResults = () => (
    <Box flex={1} alignItems="center" justifyContent="center">
      <TicketIcon />
      <TextView variant="header2" marginTop="lg">
        No passes for upcoming events
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


  const renderContent = () => {
    if (isLoading)
      return (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator size={48} />
        </Box>
      );
    
    if (!passes) return <NoResults />;


    if (!!schools && !selectedSchool){

      return (<>
      <TextView variant="title" marginBottom="lg">test</TextView>
        <SchoolSelectorView
          schools={schools}
          onSelected={school => setSelectedSchool(school)}
        />
        </>
      );
    }

    if (!selectedPass){
      const passList = passes.filter(p => p.schoolId === selectedSchool!.id).map(x => ({...x, eventsLeft: x.passType === 'multi'
        ? x.maxUses - x.redeemedEventIds.length 
        : x.allowedEventIds.length - x.redeemedEventIds.length}))
      return (
        <PassSelectorView
          school={selectedSchool!}
          passes={passList}
          events={events}
          onSelected={pass => {
            setSelectedPass(pass);
          }}
          onShare={p => onShare(p)}
          isShareable={isShareable}
        />
      );
    }
    if (!selectedEvent)
      return (
        <Box marginHorizontal="lg">
          <Box marginBottom="xl">
            <TextView variant="title" marginBottom="lg">
              Events
            </TextView>
            <TextView>
              Select event to scan tickets at the gate or search for a customer
              to check in.
            </TextView>
          </Box>
          <EventSelectorView
            events={events.filter(x => selectedPass.allowedEventIds.includes(x.id))}
            onSelected={evt => setSelectedEvent(evt)}
          />
        </Box>
      );
    return (
      <Box
        onLayout={({ nativeEvent: { layout } }) => handleLayoutChange(layout)}
        marginHorizontal="lg"
        marginBottom="3xl"
      ><>
        {!!selectedPass && (
          <PassView
            pass={selectedPass!}
            event={selectedEvent!}
            isRedeemed={selectedPass!.passType == 'multi' ? selectedPass!.allowedEventIds.length >= selectedPass.maxUses : selectedPass.redeemedEventIds.includes(selectedEvent!.id)}
            width={itemWidth!}
            onHoldToRedeem={redeemVouchersAsync}
          />
        )}
        </>
      </Box>
    );
  };

  return (
    <ViewWithHeader onBackPress={() => {
      
      if(selectedSchool){
        setSelectedSchool(null)
        if(schools.length > 1) return;
      }
      router.canGoBack() ? router.back() : router.navigate('Home')
    }}>
      <Box flex={1}>
        <Box flex={1}>{renderContent()}</Box>
      </Box>
      <PassShareBottomSheet
        ref={shareRef}
        onSubmit={async data => {
          const shareResult = await sharePass(data);

          shareRef.current?.close();
          basicSheetRef.current?.show(<ShareResultView result={shareResult as any} onClose={basicSheetRef.current.close} />)
        }}
        onClose={() => {

        }}
      />
      <BasicBottomSheet ref={basicSheetRef} />
    </ViewWithHeader>
  );
};

export default PassSelectionScreen;
