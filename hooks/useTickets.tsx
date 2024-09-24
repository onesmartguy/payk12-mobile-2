
import { SIGNALR_ENDPOINT } from '@app/features/common/constants';
import { Event, School, Ticket } from '@app/features/common/types';
import http from '@app/services/http';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { useQuery } from '@tanstack/react-query';
import { first, orderBy, some } from 'lodash';
import { useEffect, useState } from 'react';
import { useRefreshByUser } from './useRefreshByUser';
import { useRefreshOnFocus } from './useRefreshOnFocus';


  
const fetchMyTickets = async () => {
  var tickets = await http.get<Ticket[]>(`api/ticketing/my-tickets`);
  if(tickets.data.length > 0){
    return tickets.data.filter(x => x.type != 'P')
  }
  return tickets.data;
};

const useTickets = () => {

  const { isLoading, isFetching, error, data: tickets, refetch } = useQuery<Ticket[], Error>(
    ['mytickets'],
    fetchMyTickets
  );
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  const [schools, setSchools] = useState<School[]>([]);
  useEffect(() => {
    if(tickets){
      var _allEvents = tickets.reduce<Event[]>((_events, t) => {
        var event = _events.find(x => x.id == t.eventId)
        if(!event) {
          event = { id: t.eventId, name: t.eventName, endTime: t.endTime, startTime: t.startTime, schoolId: t.schoolId, schoolName: t.schoolName } as Event
          const eventTickets = tickets.filter(x => x.eventId == event!.id)
          event.tickets = eventTickets
          event.availibleTickets = eventTickets.length
          event.isShareable = some(eventTickets, x => x.isShareable)
          _events.push(event)
        }
        return _events
      }, [] as Event[])
      var allSchools = _allEvents.reduce<School[]>((_schools, evt) => {
        var school = _schools.find(x => x.id == evt.schoolId)

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

      allSchools.forEach(s => {
        s.events.forEach(e =>  e.tickets.forEach(t => console.log(`id: ${t.id}, name: ${t.eventName} isRedeemable: ${t.isRedeemable}`)))
      })
      setSchools(allSchools)
    }
  }, [tickets, isFetching]);

  return {tickets, isLoading, schools, error, isFetching, isRefetchingByUser, refetchByUser} 
}

export default useTickets