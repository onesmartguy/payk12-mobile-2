import { Entity, PaginationState } from "@/types";
import { create } from "zustand/react";

const defaults: RedemptionState = {  
  filters: { 
    organization: null, 
    school: null, 
    event: null 
  }, 
  orgs: [], 
  schools: [], 
  events: [], 
  tickets: [] 
}

type RedemptionState = {
  filters: {
    organization?: number | null;
    school?: number | null;
    event?: number | null;
  }, 

  orgs: Entity[],
  schools: Entity[],
  events: Entity[],
  tickets: {id: number, name: string}[],
}

const useRedemptionStore = create<RedemptionState>((set, get) => ({
    ...defaults,
  

    upsertOrg: (org: Entity) => set((state) => {
      const existingIndex = state.orgs.findIndex((p) => p.id === org.id);
      if (existingIndex !== -1) {
        const updatedOrgs = [...state.orgs];
        updatedOrgs[existingIndex] = { ...updatedOrgs[existingIndex], ...org };
        return { orgs: updatedOrgs };
      } else {
        return { orgs: [...state.orgs, org] };
      }
    }),
    removeOrg: (id: number) => set((state) => ({
      orgs: state.orgs.filter((p) => p.id !== id),
    })),
    getOrgById: (id: number) => {
      return get().orgs.find((p) => p.id === id);
    },
    upsertSchool: (school: Entity) => set((state) => {
      const existingIndex = state.schools.findIndex((p) => p.id === school.id);
      if (existingIndex !== -1) {
        const updatedSchool = [...state.schools];
        updatedSchool[existingIndex] = { ...updatedSchool[existingIndex], ...school };
        return { schools: updatedSchool };
      } else {
        return { schools: [...state.schools, school] };
      }
    }),
    removeSchool: (id: number) => set((state) => ({
      orgs: state.schools.filter((p) => p.id !== id),
    })),
    getSchoolById: (id: number) => {
      return get().schools.find((p) => p.id === id);
    },
    upsertEvent: (event: Entity) => set((state) => {
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
      orgs: state.events.filter((p) => p.id !== id),
    })),
    getEventById: (id: number) => {
      return get().events.find((p) => p.id === id);
    },
    upsertTicket: (ticket: Entity) => set((state) => {
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
      orgs: state.tickets.filter((p) => p.id !== id),
    })),
    getTicketById: (id: number) => {
      return get().tickets.find((p) => p.id === id);
    },
    reset: () => {
      set(defaults);
    },
  }));

  export default useRedemptionStore;