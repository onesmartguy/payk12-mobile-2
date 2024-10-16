import { BoxProps, TextProps, backgroundColor } from '@shopify/restyle';
import React, {useRef} from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {
} from 'react-native-reanimated';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Dimensions, TouchableOpacity } from 'react-native';
import { palette, Theme } from '@/utils/theme';
import Box from './Box';
import TextView from './TextView';
import { getDateAsString } from '@/utils/events';
import { EventModel } from '../types';


const win = Dimensions.get('window');

interface EventRow extends BoxProps<Theme>, EventModel {
  ticketCount?: number;
  nameStyle?: TextProps<Theme>;
  startDateStyle?: TextProps<Theme>;
  ticketsStyle?: TextProps<Theme>;
}

const EventBaseRow = ({
  name,
  startTime,
  ticketCount,
  nameStyle,
  startDateStyle,
  ticketsStyle,
  id,
  ...props
}: EventRow) => {
  return (
    <Box {...props}>
      {name && (
        <TextView variant="EventRowName" {...nameStyle}>
          {name}
        </TextView>
      )}
      {startTime && (
        <TextView variant="EventRowStartDate" {...startDateStyle}>
          {getDateAsString(startTime)}
        </TextView>
      )}
      {ticketCount && (
        <TextView variant="EventRowTicketCount" {...ticketsStyle}>
          ({ticketCount}) Ticket{ticketCount > 1 && 's'}
        </TextView>
      )}
    </Box>
  );
};
const SwipeableEventRow = ({
  event,
  onShare,
  onSelected,
}: {
  event: EventModel;
  onShare?: () => void;
  onSelected?: () => void;
}) => {

  const swipeableRef = useRef<Swipeable>(null)


  const onClose = () => {};
  const renderLeftActions = (progress: any, drag: any) => {
    
    if(!onShare)
      return null;
    return (
      <TouchableOpacity
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.lighterGray,
            width: win.width / 4,
          },
        ]}
        onPress={() => {
          swipeableRef.current?.close()
          onShare && onShare()
        }}
      >
        <Animated.Text
          style={[
            {
              alignSelf: 'center',
              fontSize: 16,
              color: palette.darkGray,
            },
          ]}
        >
          Share
        </Animated.Text>
      </TouchableOpacity>
    );
  };
  const isShareable = event.isShareable;
  console.log('onShare', isShareable, onShare)
  return (
    <Swipeable ref={swipeableRef} renderLeftActions={!!onShare && isShareable && renderLeftActions} containerStyle={{backgroundColor: palette.lighterGray}}>
     
        <Box
          borderBottomWidth={1}
          borderColor="listDividerColor"
          flex={1}
          flexDirection="row"
          paddingVertical="xs"
          backgroundColor="white"
          onTouchEnd={() => onSelected && onSelected()}
        >
          <Box
            alignItems="center"
            justifyContent="center"
            paddingRight="xs"
            opacity={isShareable ? 1 : 0}
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </Box>
          <EventBaseRow {...event} ticketCount={event.availibleTickets} />
        </Box>
    </Swipeable>
  );
};

export default SwipeableEventRow;
