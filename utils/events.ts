
import { EventModel } from '@/common/types';
import { format, isSameDay, isBefore } from 'date-fns';

export const eventDates = (event: EventModel) => ({
  date: format(new Date(event.startTime), 'MM/dd/yy'),
  day: format(new Date(event.startTime), 'EEE'),
  time: format(new Date(event.startTime), 'hh:mma'),
});

export const eventSection = (event: EventModel) =>
  isSameDay(new Date(event.startTime), new Date())
    ? 'TODAY'
    : isBefore(new Date(event.startTime), new Date())
      ? 'PAST'
      : 'UPCOMING';

export const getEventDateAsString = (event: EventModel) => {
  const df = eventDates(event);
  return `${df.date} - ${df.day} - ${df.time}`;
};

export const getDateAsString = (date: Date) => {
  const df = {
    date: format(date, 'MM/dd/yy'),
    day: format(date, 'EEEE'),  // Full day name
    time: format(date, 'h:mm a'),  // Lowercase am/pm
  };
  return `${df.date} - ${df.day} - ${df.time}`;
};

export const getCheckoutDate = (date: Date) => {
  const df = {
    date: format(date, 'MM/dd/yy'),
    day: format(date, 'EEEE'),  // Full day name
    time: format(date, 'h:mm a'),  // Lowercase am/pm
  };
  return `${df.date} at ${df.time}`;
};

export const EventUtils = {
  eventDates,
  eventSection,
  getEventDateAsString,
  getDateAsString,
};

export default EventUtils;