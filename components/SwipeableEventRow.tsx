import { BoxProps, TextProps, backgroundColor } from '@shopify/restyle';
import React, {useRef} from 'react';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Dimensions } from 'react-native';
import moment from 'moment';

import { getDateAsString } from '../utils';
import { Event } from '../features/common/types';
import { Box, palette, Text, Theme } from '../ui';

const win = Dimensions.get('window');

interface EventRow extends BoxProps<Theme>, Event {
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
  ...props
}: EventRow) => {
  return (
    <Box {...props}>
      {name && (
        <Text variant="EventRowName" {...nameStyle}>
          {name}
        </Text>
      )}
      {startTime && (
        <Text variant="EventRowStartDate" {...startDateStyle}>
          {getDateAsString(startTime)}
        </Text>
      )}
      {ticketCount && (
        <Text variant="EventRowTicketCount" {...ticketsStyle}>
          ({ticketCount}) Ticket{ticketCount > 1 && 's'}
        </Text>
      )}
    </Box>
  );
};
const SwipeableEventRow = ({
  event,
  onShare,
  onSelected,
}: {
  event: Event;
  onShare?: () => void;
  onSelected?: () => void;
}) => {
  const translateX = useSharedValue(0);
  const swipeableRef = useRef<Swipeable>(null)
  const leftActionStyles = useAnimatedStyle(() => {
    const transX = interpolate(
      translateX.value,
      [0, 50, win.width / 4, win.width / 4], // between the beginning and end of the slider
      [-(win.width / 4), 0, 0, 1], // penguin will make 4 full spins
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX: transX }],
    };
  });

  const onClose = () => {};
  const renderLeftActions = (progress: any, drag: any) => {
    
    if(!onShare)
      return null;
    return (
      <RectButton
        style={[
          {
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: palette.lighterGray,
            width: win.width / 4,
          },
          leftActionStyles,
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
      </RectButton>
    );
  };
  const isShareable = event.isShareable;
  console.log('onShare', isShareable, onShare)
  return (
    <Swipeable ref={swipeableRef} renderLeftActions={onShare && isShareable ? renderLeftActions : undefined} containerStyle={{backgroundColor: palette.lighterGray}}>
      <RectButton onPress={() => onSelected && onSelected()} style={{backgroundColor: palette.lighterGray}}>
        <Box
          borderBottomWidth={1}
          borderColor="listDividerColor"
          flex={1}
          flexDirection="row"
          paddingVertical="xs"
          backgroundColor="white"
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
      </RectButton>
    </Swipeable>
  );
};

export default SwipeableEventRow;
