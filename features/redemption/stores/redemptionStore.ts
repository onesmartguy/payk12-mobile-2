
import { BaseEntity, EventModel, TicketModel } from "@/common/types";
import { create } from "zustand/react";

const defaults: RedemptionState = {  

  events: [], 
  tickets: [] 
}

type RedemptionState = {

  events: EventModel[],
  tickets: TicketModel[],

}
type  RedemptionActions = {

  

  upsertEvent: (event: EventModel) => any,
  upsertTicket: (ticket: TicketModel) => any,

  removeEvent: (id: number) => any,
  removeTicket: (id: number) => any,
}

const useRedemptionStore = create<RedemptionState & RedemptionActions>((set, get) => ({
    ...defaults,
  

   
    upsertEvent: (event: EventModel) => set((state) => {
      const existingIndex = state.events.findIndex((p) => p.id === event.id);
      if (existingIndex !== -1) {
        const updatedEvent = [...state.events];
        updatedEvent[existingIndex] = { ...updatedEvent[existingIndex], ...event };
        return { events: updatedEvent };
      } else {
        return { events: [...state.events, event] };
      }
    }),
    removeEvent: (id: number) => set((state) => ({
      events: state.events.filter((p) => p.id !== id),
    })),
    getEventById: (id: number) => {
      return get().events.find((p) => p.id === id);
    },
    upsertTicket: (ticket: TicketModel) => set((state) => {
      const existingIndex = state.tickets.findIndex((p) => p.id === ticket.id);
      if (existingIndex !== -1) {
        const updatedTicket = [...state.tickets];
        updatedTicket[existingIndex] = { ...updatedTicket[existingIndex], ...ticket };
        return { tickets: updatedTicket };
      } else {
        return { tickets: [...state.tickets, ticket] };
      }
    }),
    removeTicket: (id: number) => set((state) => ({
      tickets: state.tickets.filter((p) => p.id !== id),
    })),
    getTicketById: (id: number) => {
      return get().tickets.find((p) => p.id === id);
    },
    reset: () => {
      set(defaults);
    },
  }));

  export default useRedemptionStore;