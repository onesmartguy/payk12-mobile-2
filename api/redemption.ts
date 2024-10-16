
import axios from '@/api/axios'
import { EventModel, PagedRequest, PagedResponse, PassModel, RedemptionModel, SchoolModel, TicketModel } from '@/features/common/types';


const routes = {
   GET_SCHOOLS_ROUTE: '/evt/schools',
   GET_EVENTS_ROUTE: '/evt/events',
   GET_TICKETS_ROUTE: '/tickets',
   GET_PASSES_ROUTE: '/passes',
   REDEMPTION_ROUTE: '/redemption/redeem',
}


export const fetchSchools = async (options: {ids?: number[], tenantId?: number} & PagedRequest) => {
    const params = new URLSearchParams();

    if (options.ids && options.ids.length > 0) {
        options.ids.forEach(id => params.append('ids', id.toString()));
    }

    if (options.tenantId) params.append('tenantId', options.tenantId.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();   
    return await axios.get<PagedResponse<SchoolModel>>(routes.GET_SCHOOLS_ROUTE + (queryString ? `?${queryString}` : ''));
};

export const fetchEvents = async (options: {ids?: number[], tenantId?: number, schoolId?: number, passId?: number} & PagedRequest) => {
    const params = new URLSearchParams();

    if (options.ids && options.ids.length > 0) {
        options.ids.forEach(id => params.append('ids', id.toString()));
    }
    if (options.tenantId) params.append('tenantId', options.tenantId.toString());
    if (options.schoolId) params.append('schoolId', options.schoolId.toString());
    if (options.passId) params.append('passId', options.passId.toString());
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());

    const queryString = params.toString();  
    return await axios.get<PagedResponse<EventModel>>(routes.GET_EVENTS_ROUTE + (queryString ? `?${queryString}` : ''));
};
export const fetchTickets = async (options: {eventIds?: number[]} & PagedRequest) => {
  
    const queryString = new URLSearchParams(options as any).toString();  

    return await axios.get<PagedResponse<TicketModel>>(routes.GET_TICKETS_ROUTE + (queryString ? `?${queryString}` : ''));
};
export const fetchPasses = async (options: {eventIds?: number[]} & PagedRequest) => {
  
    const queryString = new URLSearchParams(options as any).toString();  

    return await axios.get<PagedResponse<PassModel>>(routes.GET_PASSES_ROUTE + (queryString ? `?${queryString}` : ''));
};
export const redeemVoucher = async ({events, vouchers, isHoldToRedeem = false}: {events: number[], vouchers: string[], isHoldToRedeem?: boolean}) => {
  
    return await axios.post<RedemptionModel[]>(routes.REDEMPTION_ROUTE, {events, vouchers, isHoldToRedeem: isHoldToRedeem ?? false});
};