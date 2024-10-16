

import { useMutation, useQuery } from '@tanstack/react-query';
import {useCallback, useEffect, useState} from 'react';
import { some, uniq } from 'lodash';
import { fetchUserPasses } from '@/api/ticketing';
import useSessionStore from '@/auth/stores/useSessionStore';
import { useRefreshByUser } from '@/common/hooks/useRefreshByUser';
import { useRefreshOnFocus } from '@/common/hooks/useRefreshOnFocus';
import useUserVouchersStore from '../stores/useUserVouchersStore';
import useEventStore from '@/common/stores/useEventStore';
import useSchoolStore from '@/common/stores/useSchoolStore';
import useSchools from '@/common/hooks/useSchools';
import useEvents from '@/common/hooks/useEvents';
import { useRouter } from 'expo-router';
import { redeemVoucher } from '@/api/redemption';
import { PassModel } from '@/common/types';



const usePasses = () => {
  const userId = useSessionStore(x => x.user?.id);

  const passes = useUserVouchersStore((state) => state.passes);
  const upsertPasses = useUserVouchersStore((state) => state.upsertPasses);
  const resetFilter = useUserVouchersStore((state) => state.resetFilter);
  const getEventById = useEventStore(x => x.getEventById);
  const getSchoolById = useSchoolStore(x => x.getSchoolById);
  const [selectedPass, setSelectedPass] = useState<PassModel>()

  const missingSchoolIds = uniq(passes.filter(t => !!t.schoolId && !getSchoolById(t.eventId)).map(t => t.schoolId))
  const missingEventIds = passes.reduce((acc, t) => 
    {
      t.allowedEventIds?.filter(eventId => !getEventById(eventId)).forEach(eventId => acc.push(eventId))
      return [...uniq(acc)]
    }
  , [] as number[])

  const {schools, isFetching: isFetchingSchools} = useSchools({ids: missingSchoolIds})
  const {events, isFetching: isFetchingEvents} = useEvents({ids: missingEventIds})

  const logout = useSessionStore(x => x.logout);

  const { isLoading, isFetching, error, data, refetch } = useQuery({
    queryKey: ['user-passes', userId],
    queryFn: async () => await fetchUserPasses({userId: userId!})
        .then(x => {
          if(x.status == 401){
            logout()
          }
          upsertPasses(x.data.items)
          return x.data.items
        })
        .catch(e => {
          console.error(e)
          // logout()
          return null
        })
  });
  const { mutateAsync } = useMutation({
    mutationKey: ['redeem-user-passes', userId],
    mutationFn: redeemVoucher
  });
  const isComplete = isFetching || isFetchingSchools || isFetchingEvents && !some([schools, events], x => x === undefined)
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);


  return {passes, redeemVouchersAsync: mutateAsync,  schools, events, isLoading, error, isFetching: isComplete , resetFilter, isRefetchingByUser, refetchByUser, selectedPass, setSelectedPass} 
}

export default usePasses