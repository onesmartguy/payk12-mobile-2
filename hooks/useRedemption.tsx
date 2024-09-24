
import http from '@app/services/http';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export type RedemptionResult = {
  id: number[];
  publicId: string[];
  ticketNumber: string;
  isValid: string;
  status: string;
  statusType: string;
  ownerName: string;
  section: string;
  row: string;
  seat: string;
  eventId?: number;
  eventIds: number[];
  redeemedBy?: string;
  redeemedOn?: Date;
  scannedOn: Date;
}
type RedemptionRequest = {
  events: number[];
  tickets: string[];
}
const redeemAsync = async (options: RedemptionRequest) => {
  var passes = await http.post<RedemptionResult>(`api/redemptions/redeem`, options);
  return passes.data;
};

export const useRedemption = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation(redeemAsync, {
    onSuccess: data => {
      const tickets = queryClient.getQueryData(['mytickets'])

      queryClient.invalidateQueries(['mytickets'])
    }
  })

  return mutation
}

export default useRedemption