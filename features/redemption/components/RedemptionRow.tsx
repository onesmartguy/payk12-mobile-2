
import * as React from 'react';

import { DuplicateIcon, InvalidIcon, ValidIcon } from '../../../assets';
import { format, formatISO } from 'date-fns';
import { RedemptionModel } from '@/common/types';
import Box from '@/common/components/Box';
import TextView from '@/common/components/TextView';

export const RedemptionRow = ({ redemption }: { redemption: RedemptionModel }) => {
  let title = 'Invalid Ticket / Pass';
  let details =
    redemption && redemption.section && redemption.seat
      ? `Sect: ${redemption.section} Row: ${redemption.row}  Seat: ${redemption.seat}`
      : null;
  let Icon = InvalidIcon;
  let messageColor: any = 'error';
  let message = redemption.message;
  const dte = redemption.redeemedOn || redemption.scannedOn;
  switch (redemption.status) {
    case 'valid':
      title = redemption.ticketNumber;
      details =
        redemption && redemption.section && redemption.seat
          ? `Sect: ${redemption.section} Row: ${redemption.section}  Seat: ${redemption.section}`
          : null;
      Icon = ValidIcon;
      messageColor = 'infoText';
      message = `Checked in: ${format(dte,'MM/dd/yy')} at ${format(dte, 'h:mm A')}`
      break;
    case 'duplicate':
      title = 'Duplicate Ticket / Pass';
      Icon = DuplicateIcon;
      message = `Checked in: ${format(dte, 'MM/dd/yy')} at ${format(dte, 'h:mm A')}`
      break;
      case 'conflict':
        title = 'Conflict / No Supported';
        Icon = InvalidIcon;
        message = `More supported passes coming soon.`
        break;
  

    default:
      Icon = InvalidIcon;
      details = `Scanned on: ${format(dte, 'MM/dd/yy')} at ${format(dte, 'h:mm A')}`
      break;
  }
  
  return (
    <Box
      flex={1}
      alignSelf="stretch"
      borderBottomColor="listDividerColor"
      borderBottomWidth={1}
    >
      <Box flexGrow={1} flexDirection="row">
        <Box flex={1}>
          <TextView variant="row">{redemption.ownerName}</TextView>
          <TextView variant="rowDetails" marginTop="xxs">
            {`Ticket #${redemption.ticketNumber}`}
          </TextView>
          {details && (
            <TextView variant="rowDetails" marginTop="xxs">
              {details}
            </TextView>
          )}
        </Box>
        <Box width={100} alignItems="center" justifyContent="center">
          {Icon && <Icon height={42} width={42} />}
        </Box>
      </Box>
      <TextView
        variant="rowDetails"
        fontWeight="600"
        marginTop="xxs"
        color={messageColor}
      >
        {message}
      </TextView>
    </Box>
  );
};

export default RedemptionRow;
