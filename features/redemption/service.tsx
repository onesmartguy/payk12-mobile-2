// // Need to use the React-specific entry point to import createApi
// import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
// import moment from 'moment';
// import qs from 'query-string';
// import {useQuery} from '@tanstack/react-query';

// import {RootState} from '../../store';
// import {API_BASE_URL} from '../common/constants';
// import type {
//   School,
//   Ticket,
//   Event,
//   ListResponse,
//   NamePageSearch,
//   Redemption,
// } from '../common/types';
// import {http} from '../../services/http';
// import { map } from 'lodash';

// interface GetEventsRequest {
//   schoolId: string;
//   eventId: string;
//   since?: string;
// }
// // Define a service using a base URL and expected endpoints
// // baseUrl: `${API_BASE_URL}/redemption`,

// export const redemptionApi = createApi({
//   reducerPath: 'redemptionApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_BASE_URL}api/redemption`,
//     prepareHeaders: (headers, {getState}) => {
//       // By default, if we have a token in the store, let's use that for authenticated requests
//       const token = (getState() as RootState).auth.token;
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: builder => ({
//     getSchoolsAsAdmin: builder.query<School[], NamePageSearch>({
//       query: (filter: NamePageSearch) => {
//         const q = filter ? `?${qs.stringify(filter)}` : ``;
//         return `/schools${q}`;
//       },
//     }),
//     getEventsAsAdmin: builder.query<ListResponse<Event>, NamePageSearch>({
//       query: ({...filter}: NamePageSearch) => {
//         const q = filter ? `?${qs.stringify(filter)}` : ``;
//         const path = `/events${q}`;
//         return path;
//       },
//     }),
//     redeemTicketAsAdmin: builder.mutation<
//       Redemption[],
//       {events: number[]; tickets: string | string[]}
//     >({
//       query: ({events, tickets}) => {
//         const body = { events, tickets }
//         console.log('body', body)
//         return {
//           url: `/redeem`,
//           method: 'POST',
//           body,
//         };
//       },
//     }),
//     getTicketsForEvent: builder.query<Ticket[], {events: Event[]}>({
      
//       query: ({events}) =>
//       {
//         const filter = { events }
//         const q = filter ? `?${qs.stringify(filter)}` : ``;
//         return {
//           url: `/tickets${q}`
//         }
//       }
//         ,
//     }),
//   }),
// });

// // Export hooks for usage in functional components, which are
// // auto-generated based on the defined endpoints
// export const {
//   useGetEventsAsAdminQuery,
//   useLazyGetEventsAsAdminQuery,
//   useGetSchoolsAsAdminQuery,
//   useLazyGetSchoolsAsAdminQuery,
//   useGetTicketsForEventQuery,
//   useLazyGetTicketsForEventQuery,
//   useRedeemTicketAsAdminMutation,
// } = redemptionApi;

// export const getTicketsForEvent = async (eventsId: number[]) => {
//   const filter = { events: eventsId }
//   const q = filter ? `?${qs.stringify(filter)}` : ``;
//   return await http.get<Ticket[]>(
//     `api/redemption/tickets${q}`,
//   );
// };
// export const useGetTicketsForEvent = (events: Event[] = []) => {
//   const eventIds = map(events, x => x.id);
//   const query = useQuery(
//     ['GetTicketsForEvent', {events: eventIds}],
//     () => getTicketsForEvent(eventIds),
//     {
//       refetchInterval: 60000,
//       refetchOnWindowFocus: false,
//       refetchOnMount: false,
//     },
//   );
//   return query;
// };
