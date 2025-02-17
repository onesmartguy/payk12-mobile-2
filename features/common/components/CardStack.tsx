import React, { useState, useEffect, useMemo } from 'react';
import {
  Dimensions,
  StyleSheet,
  LayoutRectangle,
  PixelRatio,
  ViewStyle,
} from 'react-native';
import { useResponsiveProp, useTheme } from '@shopify/restyle';
import { multiply, omit } from 'lodash';
import {
  HandlerStateChangeEvent,
  PinchGestureHandler,
} from 'react-native-gesture-handler';
import Animated, { runOnJS, useSharedValue } from 'react-native-reanimated';
import Carousel, {ICarouselInstance, Pagination} from 'react-native-reanimated-carousel'
import { palette, Theme } from '@/utils/theme';
import Box from './Box';
import TicketView from './TicketView';
import { PassModel, TicketModel } from '../types';



const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

const mainCardHeight = SCREEN_HEIGHT - 120;
const mainCardWidth = SCREEN_WIDTH * 0.8;

interface TicketStackProps {
  tickets: (TicketModel | PassModel)[];
  groupable?: boolean;
  onHoldToRedeem: (ticket: TicketModel) => void;
}

export const TicketStack = ({
  tickets,
  groupable = false,
  onHoldToRedeem,
}: TicketStackProps): JSX.Element => {

  const carouselRef = React.useRef<ICarouselInstance>(null);
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const [itemWidth, setItemWidth] = useState<number>(0);
  const [activeIndex, setActivateIndex] = useState(0);
  const multiPass = useSharedValue(false);
  const [isMultiPass, setIsMultiPass] = useState(false);
  const [redeemableTickets, setRedeemableTickets] = useState([] as TicketModel[]);
  const [layoutView, setLayoutView] = useState<'default' | 'stack' | 'tinder'>(
    'default',
  );

  useEffect(() => {
    console.log('tickets', tickets);
    setRedeemableTickets(tickets);
  }, [tickets]);

  const theme = useTheme<Theme>();
  const margin = theme.spacing.m;

  const handleLayoutChange = ({ width }: LayoutRectangle) => {
    if (sliderWidth === 0) {
      setSliderWidth(width);
      setItemWidth(width - 2 * margin);
    }
  };

  const handleOnRedeemPressed = (ticket: TicketModel) => {
    if (onHoldToRedeem) onHoldToRedeem(ticket);
  };
  const progress = useSharedValue(0);
  const pager = () => {
    return (
      <Pagination.Basic
       progress={progress}
       data={tickets}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          marginHorizontal: 8,
          backgroundColor: palette.darkGray,
        }}
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
    console.log('redeemableTickets', {redeemableTickets, isMultiPass, groupable});
    if (groupable && isMultiPass) {
      const ticket = omit(redeemableTickets[0], [
        'row',
        'seat',
        'section',
      ]) as TicketModel;

      ticket.code = redeemableTickets
        .map(x => x.code)
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
    console.log('Carousel tickets', tickets);
    return (
      <Carousel
        ref={carouselRef}
        data={tickets}
        width={sliderWidth}
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
