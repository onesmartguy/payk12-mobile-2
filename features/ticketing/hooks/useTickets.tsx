

import { useMutation, useQuery } from '@tanstack/react-query';
import { first, orderBy, some, uniq } from 'lodash';
import { useEffect, useState } from 'react';
import { useRefreshByUser } from '../../common/hooks/useRefreshByUser';
import { useRefreshOnFocus } from '../../common/hooks/useRefreshOnFocus';
import { EventModel, SchoolModel, TicketModel } from '@/common/types';
import { fetchUserTickets } from '@/api/ticketing';
import useSessionStore from '@/auth/stores/useSessionStore';
import useEvents from '../../common/hooks/useEvents';
import useEventStore from '@/common/stores/useEventStore';
import useUserVouchersStore from '../stores/useUserVouchersStore';
import useSchoolStore from '@/common/stores/useSchoolStore';
import useSchools from '@/common/hooks/useSchools';
import { useRouter } from 'expo-router';
import useUiStore from '@/common/stores/useUiStore';
import { redeemVoucher } from '@/api/redemption';


  


const useTickets = () => {
  const userId = useSessionStore(x => x.user?.id);

  const tickets = useUserVouchersStore((state) => state.tickets);
  const upsertTickets = useUserVouchersStore((state) => state.upsertTickets);
  const resetFilter = useUserVouchersStore((state) => state.resetFilter);
  const selectedEvent = useUserVouchersStore((state) => state.selectedEvent);
  const getEventById = useEventStore(x => x.getEventById);
  const getSchoolById = useSchoolStore(x => x.getSchoolById);

  const missingSchoolIds = tickets.filter(t => t.schoolId && !getSchoolById(t.schoolId!)).map(t => t.schoolId!)
  const missingEventIds = tickets.filter(t => t.eventId && !getEventById(t.eventId)).map(t => t.eventId!)

  const {schools, isFetching: isFetchingSchools} = useSchools({ids: missingSchoolIds})
  const {events, isFetching: isFetchingEvents} = useEvents({ids: missingEventIds})


  const logout = useSessionStore(x => x.logout);
  const router = useRouter();

  const { isLoading, isFetching, error, data, refetch } = useQuery({
    queryKey: ['user-tickets', userId],
    queryFn: async () => await fetchUserTickets({userId: userId!})
        .then(x => {
          if(x.status == 401){
            logout()
          }
          upsertTickets(x.data.items)
          return x.data.items
        })
        .catch(e => {
          logout()
          return null
        })
  });
  const { mutateAsync } = useMutation({
    mutationKey: ['redeem-user-tickets', userId],
    mutationFn: redeemVoucher
  });
  const isComplete = isFetching || isFetchingSchools || isFetchingEvents && !some([schools, events], x => x === undefined)



  return {tickets, redeemVouchersAsync: mutateAsync,  schools, events, isLoading, error, isFetching: isComplete , resetFilter} 
}

export default useTickets