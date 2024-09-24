import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { School, Ticket, Event } from '../common/types';
import { IDP_BASE_URL } from '../common/constants';

interface AuthorizeRequest {
  username: string;
  password: string;
}

interface AuthorizeResponse {
  username: string;
  password: string;
}
// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: IDP_BASE_URL }),
  endpoints: builder => ({
    authorize: builder.mutation<School[], AuthorizeRequest>({
      query: (payload: AuthorizeRequest) => ({
        url: `account/token`,
        method: 'PATCH',
        body: payload,
      }),
    }),
  }),
});

export const { useAuthorizeMutation } = authApi;
