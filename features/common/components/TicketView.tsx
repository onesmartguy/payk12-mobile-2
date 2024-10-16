import { Theme } from '@/utils/theme';
import { BoxProps, useTheme } from '@shopify/restyle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Dimensions, LayoutChangeEvent, StyleSheet } from 'react-native';
import { TicketModel } from '../types';
import Box from './Box';
import { RedemptionButton } from '@/ticketing/components';
import QRCode from 'react-native-qrcode-svg';
import TextView from './TextView';
import { getCheckoutDate, getDateAsString } from '@/utils/events';
import { format } from 'date-fns';
import useEventStore from '../stores/useEventStore';
import useSchoolStore from '../stores/useSchoolStore';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface TicketCardProps extends BoxProps<Theme> {
  ticket: TicketModel;
  width: number;
  index?: number;
  count?: number;
  onPressToRedeem?: (ticket: TicketModel) => void;
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
  const getEventById = useEventStore((state) => state.getEventById);
  const getSchoolById = useSchoolStore((state) => state.getSchoolById);
  const event = getEventById(ticket.eventId)!;
  const school = getSchoolById(event.schoolId!)!;
  const date = format(event.startTime,'MM/dd/yy');
  const day = format(event.startTime,'ddd');
  const time = format(event.startTime,'hh:mm a');
  const isHoldToRedeem = event.flags & 0x2;
  
  const TicketDisplay = () => 
    {
    const [qrWidth, setQrWidth] = useState(0);
    const backgroundColor =
      ticket.type === 'other' ? 'ticketCardBackground' : 'mainBackground';
    const redeemedBackgroundColor = !ticket.redeemedOn
      ? 'disabledButton'
      : 'mainBackground';
    if (isHoldToRedeem) {
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
            <Box padding="s" backgroundColor={backgroundColor} borderRadius={8} minHeight={qrsize}>
              <Box alignSelf="stretch" onLayout={onQrCodeResized} />
              
              <QRCode size={qrsize} value={ticket.code} />
              
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
  const ticketCount = ticket.code.split('|').length || 0;

  const ticketNumber = ticketCount < 2 ? ticket.code : ``;
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
                  <TextView
                    color="successButton"
                    textTransform="uppercase"
                    fontSize={38}
                    lineHeight={38}
                    fontWeight="600"
                    adjustsFontSizeToFit={true}
                    textBreakStrategy='balanced'
                  >
                    Redeemed
                  </TextView>
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
              <TextView marginTop="xs">{ticketNumber}</TextView>
            )}
            <Box
              flex={1}
              flexGrow={1}
              marginTop="m"
              alignItems="center"
              alignSelf="stretch"
            >
              <TextView textAlign="center">{school.name}</TextView>

              <TextView
                variant="header2"
                fontSize={16}
                textAlign="center"
                marginTop="xs"
              >
                {event.name}
              </TextView>
              {ticket.type === 'pass' && (
                <TextView fontSize={16} marginTop="xs">
                  Pass #{ticket.formattedCode}
                </TextView>
              )}
              {!ticket.redeemedOn && (
                <TextView fontSize={16} marginTop="xs">
                  {getDateAsString(event.startTime)}
                </TextView>
              )}
              {ticket.redeemedOn && (
                <TextView
                  color="successButton"
                  fontSize={16}
                  marginTop="xs"
                  fontWeight="400"
                >
                  Checked in: {getCheckoutDate(ticket.redeemedOn)}
                </TextView>
              )}
            </Box>

            {ticket.seat && (
              <Box
                flex={1}
                flexDirection="column"
                justifyContent="center"
                margin="xs"
                flexGrow={1}
                alignSelf="stretch"
              >
                <TextView variant="header2" fontSize={16}>
                  {ticket.ownerEmail}
                </TextView>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  alignSelf="stretch"
                >
                  <TextView>{`Section: ${ticket.seat.section}`}</TextView>
                  <TextView>{`Row: ${ticket.seat.row}`}</TextView>
                  <TextView>{`Seat: ${ticket.seat.name}`}</TextView>
                </Box>
              </Box>
            )}
            {ticket.code.includes('|') ? (
              <TextView
                textTransform="uppercase"
                letterSpacing={4}
                color="titleText"
                fontSize={20}
                fontWeight="600"
                paddingBottom="2xl"
              >
                {ticketPager}
              </TextView>
            ) : (
              <TextView
                textTransform="uppercase"
                letterSpacing={4}
                color="titleText"
              >
                {ticketPager}
              </TextView>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default TicketView;
