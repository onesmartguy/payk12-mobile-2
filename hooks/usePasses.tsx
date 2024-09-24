
import { Event, Pass, School } from '@app/features/common/types';
import http from '@app/services/http';
import { useQuery } from '@tanstack/react-query';
import { useRefreshByUser } from './useRefreshByUser';
import { useRefreshOnFocus } from './useRefreshOnFocus';
import {useEffect, useState} from 'react';
import { orderBy, uniqBy, map, sum, first, sumBy } from 'lodash';

const fetchMyPasses = async () => {
  var response = await http.get<Pass[]>(`api/ticketing/my-passes`);
  return response.data;
};

const usePasses = () => {
  const { isLoading, isFetching, error, data: passes, refetch } = useQuery<Pass[], Error>(
    ['mypasses'],
    fetchMyPasses
  );
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const [schools, setSchools] = useState<School[]>([]);
  useEffect(() => {
    let allSchools = [] as School[];
    passes?.forEach((pass) => {
      let school = allSchools.find(x => x.id == pass.schoolId)
      const events = pass.events || []
      if(!school){
        school = {id: pass.schoolId, name: pass.schoolName, events: events } as School
        allSchools.push(school)
      }
      school.events = uniqBy([...events, ...school.events], x => x.id)
      school.upcomingEvent = first(orderBy(school.events, x => x.startTime))
      school.availibleEvents = school.events.length
      school.availibleTickets = sumBy(school.events, e => e.tickets?.length ?? 0)
      if(pass.section || pass.row || pass.seat)
          pass.reserveInfo = `Section: ${pass.section}, Row: ${pass.row}, Seat: ${pass.seat}`
    });
    setSchools(allSchools)
  }, [passes]);
  return {passes, schools, isLoading, error, isRefetchingByUser, isFetching, refetchByUser} 
}

export default usePasses