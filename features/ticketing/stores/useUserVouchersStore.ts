
import { EventModel, PassModel, SchoolModel, TicketModel } from "@/common/types";
import { isArray } from "lodash";
import { create } from "zustand/react";

const defaults: MyVouchersState = {  
  
  selectedSchool: null,
  selectedEvent: null,
  tickets: [] , 
  passes: [] 
}

type MyVouchersState = {
  selectedSchool: SchoolModel | null,
  selectedEvent: EventModel | null,
  tickets: TicketModel[],
  passes: PassModel[],
}
type  MyVoucherActions = {
  
  setSelectedSchool: (school: SchoolModel | null) => any,
  setSelectedEvent: (event: EventModel | null) => any,
  upsertTicket: (ticket: TicketModel, replace?: boolean) => any,
  upsertTickets: (tickets: TicketModel[], replace?: boolean) => any,
  upsertPass: (pass: PassModel, replace?: boolean) => any,
  upsertPasses: (passes: PassModel[], replace?: boolean) => any,
  removeTicket: (id: number) => any,
  removePass: (id: number) => any,
  resetFilter: () => any,
  reset: () => any,
}

const useUserVouchersStore = create<MyVouchersState & MyVoucherActions>((set, get) => ({
    ...defaults,
    setSelectedSchool: (school) => set({ selectedSchool: school }),
    setSelectedEvent: (event) => {
      set({ selectedEvent:  event})
    },
    upsertTicket: (ticket) => set((state) => {
      const existingIndex = state.tickets.findIndex((p) => p.id === ticket.id);
      if (existingIndex !== -1) {
        const updatedTicket = [...state.tickets];
        updatedTicket[existingIndex] = { ...updatedTicket[existingIndex], ...ticket };
        return { tickets: updatedTicket };
      } else {
        return { tickets: [...state.tickets, ticket] };
      }
    }),
    upsertTickets: (tickets) => set((state) => {
      console.log('upsertTickets', tickets)
      return { tickets: [...tickets] };
    }),
    removeTicket: (id) => set((state) => ({
      tickets: state.tickets.filter((p) => p.id !== id),
    })),
    upsertPass: (pass) => set((state) => {
      const existingIndex = state.passes.findIndex((p) => p.id === pass.id);
      if (existingIndex !== -1) {
        const updatedPass = [...state.passes];
        updatedPass[existingIndex] = { ...updatedPass[existingIndex], ...pass };
        return { passes: updatedPass };
      } else {
        return { passes: [...state.passes, pass] };
      }
    }),
    upsertPasses: (passes) => set((state) => {
      return { passes: passes };
    }),
    removePass: (id) => set((state) => ({
      passes: state.passes.filter((p) => p.id !== id),
    })),
    resetFilter: () => {

      console.log('resetFilter')
      set({ selectedSchool: null, selectedEvent: null })
    },
    reset: () => {
      set(defaults);
    },
  }));

  const  selectedSchool = useUserVouchersStore(x => x.selectedSchool)
  const  selectedEvent = useUserVouchersStore(x => x.selectedEvent) 
  const setSelectedSchool = useUserVouchersStore(x => x.setSelectedSchool)
  const setSelectedEvent = useUserVouchersStore(x => x.setSelectedEvent)
  export const useSelectedSchool = [selectedSchool, setSelectedSchool]
  export const useSelectedEvent = [selectedEvent, setSelectedEvent]
  export default useUserVouchersStore;