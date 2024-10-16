import React, { useEffect, useState, useRef } from 'react';
import {
  ActivityIndicator,
  LayoutRectangle,
  Linking,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTheme } from '@shopify/restyle';
import { BasicBottomSheet, BasicSheet, PassShareBottomSheet, PassShareSheet } from '@/common/sheets';
import { EventModel, PassModel, SchoolModel } from '@/common/types';
import usePasses from '../hooks/usePasses';
import useSessionStore from '@/auth/stores/useSessionStore';
import { Theme } from '@/utils/theme';
import { useRedemptionHub } from '@/redemption/hooks/useRedemptionHub';
import Box from '@/common/components/Box';
import { TicketIcon } from '@/assets';
import TextView from '@/common/components/TextView';
import Button from '@/common/components/Button';
import { siteUrl } from '@/utils/constants';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import SchoolSelectorView from '@/common/components/SchoolSelectorView';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';
import PassSelectorView from '@/common/components/PassSelectorView';
import EventSelectorView from '@/common/components/EventSelectorView';
import PassView from '@/common/components/PassView';
import useSharing from '../hooks/useSharing';
import { ShareResult } from '@/api/ticketing';



type Props = {}

export const PassSelectionScreen: React.FC<Props> = ({  }) => {
  const shareRef = useRef<PassShareSheet>(null);
  const basicSheetRef = useRef<BasicSheet>(null);
  const userId = useSessionStore(x => x.user!.id);
  const [filter, setFilter] = useState<{school?: SchoolModel, event?: EventModel, pass?: PassModel}>({});
  
 
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

  const redeemPass = async (pass: PassModel, event: EventModel) => {
    setShowLoading(true);
    
    if (!filter.school || !filter.event) return;
    const passes = [pass.formattedCode ?? pass.code] as any;

    const data = {
      schoolId: filter.school.id,
      events: [filter.event.id],
      tickets: passes,
    };
    // const results = await redeemPassAsync(data);
    // console.log('results', JSON.stringify(results, null, 2))
    await refetchByUser();

    setShowLoading(false);
  };
  const { ticketSharedEvent, ticketRedeemedEvent } = useRedemptionHub({userId: userId}, [userId])
  useEffect(() => {
    if(ticketRedeemedEvent){
      //queryClient.invalidateQueries(['mypasses'])
      refetchByUser()
    }
  }, [ticketRedeemedEvent, ticketSharedEvent])
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

  const ShareResultView: React.FC<{result: ShareResult, onClose: () => void}> = ({result, onClose}) => (
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
      const passList = passes.filter(p => p.schoolId === filter.school?.id).map(x => ({...x, eventsLeft: x.passType === 'multi'
        ? x.maxUses - x.redeemedEventIds.length
        : (x.allowedEventIds ?? []).length}))
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
            <TextView variant="title" marginBottom="lg">
              Events
            </TextView>
            <TextView>
              Select event to scan tickets at the gate or search for a customer
              to check in.
            </TextView>
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
    <Box flex={1}
    >
      <Box flex={1}>
        <Box flex={1}>{renderContent()}</Box>
      </Box>
      <PassShareBottomSheet
        ref={shareRef}
        onSubmit={async data => {
          const shareResult = await sharePass(data);

          shareRef.current?.close();
          basicSheetRef.current?.show(<ShareResultView result={shareResult} onClose={basicSheetRef.current.close}  />)
        }}
        onClose={() => {

        }}
      />
      <BasicBottomSheet
        ref={basicSheetRef} />
    </Box>
  );
};

export default PassSelectionScreen;
