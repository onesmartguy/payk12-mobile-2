
import axios from '@/api/axios'
import { EventModel, PagedRequest, PagedResponse, PassModel, SchoolModel, TicketModel } from '@/features/common/types';


const routes = {
   GET_USER_PASSES_ROUTE: '/users/:id/passes',
   GET_USER_TICKETS_ROUTE: '/users/:id/tickets',
   TRANSFER_TICKETS_ROUTE: '/ticketing/transfer',

   SHARE_TICKETS_ROUTE: '/users/:id/tickets/:ticketId/transfer',
}

type Params = {userId: number} & PagedRequest;

export const fetchUserPasses = async (options: Params) => {
  
    return await axios.get<PagedResponse<PassModel>>(routes.GET_USER_PASSES_ROUTE.replace(':id', options.userId.toString()));
};

export const fetchUserTickets = async (options: Params) => {
  

    return await axios.get<PagedResponse<TicketModel>>(routes.GET_USER_TICKETS_ROUTE.replace(':id', options.userId.toString()));
};
export const transferTickets = async (req: TransferTicketsRequest) => {
  
    return await axios.post<ShareResult>(routes.TRANSFER_TICKETS_ROUTE, req);
};
export type ShareResult = {
    email: string;
    isSuccess: boolean;
    tickets: number[];
    errorMessage: string;
  }
export type TransferTicketsRequest = {
    email: string;
    events?: number[];
    passId?: number;
    tickets?: number[];
    transferPass?: boolean;
  }
