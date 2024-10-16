import { EventModel, TicketModel } from "@/common/types";
import useTicketCheckIn, { CheckInTicket } from "../hooks/useTicketCheckIn";
import { format, isValid, parseISO } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity } from "react-native";
import Box from "@/common/components/Box";
import TextView from "@/common/components/TextView";
import LoadingBlock from "@/common/components/LoadingBlock";
import Button from "@/common/components/Button";
import { CheckInErrorLogSheet } from "../sheets";
import useSessionStore from "@/auth/stores/useSessionStore";
import SearchBox from "@/common/components/SearchBox";
import { useRouter } from "expo-router";
import { useRedemptionHub } from "../hooks/useRedemptionHub";



const TicketRow = 
  ({
    ticket,
    showLoader = false,
    onPress,
  }: {
    ticket: TicketModel;
    showLoader?: boolean;
    onPress?: (t: CheckInTicket) => any;
  }) => {
    const dte = parseISO(ticket.redeemedOn?.getUTCDate().toString()!);
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
      ticket.formattedCode || ticket.code || ticket.passNumber;
    return (
      <TouchableOpacity>
        <Box
          paddingVertical="m"
          borderBottomColor="listDividerColor"
          borderBottomWidth={1}
        >
          <Box flex={1} flexDirection="row">
            <Box flex={3}>
              <TextView variant="rowBlack">{ticket.ownerName}</TextView>
              {ticket.type === 'P' && (
                <TextView variant="rowDetailsBlue" marginTop="xs">
                  {`Pass #${ticketNumber}`}
                </TextView>
              )}
              {ticket.type !== 'P' && (
                <TextView variant="rowDetailsBlue" marginTop="xs">
                  {`Ticket #${ticketNumber}`}
                </TextView>
              )}
              <TextView variant="rowDetails" marginTop="xs">
                {details}
              </TextView>
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
                  disabled={isValid(dte)}
                  onPress={() => handleOnPress()}
                />
              )}
            </Box>
          </Box>
          {isValid(dte) && (
            <TextView variant="rowDetails" fontWeight="600" marginTop="xs">
              {`Checked in: ${format(dte,'MM/dd/yy')} at ${format(dte, 'h:mm A')}`}
            </TextView>
          )}
        </Box>
      </TouchableOpacity>
    );
  };
export const AdminEventTicketListScreen: React.FC<{events: EventModel[]}> = ({events
}) => {
 
  const router = useRouter();
  const [eventTime, setEventTime] = useState('');
  const [filter, setFilter] = useState('');
  const {
    redeemTicket,
    tickets,
    clearErrors,
    errors,
    refetch,
    isFetching,
  } = useTicketCheckIn(events);
  const currentEvent = events[0]
  const userId = useSessionStore(x => x.user!.id)
  const { receiveMessageEvent, ticketRedeemedEvent } = useRedemptionHub({userId: userId, eventId: events.map(x=>x.id)}, [userId])
  const bottomSheetRef = useRef<CheckInErrorLogSheet>(null);
  useEffect(() => {
    if (currentEvent) {
      const et = format(currentEvent.startTime, 'MM/dd/yy - dddd - h:mm A');
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
  const filteredTickets = tickets.filter(x =>
      x.name?.toLowerCase().includes(searchText) ||
      x.ownerEmail.toLowerCase().includes(searchText) ||
      x.ownerName.toLowerCase().includes(searchText) ||
      x.code.toLowerCase().includes(searchText) ||
      (x.formattedCode || '').toLowerCase().includes(searchText) ||
      `${x.section}:${x.row}:${x.seat}`.toLowerCase().includes(searchText)
  );



  const SearchHeader = () =>
  searchText ? (
    <Box backgroundColor='blueGrayBackground'>
      <TextView textAlign='center' paddingVertical='xs'>{filteredTickets.length} ticket(s) found</TextView>
    </Box>
  ) : null;

  const renderContent = () => {

    if (isFetching)
      return (
        <Box flex={1} justifyContent="center" alignItems="center">
          <ActivityIndicator />
          <TextView variant="loading">Loading</TextView>
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
    
      <Box paddingHorizontal="lg" flex={1}>
        <Box>
          <Box alignItems="center" justifyContent="center">
            <TextView
              variant="header"
              marginBottom="m"
              fontSize={18}
              style={{ textAlign: 'center' }}
            >
              {currentEvent.name}
            </TextView>
            <TextView>{eventTime}</TextView>
          </Box>

          <Button
            variant="primary"
            borderRadius={14}
            label="Switch To Scanning Mode"
            onPress={() => router.back()}
          />
          <SearchBox
            onChange={(value) => setFilter(value)}
            value={filter}
            placeholder="Filter or Search List"
          />
        </Box>
        <Box flexGrow={1}>{renderContent()}</Box>
              {/* {errors && (
        <CheckInErrorLogBottomSheet
          ref={bottomSheetModalRef}
          errors={errors}
          onClose={() => clearErrors()}
        />
      )} */}
      </Box>

  );
};

export default AdminEventTicketListScreen;
