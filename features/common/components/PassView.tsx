import React from 'react';
import {
  Dimensions,
  StyleSheet,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { useTheme } from '@shopify/restyle';


import { RedemptionButton } from '../../ticketing/components';
import { EventModel, PassModel } from '../types';
import { Theme } from '@/utils/theme';
import Box from './Box';
import TextView from './TextView';


const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;

interface TicketCardProps {
  pass: PassModel;
  event?: EventModel;
  isRedeemed: boolean;
  width: number;
  onHoldToRedeem: ({events, vouchers, isHoldToRedeem}: {events: number[], vouchers: string[], isHoldToRedeem: boolean}) => void;
}

export const PassView = ({
  pass,
  width,
  event,
  isRedeemed,
  onHoldToRedeem,
}: TicketCardProps): JSX.Element => {
  const theme = useTheme<Theme>();
  const margin = theme.spacing.m;
  const qrsize = width - 4 * margin;
  const isHoldToRedeem = !!onHoldToRedeem && (event!.flags & 0x02);
  const PassDisplay = () => {
    if (!qrsize || !pass.formattedCode) return null;
    if (isHoldToRedeem) {
      return (
        <Box
          alignItems="center"
          justifyContent="center"
          minWidth={qrsize}
          minHeight={qrsize}
          style={{ backgroundColor: 'transparent' }}
        >
          <RedemptionButton onPress={() => onHoldToRedeem({events: [event!.id], vouchers: [pass.formattedCode], isHoldToRedeem: true})} />
        </Box>
      );
    }
    return (
      <>
        {qrsize && pass.formattedCode && (
          <QRCode size={qrsize} value={pass.formattedCode} />
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
                {event && !pass.isRedeemable && (
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
                      <TextView
                        color="orange"
                        textTransform="uppercase"
                        fontSize={38}
                        lineHeight={38}
                        fontWeight="600"
                      >
                        Shared
                      </TextView>
                    </Box>
                  </Box>
                )}
                {isRedeemed && (
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
                      >
                        Redeemed
                      </TextView>
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
              <TextView textAlign="center">{pass.schoolId}</TextView>
              <TextView
                variant="header2"
                fontSize={16}
                textAlign="center"
                marginTop="xs"
              >
                {pass.name}
              </TextView>
              <TextView fontSize={16} marginTop="xs">
                Pass #{pass.formattedCode}
              </TextView>
            </Box>
            <Box width="100%">
              {pass.seat?.name && (
                <>
                  <TextView variant="header2" fontSize={16}>
                    {pass.ownerEmail}
                  </TextView>
                  <Box flexDirection="row" justifyContent="space-between">
                    <>
                      <TextView>{`Section: ${pass.seat.section}`}</TextView>
                      <TextView>{`Row: ${pass.seat.row}`}</TextView>
                      <TextView>{`Seat: ${pass.seat.name}`}</TextView>
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
