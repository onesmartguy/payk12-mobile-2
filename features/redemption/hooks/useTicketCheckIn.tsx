import { useDispatch, useSelector, useStore } from 'react-redux';
import { useState, useEffect } from 'react';
import { isArray, uniqueId, map, orderBy, some } from 'lodash';
import moment from 'moment';
import { useQueryClient } from '@tanstack/react-query';

import {
  useRedeemTicketAsAdminMutation,
  useGetTicketsForEvent,
} from '../service';
import { addTicketRedemption } from '../redemptionSlice';
import { Event, Redemption, ListResponse, Ticket } from '../../common/types';

export interface CheckInTicket extends Ticket {
  isCheckingIn?: boolean;
}

export const useTicketCheckIn = (events: Event[]) => {
  const dispatch = useDispatch();

  const [redeemTicketAsync, { isLoading: isUpdating }] =
    useRedeemTicketAsAdminMutation();
  const [errors, setErrors] = useState([] as Redemption[]);
  const [tickets, setTickets] = useState<CheckInTicket[]>([]);
  const { data, isLoading, isFetching, isStale, isSuccess, refetch } =
    useGetTicketsForEvent(events);
  const qClient = useQueryClient();
  const updateTicketsFromData = () => {
    if (data?.data) {
      const filtered = data.data.filter(x => some(events, e => e.id === x.eventId));
      setTickets(s =>
        orderBy(filtered, ['redeemedOn', 'ownerName'], ['desc', 'asc']),
      );
    }
  };
  useEffect(() => {
    updateTicketsFromData();
  }, [data, events]);
  useEffect(() => {
    refetch();
  }, [events]);
  const updateRedemptionStatus = (
    ticket: CheckInTicket,
    isUpdating: boolean,
  ) => {
    setTickets(s => {
      const i = s.findIndex(x => x.id === ticket.id);
      if (i > -1) {
        s[i].isCheckingIn = isUpdating ? true : undefined;
      }
      return s;
    });
  };
  const redeemTicket = async (ticket: CheckInTicket) => {
    if (!events) return;

    updateRedemptionStatus(ticket, true);
    const payload = {
      events: map(events, x => x.id),
      tickets: [ticket.ticketNumber],
    };
    const dte = moment();
    let scanResult = [] as Redemption[];
    try {
      const { data }: { data: Redemption[] } = (await redeemTicketAsync(
        payload,
      )) as any;
      scanResult = data;
      if (data.filter(x => !x.isValid)) {
        setErrors(e => [...e, ...data]);
      }
      setTickets(ts => {
        scanResult.forEach(r => {
          const i = ts.findIndex(x => x.id.toString() == r.id);
          if(r.isValid){
            ts[i] = {...ts[i], redeemedOn: r.redeemedOn || r.scannedOn, isRedeemed: true, isRedeemable: false};
          }
        });
        return [...ts];
      });
      dispatch(addTicketRedemption(scanResult));
    } catch (_) {}

    updateRedemptionStatus(ticket, false);
    return scanResult;
  };
  const clearErrors = () => {
    setErrors([]);
  };
  return {
    redeemTicket,
    isUpdating,
    isLoading,
    isFetching,
    tickets,
    errors,
    clearErrors,
    refetch,
  };
};

export default useTicketCheckIn;
