import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  LayoutRectangle,
  PixelRatio,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import QRCode from 'react-native-qrcode-svg';
import { useResponsiveProp, useTheme, BoxProps } from '@shopify/restyle';
import { multiply } from 'lodash';
import moment from 'moment';

import { RedemptionButton } from '../features/ticketing/components';
import { getCheckoutDate, getDateAsString } from '../utils/EventUtils';
import { Theme, palette } from '../ui/theme';
import { Ticket } from '../features/common/types';
import { Text, Box } from '../ui';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface TicketCardProps extends BoxProps<Theme> {
  ticket: Ticket;
  width: number;
  index?: number;
  count?: number;
  onPressToRedeem?: (ticket: Ticket) => void;
}

export const TicketView = ({
  ticket,
  width,
  index,
  count,
  onPressToRedeem,
  ...props
}: TicketCardProps): JSX.Element => {
  const theme = useTheme<Theme>();
  const margin = theme.spacing.m;
  const qrsize = width * 0.8 - 4 * margin;

  const date = moment(ticket.startTime).format('MM/DD/YY');
  const day = moment(ticket.startTime).format('ddd');
  const time = moment(ticket.startTime).format('hh:mm A');

  const TicketDisplay = () =>  {
    const [qrWidth, setQrWidth] = useState(0);
    const backgroundColor =
      ticket.type === 'R' ? 'ticketCardBackground' : 'mainBackground';
    const redeemedBackgroundColor = !ticket.isRedeemable
      ? 'disabledButton'
      : 'mainBackground';
    if (ticket.type === 'R') {
      return (
        <Box
          alignItems="center"
          justifyContent="center"
          minWidth={qrsize}
          minHeight={qrsize}
          backgroundColor="transparentButtonBackground"
        >
          <RedemptionButton
            onPress={() => {
              onPressToRedeem && onPressToRedeem(ticket);
            }}
          />
        </Box>
      );
    }
    const cornerLength = 8;
    const onQrCodeResized = (e: LayoutChangeEvent) => {
      setQrWidth(e.nativeEvent.layout.width);
    };
    return (
      <Box
        flexDirection="column"
        padding="s"
        borderRadius={16}
        alignSelf="stretch"
      >
        <Box flexDirection="row" alignSelf="stretch">
          <Box height={cornerLength} flex={1} backgroundColor="black" />
          <Box flex={4} />
          <Box height={cornerLength} flex={1} backgroundColor="black" />
        </Box>
        <Box flexDirection="row" alignSelf="stretch">
          <Box width={cornerLength}>
            <Box height={cornerLength} flex={1} backgroundColor="black" />
            <Box flex={4} />
            <Box height={cornerLength} flex={1} backgroundColor="black" />
          </Box>
          <Box flex={4}>
            <Box padding="s" backgroundColor={backgroundColor} borderRadius={8}>
              <Box alignSelf="stretch" onLayout={onQrCodeResized} />
              <QRCode size={qrWidth} value={ticket.ticketNumber} />
            </Box>
          </Box>
          <Box width={cornerLength}>
            <Box height={cornerLength} flex={1} backgroundColor="black" />
            <Box flex={4} />
            <Box height={cornerLength} flex={1} backgroundColor="black" />
          </Box>
        </Box>
        <Box flexDirection="row" alignSelf="stretch">
          <Box height={cornerLength} flex={1} backgroundColor="black" />
          <Box flex={4} />
          <Box height={cornerLength} flex={1} backgroundColor="black" />
        </Box>
      </Box>
    );
  };
  const ticketCount = ticket.ticketNumber.split('|').length || 0;

  const ticketNumber = ticketCount < 2 ? ticket.ticketNumber : ``;
  const ticketPager =
    ticketCount < 2
      ? `Ticket ${index} of ${count}`
      : `${ticketCount} tickets selected`;
  return (
    <Box
      flex={1}
      backgroundColor="ticketCardBackground"
      borderWidth={4}
      borderColor="ticketCardBackground"
      borderRadius={14}
      shadowColor="mainForeground"
      shadowOffset={{ height: 1, width: 0 }}
      shadowOpacity={0.8}
      flexGrow={1}
      {...props}
    >
      <Box
        flex={1}
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
        margin="xs"
      >
        <Box
          flex={1}
          flexDirection="column"
          alignSelf="stretch"
          marginHorizontal="m"
          marginTop="m"
        >
          <Box
            alignItems="center"
            justifyContent="center"
            marginHorizontal="lg"
          >
            <TicketDisplay />

            {ticket.isRedeemed && (
              <Box
                {...StyleSheet.absoluteFillObject}
                borderColor="cardBackground"
                alignItems="center"
                justifyContent="center"
                style={{ backgroundColor: '#FFFFFFEE' }}
              >
                <Box
                  borderColor="successButton"
                  borderWidth={8}
                  borderRadius={8}
                  position="absolute"
                  paddingVertical="s"
                  paddingHorizontal="xs"
                  style={[{ transform: [{ rotate: '-25deg' }] }]}
                >
                  <Text
                    color="successButton"
                    textTransform="uppercase"
                    fontSize={38}
                    lineHeight={38}
                    fontWeight="600"
                    adjustsFontSizeToFit={true}
                    textBreakStrategy='balanced'
                  >
                    Redeemed
                  </Text>
                </Box>
              </Box>
            )}
          </Box>
          <Box
            flex={1}
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            {!ticketNumber.includes('|') && (
              <Text marginTop="xs">{ticketNumber}</Text>
            )}
            <Box
              flex={1}
              flexGrow={1}
              marginTop="m"
              alignItems="center"
              alignSelf="stretch"
            >
              <Text textAlign="center">{ticket.schoolName}</Text>

              <Text
                variant="header2"
                fontSize={16}
                textAlign="center"
                marginTop="xs"
              >
                {ticket.eventName}
              </Text>
              {ticket.type === 'P' && (
                <Text fontSize={16} marginTop="xs">
                  Pass #{ticket.passNumber}
                </Text>
              )}
              {!ticket.redeemedOn && (
                <Text fontSize={16} marginTop="xs">
                  {getDateAsString(ticket.startTime)}
                </Text>
              )}
              {ticket.redeemedOn && (
                <Text
                  color="successButton"
                  fontSize={16}
                  marginTop="xs"
                  fontWeight="400"
                >
                  Checked in: {getCheckoutDate(ticket.redeemedOn)}
                </Text>
              )}
            </Box>

            {ticket.section && ticket.row && (
              <Box
                flex={1}
                flexDirection="column"
                justifyContent="center"
                margin="xs"
                flexGrow={1}
                alignSelf="stretch"
              >
                <Text variant="header2" fontSize={16}>
                  {ticket.ownerEmail}
                </Text>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignSelf="stretch"
                >
                  <Text>{`Section: ${ticket.section}`}</Text>
                  <Text>{`Row: ${ticket.row}`}</Text>
                  <Text>{`Seat: ${ticket.seat}`}</Text>
                </Box>
              </Box>
            )}
            {ticket.ticketNumber.includes('|') ? (
              <Text
                textTransform="uppercase"
                letterSpacing={4}
                color="titleText"
                fontSize={20}
                fontWeight="600"
                paddingBottom="2xl"
              >
                {ticketPager}
              </Text>
            ) : (
              <Text
                textTransform="uppercase"
                letterSpacing={4}
                color="titleText"
              >
                {ticketPager}
              </Text>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketView;
