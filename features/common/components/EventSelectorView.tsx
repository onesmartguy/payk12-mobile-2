import { Theme } from "@/utils/theme";
import { BoxProps } from "@shopify/restyle";
import { EventModel } from "../types";
import { useIsFocused } from "@react-navigation/native";
import { SectionList, SectionListData, StyleSheet } from "react-native";
import Box from "./Box";
import TextView from "./TextView";
import { groupBy, map, orderBy } from "lodash";
import SwipeableEventRow from "./SwipeableEventRow";
import { eventSection } from "@/utils/events";

interface Props extends BoxProps<Theme> {
  events: EventModel[];
  onSelected: (event: EventModel) => void;
  shareable?: (event: EventModel) => boolean;
  onShareSelected?: (event: EventModel) => void;
}
export const EventSelectorView: React.FC<Props> = ({
  events,
  onSelected,
  shareable,
  onShareSelected,
  ...props
}) => {
  const isFocused = useIsFocused();
  const handleSelectedEvent = (event: EventModel) => {
    if (onSelected) onSelected(event);
  };
  const renderHeader = (info: {
    section: SectionListData<
      EventModel,
      {
        title: string;
        data: EventModel[];
      }
    >;
  }) => (
    <Box backgroundColor="listSectionBackgroudColor" padding="xs">
      <TextView variant="sectionHeader">{info.section.title}</TextView>
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
