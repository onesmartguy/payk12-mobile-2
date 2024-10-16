import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
  RefreshControl,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import _, { groupBy, map } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { EventModel } from '@/common/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Box from '@/common/components/Box';
import TextView from '@/common/components/TextView';
import SearchBox from '@/common/components/SearchBox';
import LoadingBlock from '@/common/components/LoadingBlock';
import NoResultsView from '@/common/components/NoResultsView';
import SwipeableEventRow from '@/common/components/SwipeableEventRow';
import { eventSection, getDateAsString } from '@/utils/events';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import useRedeemableEvents from '@/redemption/hooks/useRedeemableEvents';


type EventSelectionModalParams = { events: EventModel };
export const EventSelectionModal = () => {
  const router = useRouter();

  const shareRef = useRef<BottomSheetModal>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { events, isFetching, hasNextPage, error} = useRedeemableEvents({})
  const [selectedEvents, setSelectedEvents] = useState<EventModel[]>();
  const titleText = 'Events';
  const subtitleText =
    'Select event to scan tickets at the gate or search for a customer to check in.';
  const noResultsText = 'No Results';
  const loadingText = 'Loading';

  const EventItem = ({
    event,
    onPress,
    onActionSelected,
    shareable = false,
  }: {
    event: EventModel;
    onPress: any;
    shareable?: boolean;
    onActionSelected?: (event: EventModel) => void;
  }) => {
    const df = getDateAsString(event.startTime);
    const ref = useRef(null);
    const onSwipeAction = () => {
      if (onActionSelected) {
        onActionSelected(event);
      }
      if (ref.current) {
        (ref.current as any).closeRow();
      }
    };
    const opacity = shareable ? 1 : 0;
    return (
      <Box>
        <SwipeRow
          disableLeftSwipe
          disableRightSwipe={!shareable}
          leftOpenValue={100}
          rightOpenValue={-150}
          closeOnRowPress
          ref={ref}
        >
          (<Box
            backgroundColor="secondaryCardBackground"
            alignItems="center"
            justifyContent="space-between"
            flex={1}
            flexDirection="row"
          >
            <Box width={100}>
              <Box
                flex={1}
                alignContent="center"
                justifyContent="center"
                onTouchEnd={onSwipeAction}
              >
                <Text style={{ textAlign: 'center' }}>Share</Text>
              </Box>
            </Box>
          </Box>
          <Box backgroundColor="mainBackground">
            <TouchableOpacity onPress={onPress}>
              <Box
                flex={1}
                flexDirection="row"
                borderBottomColor="listDividerColor"
                borderBottomWidth={1}
              >
                <Box
                  alignItems="center"
                  justifyContent="center"
                  paddingRight="s"
                  opacity={opacity}
                >
                  <FontAwesomeIcon icon={faEllipsisV} />
                </Box>

                <Box flex={1} paddingVertical="m">
                  <Text variant="row">{event.name}</Text>
                  <Text variant="rowDetails" marginTop="xs">
                    {df}
                  </Text>
                  <Text color="infoText" marginTop="xs">
                    ({event.availibleTickets}) Tickets
                  </Text>
                </Box>
              </Box>
            </TouchableOpacity>
          </Box>) as any
        </SwipeRow>
      </Box>
    );
  };
  const renderContent = () => {
    if (isFetching) return <LoadingBlock />;

    if (error) return <TextView variant="loading">{JSON.stringify(error)}</TextView>;

    if (events) return <NoResultsView message="No Events Found" icon="event" />;

    const sectionGroup = _(events as EventModel[])
      .groupBy(eventSection)
      .value();
    const sections = map(sectionGroup, (data, key) => ({ title: key, data }));
  
    const onSelected = (item: EventModel) => {
      //shareRef?.current?.show(item);
    };

    return (
      <SectionList
        sections={sections}
        ItemSeparatorComponent={() => <Box height={StyleSheet.hairlineWidth} />}
        renderItem={({ item, index }) => <SwipeableEventRow event={item} />}
        keyExtractor={(_item, index) => `message ${index}`}
      />
    );
  };

  return (
    <BottomSheetModalProvider>
        <Box paddingHorizontal="lg" flex={1}>
          <Box>
            <TextView variant="title" marginBottom="lg">
              {titleText}
            </TextView>
            <TextView>{subtitleText}</TextView>

            <SearchBox
              onChange={value => setSearchTerm(value)}
              value={searchTerm}
            />
          </Box>
          {renderContent()}
        </Box>
    </BottomSheetModalProvider>
  );
};

export default EventSelectionModal;
