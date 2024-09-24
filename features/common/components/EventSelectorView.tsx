import React from 'react';
import { SectionList, SectionListData, StyleSheet } from 'react-native';
import { orderBy, groupBy, map } from 'lodash';
import { useIsFocused } from '@react-navigation/native';
import { BoxProps } from '@shopify/restyle';
import moment from 'moment';

import { SwipeableEventRow } from '../../../components';
import { Text, Box } from '../../../ui';
import { Event } from '../types';
import { Theme } from '../../../ui/theme';

const eventSection = (event: Event) =>
  moment(event.startTime).isSame(new Date(), 'day')
    ? 'TODAY'
    : moment(event.startTime).isBefore(new Date(), 'day')
    ? 'PAST'
    : 'UPCOMING';

interface Props extends BoxProps<Theme> {
  events: Event[];
  onSelected: (event: Event) => void;
  shareable?: (event: Event) => boolean;
  onShareSelected?: (event: Event) => void;
}
export const EventSelectorView: React.FC<Props> = ({
  events,
  onSelected,
  shareable,
  onShareSelected,
  ...props
}) => {
  const isFocused = useIsFocused();
  const titleText = 'Select your Event';

  const handleSelectedEvent = (event: Event) => {
    if (onSelected) onSelected(event);
  };
  const renderHeader = (info: {
    section: SectionListData<
      Event,
      {
        title: string;
        data: Event[];
      }
    >;
  }) => (
    <Box backgroundColor="listSectionBackgroudColor" padding="xs">
      <Text variant="sectionHeader">{info.section.title}</Text>
    </Box>
  );
  if (!isFocused) return null;
  const sectionGroup = groupBy(events, eventSection);
  const sections = orderBy(
    map(sectionGroup, (data, key) => ({
      title: key,
      data: orderBy(data, x => x.endTime),
      sort: key === 'TODAY' ? 1 : key === 'UPCOMING' ? 2 : 3,
    })),
    'sort',
  );
  console.log('shareable', shareable, onShareSelected)
  return (
    <SectionList
      sections={sections}
      ItemSeparatorComponent={() => (
        <Box
          flex={1}
          backgroundColor="black"
          height={StyleSheet.hairlineWidth}
        />
      )}
      renderItem={({ item, index }) => (
        <SwipeableEventRow
          event={item}
          onSelected={() => handleSelectedEvent(item)}
          onShare={() => {
            return shareable && shareable(item) && onShareSelected
              ? onShareSelected(item)
              : undefined}
          }
        />
      )}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderSectionHeader={renderHeader}
    />
  );
};
export default EventSelectorView;
