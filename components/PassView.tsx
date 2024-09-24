import React, { useState } from 'react';
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
import { multiply } from 'lodash';
import moment from 'moment';

import { RedemptionButton } from '../features/ticketing/components';
import { getCheckoutDate, getDateAsString } from '../utils/EventUtils';
import { Theme, palette } from '../ui/theme';
import { Event, Pass } from '../features/common/types';
import { Text, Box } from '../ui';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface TicketCardProps {
  pass: Pass;
  event?: Event;
  isRedeemed: boolean;
  width: number;
  onPressToRedeem: (pass: Pass, event: Event) => void;
}

export const PassView = ({
  pass,
  width,
  event,
  isRedeemed,
  onPressToRedeem,
}: TicketCardProps): JSX.Element => {
  const theme = useTheme<Theme>();
  const margin = theme.spacing.m;
  const qrsize = width - 4 * margin;
  const isHoldToRedeem = event?.isHoldToRedeem &&
    onPressToRedeem;
  const PassDisplay = () => {
    if (!qrsize || !pass.formattedNumber) return null;
    if (isHoldToRedeem) {
      return (
        <Box
          alignItems="center"
          justifyContent="center"
          minWidth={qrsize}
          minHeight={qrsize}
          style={{ backgroundColor: 'transparent' }}
        >
          <RedemptionButton onPress={() => onPressToRedeem(pass, event)} />
        </Box>
      );
    }
    return (
      <>
        {qrsize && pass.formattedNumber && (
          <QRCode size={qrsize} value={pass.formattedNumber} />
        )}
      </>
    );
  };

  const backgroundColor = isHoldToRedeem
    ? 'ticketCardBackground'
    : 'mainBackground';
  const redeemedBackgroundColor = isRedeemed
    ? 'disabledButton'
    : 'mainBackground';
  return (
    <Box
      height="100%"
      backgroundColor="ticketCardBackground"
      borderWidth={4}
      borderColor="ticketCardBackground"
      borderRadius={14}
      padding="m"
    >
      <Box
        height="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box>
          <Box alignItems="center" justifyContent="center">
            <Box
              padding="s"
              borderRadius={16}
              borderColor={redeemedBackgroundColor}
            >
              <Box
                padding="s"
                backgroundColor={backgroundColor}
                borderRadius={8}
              >
                <PassDisplay />
                {event && !event.isRedeemable && event.shareIds.length > 0 && (
                  <Box
                    {...StyleSheet.absoluteFillObject}
                    borderColor="cardBackground"
                    alignItems="center"
                    justifyContent="center"
                    style={{ backgroundColor: '#FFFFFFEE' }}
                  >
                    <Box
                      borderColor="orange"
                      borderWidth={8}
                      borderRadius={8}
                      position="absolute"
                      paddingVertical="s"
                      paddingHorizontal="xs"
                      style={[{ transform: [{ rotate: '-25deg' }] }]}
                    >
                      <Text
                        color="orange"
                        textTransform="uppercase"
                        fontSize={38}
                        lineHeight={38}
                        fontWeight="600"
                      >
                        Shared
                      </Text>
                    </Box>
                  </Box>
                )}
                {event && !event.isRedeemable && event.shareIds.length == 0 && event.redemptionIds.length > 0 && (
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
                      >
                        Redeemed
                      </Text>
                    </Box>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
          <Box
            flex={1}
            flexDirection="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box alignItems="center">
              <Text textAlign="center">{pass.schoolName}</Text>
              <Text
                variant="header2"
                fontSize={16}
                textAlign="center"
                marginTop="xs"
              >
                {pass.name}
              </Text>
              <Text fontSize={16} marginTop="xs">
                Pass #{pass.formattedNumber}
              </Text>
            </Box>
            <Box width="100%">
              {pass.section && pass.row && (
                <>
                  <Text variant="header2" fontSize={16}>
                    {pass.ownerEmail}
                  </Text>
                  <Box flexDirection="row" justifyContent="space-between">
                    <>
                      <Text>{`Section: ${pass.section}`}</Text>
                      <Text>{`Row: ${pass.row}`}</Text>
                      <Text>{`Seat: ${pass.seat}`}</Text>
                    </>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PassView;
