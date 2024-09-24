import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  StyleSheet,
  LayoutRectangle,
  PixelRatio,
  ViewStyle,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import QRCode from 'react-native-qrcode-svg';
import { useResponsiveProp, useTheme } from '@shopify/restyle';
import { multiply, omit } from 'lodash';
import moment from 'moment';
import {
  HandlerStateChangeEvent,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';

import { Theme, palette } from '../ui/theme';
import { Ticket } from '../features/common/types';
import { Text, Box } from '../ui';

import { TicketView } from './TicketView';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const mainCardHeight = SCREEN_HEIGHT - 120;
const mainCardWidth = SCREEN_WIDTH * 0.8;

interface TicketStackProps {
  tickets: Ticket[];
  groupable?: boolean;
  onPressToRedeem: (ticket: Ticket) => void;
}

export const TicketStack = ({
  tickets,
  groupable = false,
  onPressToRedeem,
}: TicketStackProps): JSX.Element => {
  const carouselRef = React.createRef<Carousel<any>>();
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [activeIndex, setActivateIndex] = useState(0);
  const multiPass = useSharedValue(false);
  const [isMultiPass, setIsMultiPass] = useState(false);
  const [redeemableTickets, setRedeemableTickets] = useState([] as Ticket[]);
  const [layoutView, setLayoutView] = useState<'default' | 'stack' | 'tinder'>(
    'default',
  );
  useEffect(() => {
    setRedeemableTickets(tickets.filter(x => x.isRedeemable));
  }, [tickets]);
  const theme = useTheme<Theme>();
  const margin = theme.spacing.m;

  const handleLayoutChange = ({ width }: LayoutRectangle) => {
    if (sliderWidth === 0) {
      setSliderWidth(width);
      setItemWidth(width - 2 * margin);
    }
  };

  const handleOnRedeemPressed = (ticket: Ticket) => {
    if (onPressToRedeem) onPressToRedeem(ticket);
  };
  const pager = () => {
    return (
      <Pagination
        dotsLength={tickets.length}
        activeDotIndex={activeIndex}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: palette.darkGray,
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    );
  };
  const setLayout = () => {
    setLayoutView(multiPass ? 'default' : 'tinder');
    setIsMultiPass(multiPass.value);
  };

  const handlePinchGesture = (evnt: any) => {
    if (groupable && redeemableTickets.length > 0) {
      if (evnt.scale > 2) {
        multiPass.value = false;
      }
      if (evnt.scale < 0.5) {
        multiPass.value = true;
      }
      setLayout();
    }
  };

  const renderTickets = () => {

    if (groupable && isMultiPass) {
      const ticket = omit(redeemableTickets[0], [
        'row',
        'seat',
        'section',
      ]) as Ticket;

      ticket.ticketNumber = redeemableTickets
        .map(x => x.ticketNumber)
        .join('|');

      return (
        <Box flex={1} marginTop="m" marginBottom="lg" marginHorizontal="lg">
          {redeemableTickets.length > 2 && (
            <Box
              position="absolute"
              top={20}
              right={0}
              bottom={-20}
              left={0}
              flex={1}
              backgroundColor="ticketCardBackground"
              borderWidth={4}
              borderColor="ticketCardBackground"
              borderRadius={14}
              shadowColor="mainForeground"
              shadowOffset={{ height: 1, width: 0 }}
              shadowOpacity={0.8}
              flexGrow={1}
            />
          )}
          <Box
            position="absolute"
            top={10}
            right={0}
            bottom={-10}
            left={0}
            flex={1}
            backgroundColor="ticketCardBackground"
            borderWidth={4}
            borderColor="ticketCardBackground"
            borderRadius={14}
            shadowColor="mainForeground"
            shadowOffset={{ height: 1, width: 0 }}
            shadowOpacity={0.8}
            flexGrow={1}
          />
          <TicketView
            ticket={ticket}
            width={itemWidth}
            onPressToRedeem={handleOnRedeemPressed}
            position="absolute"
            top={0}
            right={0}
            bottom={0}
            left={0}
          />
        </Box>
      );
    }
    return (
      <Carousel
        ref={carouselRef}
        data={tickets}
        layout="default"
        layoutCardOffset={15}
        renderItem={({ item, index }) => (
          <TicketView
            ticket={item}
            width={itemWidth}
            index={index + 1}
            count={tickets.length}
            onPressToRedeem={handleOnRedeemPressed}
            marginTop="m"
            marginBottom="lg"
            marginHorizontal="xs"
          />
        )}
        itemWidth={itemWidth}
        sliderWidth={sliderWidth}
        onSnapToItem={index => setActivateIndex(index)}
      />
    );
  };
  return (
    <PinchGestureHandler onEnded={evnt => handlePinchGesture(evnt.nativeEvent)}>
      <Box flex={1}>
        <Box
          flex={1}
          onLayout={({ nativeEvent }) => handleLayoutChange(nativeEvent.layout)}
        >
          {sliderWidth > 0 && itemWidth > 0 && (
            <Box flex={1}>{renderTickets()}</Box>
          )}
          <Box opacity={isMultiPass ? 0 : 1}>{pager()}</Box>
        </Box>
      </Box>
    </PinchGestureHandler>
  );
};

const edge: ViewStyle = {
  borderColor: 'white',
  borderLeftWidth: 3,
  borderTopWidth: 3,
  borderTopLeftRadius: 10,
  position: 'absolute',
  height: 50,
  width: 44,
};

export const styles = StyleSheet.create({
  bottomRight: {
    transform: [{ rotate: '180deg' }],
    ...edge,
    right: 0,
    bottom: 0,
  },
  bottomLeft: {
    transform: [{ rotateX: '180deg' }],
    ...edge,
    bottom: 0,
    left: 0,
  },
  captureBox: {
    height: 240,
    width: 200,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLeft: {
    ...edge,
    left: 0,
    top: 0,
  },
  topRight: {
    transform: [{ rotateY: '180deg' }],
    ...edge,
    top: 0,
    right: 0,
  },
});
export default TicketStack;
