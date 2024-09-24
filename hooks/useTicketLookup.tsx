
import { Event, School, Ticket } from '@app/features/common/types';
import http from '@app/services/http';
import { useQuery } from '@tanstack/react-query';
import { first, orderBy } from 'lodash';
import { useEffect, useState } from 'react';
import { useRefreshByUser } from './useRefreshByUser';
import { useRefreshOnFocus } from './useRefreshOnFocus';

const fetchMyTickets = async () => {
  var tickets = await http.get<Ticket[]>(`api/ticketing/my-tickets`);
  if(tickets.data.length == 0)
    throw new Error('No tickets found');
  return tickets.data;
};
export const getMyPassesAsync = async () => {
  return http.get(`api/ticketing/my-passes`);
};

const useTicketLookup = () => {
  const { isLoading, error, data: tickets, refetch } = useQuery<Ticket[], Error>(
    ['mytickets'],
    fetchMyTickets
  );
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const [schools, setSchools] = useState<School[]>([]);
  useEffect(() => {
    if(tickets){
      var _allEvents = tickets.reduce<Event[]>((_events, t) => {
        var event = _events.find(x => x.id)
        if(!event) {
          event = { id: t.eventId, name: t.eventName, endTime: t.endTime, startTime: t.startTime, schoolId: t.schoolId, schoolName: t.schoolName } as Event
          const eventTickets = tickets.filter(x => x.eventId == event!.id)
          event.tickets = eventTickets
          event.availibleTickets = event.tickets.length
          _events.push(event)
        }
        return _events
      }, [] as Event[])
      console.log(JSON.stringify(_allEvents, null, 2))
      var allSchools = _allEvents.reduce<School[]>((_schools, evt) => {
        var school = _schools.find(x => x.id)
        if(!school) {
          school = { id: evt.schoolId, name: evt.schoolName } as School
          const schoolTickets = tickets.filter(x => x.schoolId == school!.id)
          const schoolEvents = _allEvents.filter(x => x.schoolId == school!.id)
          school.availibleTickets = schoolTickets?.length
          school.events = schoolEvents
          school.availibleEvents = school.events.length
          school.upcomingEvent = first(orderBy(schoolEvents, x => x.startTime))
          _schools.push(school)
        }
        return _schools
      }, [] as School[])


      setSchools(allSchools)
    }
  }, [tickets]);

  return {tickets, isLoading, schools, error, isRefetchingByUser, refetchByUser} 
}

export default useTicketLookup