// Need to use the React-specific entry point to import createApi
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

import {RootState} from '../../store';
import {API_BASE_URL} from '../common/constants';
import {School, Ticket, Event, ListResponse} from '../common/types';

// Define a service using a base URL and expected endpoints
export const ticketingEventApi = createApi({
  reducerPath: 'ticketingEventApi',
  tagTypes: ['event'],
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, {getState}) => {
      // By default, if we have a token in the store, let's use that for authenticated requests
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    getEvents: builder.query<ListResponse<Event>, string>({
      query: () => `/ticketing/events`,
      providesTags: (result, error, id) => [{type: 'event'}],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {useGetEventsQuery} = ticketingEventApi;
