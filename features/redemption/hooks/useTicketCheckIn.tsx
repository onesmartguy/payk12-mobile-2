import { EventModel, RedemptionModel, TicketModel } from "@/common/types";
import { map, orderBy, some } from "lodash";
import { useEffect, useState } from "react";
import useRedemptionStore from "../stores/redemptionStore";
import useRedeemVoucher from "./useRedeemVoucher";
import useEventTickets from "./useEventTickets";


export interface CheckInTicket extends TicketModel {
  isCheckingIn?: boolean;
}

export const useTicketCheckIn = (events: EventModel[]) => {
  const { } = useRedemptionStore();
  const { mutateAsync: redeemAsync, isPending} =  useRedeemVoucher();
  const [errors, setErrors] = useState([] as RedemptionModel[]);
  const [checkInTickets, setCheckInTickets] = useState<CheckInTicket[]>([]);
  const [pendingTickets, setPendingTickets] = useState<string[]>([]);
  const { tickets, isFetchingNextPage, isFetching, hasNextPage, refetch } = useEventTickets(events);
  const updateTicketsFromData = () => {
    if (tickets) {
      setCheckInTickets(s =>
        orderBy(tickets, ['redeemedOn', 'ownerName'], ['desc', 'asc']),
      );
    }
  };
  useEffect(() => {
    updateTicketsFromData();
  }, [events, pendingTickets]);

  const redeemVoucher = async (ticket: CheckInTicket) => {
    if (!events) return;

    setPendingTickets(p => [...p, ticket.code]);

    const payload = {
      events: map(events, x => x.id),
      vouchers: [ticket.code],
      isHoldToRedeem: false,
    };
    const dte = new Date();
    let scanResult: RedemptionModel[] = [];
    try {
      const {data} = await redeemAsync(payload);
      scanResult = data;
      if (data.filter(x => !x.isValid)) {
        setErrors(e => [...e, ...data]);
      }
      setCheckInTickets(ts => {
        scanResult.forEach(r => {
          const i = ts.findIndex(x => x.id.toString() == r.id);
          if(r.isValid){
            ts[i] = {...ts[i], redeemedOn: r.redeemedOn || r.scannedOn, isRedeemed: true, isRedeemable: false};
          }
        });
        return [...ts];
      });
    } catch (_) {}

    updateTicketsFromData();
    return scanResult;
  };
  const clearErrors = () => {
    setErrors([]);
  };
  return {
    redeemTicket: redeemVoucher,
    isFetching,
    tickets,
    errors,
    clearErrors,
    refetch,
  };
};

export default useTicketCheckIn;
