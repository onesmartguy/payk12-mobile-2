import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {SectionList, TouchableOpacity} from 'react-native';
import {DrawerScreenProps} from '@react-navigation/drawer';
import moment from 'moment';
import {every, groupBy, map, orderBy, remove, some} from 'lodash';
import {useIsFocused} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';

import {
  Button,
  Text,
  Box,
  SearchBox,
  LoadingBlock,
  NoResultsBox,
} from '../../../ui';
import {MainLayout, Header} from '../../../components';
import {useLazyGetEventsAsAdminQuery} from '../service';
import {StackParamList} from '../../../navigation';
import {NamePageSearch, Event, School} from '../../common/types';
import {addManagedEvents, eventsSelector} from '../redemptionSlice';
import {RootState} from '../../../store';
import {EventUtils} from '../../../utils/EventUtils';
import {useAppContext} from '../../auth/authSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-regular-svg-icons';
import { faCheckCircle as faSolidCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { palette } from '../../../ui/theme';

type Props = StackScreenProps<StackParamList, 'EventSelector'>;

const EventItem = ({event, selected, onPress}: {event: Event; selected: boolean; onPress: any}) => {
  const df = EventUtils.getDateAsString(event.startTime);
  return (
    <TouchableOpacity onPress={() => onPress(event, !selected)}>
      <Box flex={1} flexDirection={'row'} borderBottomColor="listDividerColor"
          borderBottomWidth={1}>
        <Box alignItems='center' justifyContent='center' p='s'>
          <FontAwesomeIcon color={selected ? palette.darkGrayBlue : palette.lightGray} size={24} icon={selected ? faSolidCheckCircle : faCheckCircle }></FontAwesomeIcon>
        </Box>
        <Box flexGrow={1}
          padding="m">
          <Text variant="row">{event.name}</Text>
          <Text variant="rowDetails" marginTop="xs">
            {df}
          </Text>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};
export const AdminEventSelectionScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {
  const {currentSchool, setEvent} = useAppContext();
  const dispatch = useDispatch();
  const events = useSelector<RootState>(eventsSelector) as Event[];

  const [selectedEvents, setSelectedEvents] = useState<Event[]>([]);

  const [filter, setFilter] = useState<NamePageSearch>({
    schoolId: currentSchool?.id,
  });

  const [filteredEvents, setFilteredEvents] = useState(
    events.filter(x => x.schoolId === currentSchool.id),
  );
  const [fetch, {data, error, isFetching}] = useLazyGetEventsAsAdminQuery();
  const isFocused = useIsFocused();

  useEffect(() => {
    fetch(filter);
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      x =>
        x.schoolId === currentSchool.id &&
        (some(selectedEvents, e => e.id == x.id) || filter.name === '' ||
          !filter.name ||
          (filter.name &&
            x.name.toLocaleLowerCase().includes(filter.name.toLowerCase()))) ,
    );
    setFilteredEvents(filtered);
  }, [events, filter]);

  useEffect(() => {
    if (data && data.items.length > 0) {
      dispatch(addManagedEvents(data.items));
    }
  }, [data, error]);

  useEffect(() => {
    if (isFocused) {
      if (!currentSchool) navigation.pop();
      setFilter({...filter, schoolId: currentSchool.id});
    }
  }, [currentSchool]);
  if (!isFocused) {
    return null;
  }

  const renderContent = () => {
    if (isFetching && filteredEvents.length === 0) return <LoadingBlock />;

    if (error) return <Text variant="loading">{JSON.stringify(error)}</Text>;

    if (filteredEvents.length === 0)
      return <NoResultsBox icon="event" message="No Events Found" />;
    const sectionGroup = groupBy(filteredEvents, EventUtils.eventSection);

    const sections = 
    orderBy(map(sectionGroup, (data, key) => ({
      title: key,
      data: orderBy(data, x => x.startTime),
      sort: key === 'TODAY' ? 1 : key === 'UPCOMING' ? 2 : 3,
    })),
    'sort')

    return (
      <Box marginTop="lg" flexGrow={1}>
        <Box flex={1}>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({item: event}) => (
              <EventItem
                event={event}
                selected={some(selectedEvents, x=> x.id == event.id)}
                onPress={(event: Event, selected: boolean)=> {
                  if(!selected){
                    setSelectedEvents(evts => [...remove(evts, x => x.id != event.id)])
                  } else {
                    if(every(selectedEvents, x => x.id != event.id))
                      setSelectedEvents(evts => [...evts, event])
                  }
                  
                }}
              />
            )}
            renderSectionHeader={({section: {title}}) => (
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
  const buttonLabel =  `${selectedEvents.length} Event${selectedEvents.length > 1 ? 's' : ''}`
  return (
    <MainLayout
      showHeader
      headerOptions={{
        onBackPress: () => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          }
        },
      }}>
      <Box paddingHorizontal="lg" flex={1}>
        <Box flex={0}>
          <Text variant="title" marginBottom="lg">
            Events
          </Text>
          <Text>
            Select event to scan tickets at the gate or search for a customer to
            check in.
          </Text>
          <SearchBox
            onChange={value => setFilter(x => ({...x, name: value}))}
            value={filter.name}
          />
        </Box>
        {renderContent()}
        {selectedEvents.length > 0 && <Box>
          <Button variant='primary' label={buttonLabel} onPress={() => {
            navigation.navigate('TicketScanner', {events: selectedEvents})
          }}></Button>
        </Box>
        }
      </Box>
    </MainLayout>
  );
};

export default AdminEventSelectionScreen;
