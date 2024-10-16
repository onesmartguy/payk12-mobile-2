
import React, {useContext, useEffect, useState} from 'react';
import {SectionList, TouchableOpacity} from 'react-native';
import {every, groupBy, map, orderBy, remove, some} from 'lodash';
import {useIsFocused} from '@react-navigation/native';



import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCircleCheck } from '@fortawesome/pro-regular-svg-icons';
import { faCircleCheck as faSolidCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { palette } from '@/utils/theme';
import Box from '@/features/common/components/Box';
import TextView from '@/features/common/components/TextView';
import Button from '@/features/common/components/Button';
import SearchBox from '@/features/common/components/SearchBox';
import LoadingBlock from '@/features/common/components/LoadingBlock';
import NoResultsView from '@/features/common/components/NoResultsView';
import { eventSection, getDateAsString } from '@/utils/events';
import { AppScreens, EventModel, SearchRequest } from '@/common/types';
import useSessionStore from '@/auth/stores/useSessionStore';
import { NativeStackScreenProps } from 'react-native-screens/lib/typescript/native-stack/types';
import useRedeemableEvents from '@/redemption/hooks/useRedeemableEvents';
import ViewWithHeader from '@/common/components/ViewWithHeader';

type Props = NativeStackScreenProps<AppScreens, 'Profile'>;

const EventItem = ({event, selected, onPress}: {event: EventModel; selected: boolean; onPress: any}) => {
  const df = getDateAsString(event.startTime);
  return (
    <TouchableOpacity onPress={() => onPress(event, !selected)}>
      <Box flex={1} flexDirection={'row'} borderBottomColor="listDividerColor"
          borderBottomWidth={1}>
        <Box alignItems='center' justifyContent='center' p='s'>
          <FontAwesomeIcon color={selected ? palette.darkGrayBlue : palette.lightGray} size={24} icon={selected ? faSolidCheckCircle : faCircleCheck }></FontAwesomeIcon>
        </Box>
        <Box flexGrow={1}
          padding="m">
          <TextView variant="row">{event.name}</TextView>
          <TextView variant="rowDetails" marginTop="xs">
            {df}
          </TextView>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};
export const AdminEventSelectionScreen: React.FC<Props> = ({
  navigation,
  route,
}) => {

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEvents, setSelectedEvents] = useState<EventModel[]>([]);

  const user = useSessionStore(x => x.user);
  const { events, hasNextPage, isFetching, error } = useRedeemableEvents({ tenantId: user?.tenantId });
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  const renderContent = () => {
    if (isFetching) return <LoadingBlock />;

    if (error) return <TextView variant="loading">{JSON.stringify(error)}</TextView>;

    if (events?.length === 0)
      return <NoResultsView icon="event" message="No Events Found" />;

    const sectionGroup = groupBy(events, eventSection);

    const sections = 
    orderBy(map(sectionGroup, (data, key) => ({
      title: key,
      data: orderBy(data, x => x.startTime),
      sort: key === 'TODAY' ? 1 : key === 'UPCOMING' ? 2 : 3,
    })),
    'sort')

    return (
      <ViewWithHeader>
        <Box flex={1}>
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => item.id.toString()}
            renderItem={({item: event}) => (
              <EventItem
                event={event}
                selected={some(selectedEvents, x => x.id == event.id)}
                onPress={(event: EventModel, selected: boolean) => {
                  if(!selected){
                    setSelectedEvents(evts => [...remove(evts, x => x.id != event.id)])
                  } else {
                    if(every<EventModel>(events, x => x.id != event.id))
                      setSelectedEvents(evts => [...evts, event])
                  }
                  
                }}
              />
            )}
            renderSectionHeader={({section: {title}}) => (
              <Box backgroundColor="listSectionBackgroudColor" padding="xs">
                <TextView variant="sectionHeader">{title}</TextView>
              </Box>
            )}
          />
          {/* {JSON.stringify(sections)} */}
        </Box>
      </ViewWithHeader>
    );
  };
  const buttonLabel =  `${selectedEvents.length} Event${selectedEvents.length > 1 ? 's' : ''}`
  return (

      <Box paddingHorizontal="lg" flex={1}>
        <Box flex={0}>
          <TextView variant="title" marginBottom="lg">
            Events
          </TextView>
          <TextView>
            Select event to scan tickets at the gate or search for a customer to
            check in.
          </TextView>
          <SearchBox
            onChange={value => setSearchTerm(x => value)}
            value={searchTerm}
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
  );
};

export default AdminEventSelectionScreen;
