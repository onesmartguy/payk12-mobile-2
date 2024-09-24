import React, {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { FlatList } from 'react-native-gesture-handler';

import { Button, Text, Box, SearchBox, LoadingBlock } from '../../../ui';
import { MainLayout } from '../../../components';
import { Event, Ticket } from '../../common/types';
import { useAppContext } from '../../auth/authSlice';
import { CheckInErrorLogSheet } from '../sheets';
import { CheckInTicket, useTicketCheckIn } from '../hooks/useTicketCheckIn';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { StackParamList } from '@app/navigation';
import { useCurrentUser } from '@app/features/auth/authSlice';
import { useRedemptionHub } from '@app/hooks/useRedemptionHub';
import { useQueryClient } from '@tanstack/react-query';

type Props = DrawerScreenProps<StackParamList, 'EventTicketList'>;
const TicketRow = 
  ({
    ticket,
    showLoader = false,
    onPress,
  }: {
    ticket: Ticket;
    showLoader?: boolean;
    onPress?: (t: CheckInTicket) => any;
  }) => {
    const dte = moment(moment.utc(ticket.redeemedOn).toDate());
    const details =
      ticket.section && ticket.seat
        ? `Sect: ${ticket.section} Row: ${ticket.row}  Seat: ${ticket.seat}`
        : `${ticket.productName}`;
    const buttonText = ticket.redeemedOn ? 'Checked In' : 'Check In';
    const [loading, setLoading] = useState(false);
    const handleOnPress = async () => {
      if (onPress && showLoader) {
        setLoading(true);
        try {
          await onPress(ticket);
        } finally {
          setLoading(false);
        }
      }
    };
    const ticketNumber =
      ticket.formattedNumber || ticket.ticketNumber || ticket.passNumber;
    return (
      <TouchableOpacity>
        <Box
          paddingVertical="m"
          borderBottomColor="listDividerColor"
          borderBottomWidth={1}
        >
          <Box flex={1} flexDirection="row">
            <Box flex={3}>
              <Text variant="rowBlack">{ticket.ownerName}</Text>
              {ticket.type === 'P' && (
                <Text variant="rowDetailsBlue" marginTop="xs">
                  {`Pass #${ticketNumber}`}
                </Text>
              )}
              {ticket.type !== 'P' && (
                <Text variant="rowDetailsBlue" marginTop="xs">
                  {`Ticket #${ticketNumber}`}
                </Text>
              )}
              <Text variant="rowDetails" marginTop="xs">
                {details}
              </Text>
            </Box>
            <Box flex={2}>
              {loading && <LoadingBlock />}
              {!loading && (
                <Button
                  variant="success"
                  label={buttonText}
                  borderRadius={8}
                  paddingHorizontal="xxs"
                  fontSize={12}
                  disabled={dte.isValid()}
                  onPress={() => handleOnPress()}
                />
              )}
            </Box>
          </Box>
          {dte.isValid() && (
            <Text variant="rowDetails" fontWeight="600" marginTop="xs">
              {`Checked in: ${dte.format(
                'MM/DD/YY'
              )} at ${dte.format('h:mm A')}`}
            </Text>
          )}
        </Box>
      </TouchableOpacity>
    );
  };
export const AdminEventTicketListScreen: React.FC<Props> = ({
  route,
  navigation,
}) => {
  const events = route.params?.events ?? []
  
  const [eventTime, setEventTime] = useState('');
  const [filter, setFilter] = useState('');
  const {
    isUpdating,
    redeemTicket,
    tickets,
    clearErrors,
    errors,
    refetch,
    isLoading,
    isFetching,
  } = useTicketCheckIn(events);
  const currentEvent = events[0]
  const { id } = useCurrentUser()
  const queryClient = useQueryClient()
  const { receiveMessageEvent, ticketRedeemedEvent } = useRedemptionHub({userId: id, eventId: events.map(x=>x.id)}, [id])
  const bottomSheetRef = useRef<CheckInErrorLogSheet>(null);
  useEffect(() => {
    if (currentEvent) {
      const et = moment(currentEvent.startTime).format(
        'MM/DD/YY - dddd - h:mm A'
      );
      setEventTime(et);
    } else {
    }
  }, [currentEvent]);
  useEffect(() => {
    if (errors.length > 0) {
      bottomSheetRef.current?.show();
    }
  }, [errors]);

  const searchText = filter.toLowerCase();
  const filteredTickets = tickets.filter(
    (x) =>
      x.name?.toLowerCase().includes(searchText) ||
      x.ownerEmail.toLowerCase().includes(searchText) ||
      x.ownerName.toLowerCase().includes(searchText) ||
      x.ticketNumber.toLowerCase().includes(searchText) ||
      (x.formattedNumber || '').toLowerCase().includes(searchText) ||
      `${x.section}:${x.row}:${x.seat}`.toLowerCase().includes(searchText)
  );



  const SearchHeader = () =>
  searchText ? (
    <Box backgroundColor='blueGrayBackground'>
      <Text textAlign='center' paddingVertical='xs'>{filteredTickets.length} ticket(s) found</Text>
    </Box>
  ) : null;

  const renderContent = () => {

    if (isLoading)
      return (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator />
          <Text variant="loading">Loading</Text>
        </Box>
      );

    return (
      <Box flex={1}>
        <Box flexGrow={1}>
          <FlatList style={{flex: 1}}
            data={filteredTickets}
            keyExtractor={(item, index) => `${item.publicId}_${index}`}
            ListHeaderComponent={SearchHeader}
            renderItem={({ item }) => (
              <TicketRow
                ticket={item}
                showLoader
                onPress={async () => {
                  await redeemTicket(item)
                }}
              />
            )}
          />
        </Box>
      </Box>
    );
  };

  return (
    <MainLayout
      showHeader
      headerOptions={{
        onBackPress: () => navigation.goBack(),
      }}
    >
      <Box paddingHorizontal="lg" flex={1}>
        <Box>
          <Box alignItems="center" justifyContent="center">
            <Text
              variant="header"
              marginBottom="m"
              fontSize={18}
              style={{ textAlign: 'center' }}
            >
              {currentEvent.name}
            </Text>
            <Text>{eventTime}</Text>
          </Box>

          <Button
            variant="primary"
            borderRadius={14}
            label="Switch To Scanning Mode"
            onPress={() => navigation.goBack()}
          />
          <SearchBox
            onChange={(value) => setFilter(value)}
            value={filter}
            placeholder="Filter or Search List"
          />
        </Box>
        <Box flexGrow={1}>{renderContent()}</Box>
      </Box>
      {/* {errors && (
        <CheckInErrorLogBottomSheet
          ref={bottomSheetModalRef}
          errors={errors}
          onClose={() => clearErrors()}
        />
      )} */}
    </MainLayout>
  );
};

export default AdminEventTicketListScreen;
