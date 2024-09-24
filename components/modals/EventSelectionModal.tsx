import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshControl, SectionList, TouchableOpacity } from 'react-native';
import {
  DrawerScreenProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import moment from 'moment';
import _, { groupBy, map, orderBy } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { openLimitedPhotoLibraryPicker } from 'react-native-permissions';

import { Button, Text, Box, SearchBox, NoResultsBox } from '../../../ui';
import { MainLayout, Header, EventRow } from '../../../components';
import { StackParamList } from '../../../navigation';
import { Event, NamePageSearch } from '../types';
import { useAppContext } from '../../auth/authSlice';
import { getDateAsString } from '../../../utils';
import { TicketShareModal } from '../components';

type Props = StackScreenProps<StackParamList, 'EventPickerModal'>;

const eventSection = (event: Event) =>
  moment(event.startTime).isSame(new Date(), 'day')
    ? 'TODAY'
    : moment(event.startTime).isBefore(new Date(), 'day')
    ? 'PAST'
    : 'UPCOMING';

export const EventSelectorModal = ({ route }: Props) => {
  const navigation = useNavigation<DrawerNavigationProp<StackParamList>>();

  const shareRef = useRef<any>(null);

  const [filter, setFilter] = useState<NamePageSearch>({
    page: 1,
    pageSize: 50,
  });
  const [events, setEvents] = useState<Event[]>(
    route ? route.params?.events || [] : [],
  );

  const onShare = (evt: Event) => {
    shareRef.current.show(evt);
  };
  const onBack = () => {
    if (route.params.onBack) {
      route.params.onBack();
    } else if (navigation.canGoBack()) navigation.goBack();
  };
  const onSelected = (evt: Event) => {
    if (route.params.onSelected) route.params.onSelected(evt);
    onBack();
  };

  const renderContent = () => {
    if (!events) return <NoResultsBox message="No Events Found" icon="event" />;

    const sectionGroup = _(events).groupBy(eventSection).value();
    const sections = map(sectionGroup, (data, key) => ({
      title: key,
      data: orderBy(data, x => x.endTime),
    }));
    const dte = moment();

    return (
      <Box marginTop="lg" flexGrow={1}>
        <Box flexGrow={1}>
          <SwipeListView
            useSectionList
            sections={sections}
            keyExtractor={(item, index) => `${item.id}`}
            ListEmptyComponent={
              <NoResultsBox message="No Events Found" icon="event" />
            }
            renderItem={(data, rowMap) => {
              const { item } = data;
              return (
                <EventRow
                  event={item}
                  shareable={dte.isBefore(item.endTime)}
                  onPress={() => {
                    onSelected(item);
                  }}
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
  };

  return (
    <BottomSheetModalProvider>
      <MainLayout>
        <Header
          onBackPress={() => {
            if (navigation.canGoBack()) navigation.goBack();
          }}
        />
        <Box paddingHorizontal="lg" flex={1}>
          <Box>
            <Text variant="title" marginBottom="lg">
              Events
            </Text>
            <Text>
              Select event to scan tickets at the gate or search for a customer
              to check in.
            </Text>

            <SearchBox
              onChange={value => setFilter(x => ({ ...x, name: value }))}
              value={filter.name}
            />
          </Box>
          {renderContent()}
        </Box>
        <TicketShareModal ref={shareRef} />
      </MainLayout>
    </BottomSheetModalProvider>
  );
};

export default EventSelectorModal;
