import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  RefreshControl,
  SectionList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {
  DrawerScreenProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import moment from 'moment';
import _, { groupBy, map } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { FlatList } from 'react-native-gesture-handler';

import {
  Button,
  Text,
  Box,
  SearchBox,
  LoadingBlock,
  NoResultsBox,
} from '../../../ui';
import { MainLayout, Header } from '../../../components';
import { useLazyGetTicketsQuery } from '../service';
import { StackParamList } from '../../../navigation';
import { Event, NamePageSearch } from '../../common/types';
import { useAppContext } from '../../auth/authSlice';
import { getDateAsString } from '../../../utils';
import SwipeableEventRow from '../../../components/SwipeableEventRow';

type Props = StackScreenProps<StackParamList, 'EventSelector'>;

const MockEventList = times(35, i => {
  return {
    id: i,
    index: i,
    name: faker.name.findName(),
    avatar: faker.internet.avatar(),
    group: sample(['Family', 'Friend', 'Acquaintance', 'Other']),
    email: faker.internet.email(),
  };
});

const eventSection = (event: Event) => {
  const startTime = moment(event.startTime);
  startTime.isSame(new Date(), 'day')
    ? 'TODAY'
    : startTime.isBefore(new Date(), 'day')
    ? 'PAST'
    : 'UPCOMING';
};

export const EventSelectionScreen = ({ route }: Props) => {
  const navigation = useNavigation<DrawerNavigationProp<StackParamList>>();

  const shareRef = useRef<BottomSheetModal>(null);

  const { currentSchool, setEvent } = useAppContext();

  const [filter, setFilter] = useState<NamePageSearch>({
    page: 1,
    pageSize: 50,
  });
  const [events, setEvents] = useState<Event[]>(
    route ? route.params?.events || [] : [],
  );
  const [getTickets, { isLoading, data, error, isFetching }] =
    useLazyGetTicketsQuery();
  const titleText = 'Events';
  const subtitleText =
    'Select event to scan tickets at the gate or search for a customer to check in.';
  const noResultsText = 'No Results';
  const loadingText = 'Loading';

  const refresh = useCallback(() => {
    if (route) {
    } else {
      getTickets({});
    }
  }, [getTickets, route]);

  useEffect(() => {
    refresh();
  }, [refresh]);
  useEffect(() => {
    if (currentSchool) {
      setFilter(f => ({ ...f, schoolId: currentSchool.id }));
    }
  }, [currentSchool]);
  useEffect(() => {
    if (route?.params?.events) {
      setEvents(route.params.events as any);
      return;
    }
    if (data) {
      // var ticketEvents = data.map(x => ({x}))      setEvents(data);
    }
  }, [route, filter, data]);
  useEffect(() => {
    refresh();
  }, []);
  const onEventSelected = (event: Event) => {
    setEvent(event);
    navigation.navigate('TicketSelector');
  };
  const onBack = () => {
    if (route.params && route.params.onBack) {
      route.params.onBack();
      return;
    }
    navigation.navigate('Home');
  };
  const EventItem = ({
    event,
    onPress,
    onActionSelected,
    shareable = false,
  }: {
    event: Event;
    onPress: any;
    shareable?: boolean;
    onActionSelected?: (event: Event) => void;
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
          <Box
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
          </Box>
        </SwipeRow>
      </Box>
    );
  };
  const renderContent = () => {
    if (isLoading) return <LoadingBlock />;

    if (error) return <Text variant="loading">{JSON.stringify(error)}</Text>;

    if (events) return <NoResultsBox message="No Events Found" icon="event" />;

    const sectionGroup = _(events as Event[])
      .groupBy(eventSection)
      .value();
    const sections = map(sectionGroup, (data, key) => ({ title: key, data }));
    const dte = moment();
    const onSelected = (item: Event) => {
      shareRef?.current?.show(item);
    };
    const old = () => (
      <Box marginTop="lg" flexGrow={1}>
        <Box flexGrow={1}>
          <SwipeListView
            useSectionList
            sections={sections}
            keyExtractor={(item, index) => `${item.id}`}
            refreshControl={
              <RefreshControl onRefresh={refresh} refreshing={isFetching} />
            }
            ListEmptyComponent={
              <NoResultsBox message="No Events Found" icon="event" />
            }
            renderItem={(data, rowMap) => {
              const { item } = data;
              return (
                <EventItem
                  event={item}
                  shareable={dte.isBefore(item.endTime)}
                  onPress={() => onEventSelected(item)}
                  onActionSelected={onSelected}
                />
              );
            }}
            // renderHiddenItem={renderRowMenu}
            renderSectionHeader={({ section: { title } }) => (
              <Box backgroundColor="listSectionBackgroudColor" padding="xs">
                <Text variant="sectionHeader">{title}</Text>
              </Box>
            )}
          />
          {/* {JSON.stringify(sections)} */}
        </Box>
      </Box>
    );
    return (
      <SectionList
        sections={sections}
        ItemSeparatorComponent={() => <Box height={StyleSheet.hairlineWidth} />}
        renderItem={({ item, index }) => <SwipeableEventRow name={item.name} />}
        keyExtractor={(_item, index) => `message ${index}`}
      />
    );
  };

  return (
    <BottomSheetModalProvider>
      <MainLayout>
        <Header onBackPress={onBack} />
        <Box paddingHorizontal="lg" flex={1}>
          <Box>
            <Text variant="title" marginBottom="lg">
              {titleText}
            </Text>
            <Text>{subtitleText}</Text>

            <SearchBox
              onChange={value => setFilter(x => ({ ...x, name: value }))}
              value={filter.name}
            />
          </Box>
          {renderContent()}
        </Box>
      </MainLayout>
    </BottomSheetModalProvider>
  );
};

export default EventSelectionScreen;
