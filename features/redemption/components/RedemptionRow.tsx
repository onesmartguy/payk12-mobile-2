import moment from 'moment';
import * as React from 'react';

import { Box, Text } from '../../../ui';
import { DuplicateIcon, InvalidIcon, ValidIcon } from '../../../assets';
import { Redemption } from '../../common/types';

export const RedemptionRow = ({ redemption }: { redemption: Redemption }) => {
  let title = 'Invalid Ticket / Pass';
  let details =
    redemption && redemption.section && redemption.seat
      ? `Sect: ${redemption.section} Row: ${redemption.row}  Seat: ${redemption.seat}`
      : null;
  let Icon = InvalidIcon;
  let messageColor: any = 'error';
  let message = redemption.message;
  const dte = moment(moment.utc(redemption.redeemedOn || redemption.scannedOn).toDate());
  switch (redemption.status) {
    case 'valid':
      title = redemption.ticketNumber;
      details =
        redemption && redemption.section && redemption.seat
          ? `Sect: ${redemption.section} Row: ${redemption.section}  Seat: ${redemption.section}`
          : null;
      Icon = ValidIcon;
      messageColor = 'infoText';
      message = `Checked in: ${dte.format(
        'MM/DD/YY'
      )} at ${dte.format('h:mm A')}`
      break;
    case 'duplicate':
      title = 'Duplicate Ticket / Pass';
      Icon = DuplicateIcon;
      message = `Checked in: ${dte.format(
        'MM/DD/YY'
      )} at ${dte.format('h:mm A')}`
      break;
      case 'conflict':
        title = 'Conflict / No Supported';
        Icon = InvalidIcon;
        message = `More supported passes coming soon.`
        break;
  

    default:
      Icon = InvalidIcon;
      details = `Scanned on: ${dte.format(
        'MM/DD/YY')} at ${dte.format('h:mm A')}`
      break;
  }
  const redeemedOn = moment(redemption.redeemedOn);
  return (
    <Box
      flex={1}
      alignSelf="stretch"
      borderBottomColor="listDividerColor"
      borderBottomWidth={1}
    >
      <Box flexGrow={1} flexDirection="row">
        <Box flex={1}>
          <Text variant="row">{redemption.ownerName}</Text>
          <Text variant="rowDetails" marginTop="xxs">
            {`Ticket #${redemption.ticketNumber}`}
          </Text>
          {details && (
            <Text variant="rowDetails" marginTop="xxs">
              {details}
            </Text>
          )}
        </Box>
        <Box width={100} alignItems="center" justifyContent="center">
          {Icon && <Icon height={42} width={42} />}
        </Box>
      </Box>
      <Text
        variant="rowDetails"
        fontWeight="600"
        marginTop="xxs"
        color={messageColor}
      >
        {message}
      </Text>
    </Box>
  );
};

export default RedemptionRow;
