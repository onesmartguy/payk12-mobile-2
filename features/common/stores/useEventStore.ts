
import { create } from "zustand/react";
import { EventModel } from "../types";

const defaults: EventStoreState = {  
  events: [],
  currentEvent: null,
}

type EventStoreState = {

  currentEvent: EventModel | null,
  events: EventModel[],
}
type EventModelOrId = EventModel | number;
type  EventStoreActions = {
  setCurrentEvent: (event: EventModelOrId) => any,
  upsertEvent: (event: EventModel) => any,
  removeEvent: (id: number) => any,
  getEventById: (id: number) => EventModel | undefined,
}

const useEventStore = create<EventStoreState & EventStoreActions>((set, get) => ({
    ...defaults,
    setCurrentEvent: (event: EventModelOrId) => set({ currentEvent: typeof event === 'number' ? get().events.find((p) => p.id === event) : event }),
    upsertEvent: (event: EventModel) => set((state) => {
      const existingIndex = state.events.findIndex((p) => p.id === event.id);
      if (existingIndex !== -1) {
        const updatedEvents = [...state.events];
        updatedEvents[existingIndex] = { ...updatedEvents[existingIndex], ...event };
        return { events: updatedEvents };
      } else {
        return { events: [...state.events, event] };
      }
    }),
    removeEvent: (id: number) => set((state) => ({
      events: state.events.filter((e) => e.id !== id),
    })),
    getEventById: (id: number) => {
      return get().events.find((p) => p.id === id);
    },
    reset: () => {
      set(defaults);
    },
  }));

  export default useEventStore;