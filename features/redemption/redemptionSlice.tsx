// import {
//   createEntityAdapter,
//   createSlice,
//   EntityState,
//   PayloadAction,
// } from '@reduxjs/toolkit';
// import moment from 'moment';
// import { map } from 'lodash';
// import uuid from 'react-native-uuid'

// import type { RootState } from '../../store';
// import { Event, School, Redemption, Ticket } from '../common/types';


// const schoolAdapter = createEntityAdapter<School>({
//   selectId: school => school.id,
//   sortComparer: (a, b) => a.name.localeCompare(b.name),
// });
// const eventAdapter = createEntityAdapter<Event>({
//   selectId: event => event.id,
//   sortComparer: (a, b) => a.name.localeCompare(b.name),
// });
// const ticketsAdapter = createEntityAdapter<Ticket>({
//   selectId: ticket => ticket.publicId,
//   sortComparer: (a, b) => a.publicId.localeCompare(b.publicId),
// });

// const redemptionAdapter = createEntityAdapter<Redemption>({
//   selectId: redemption => redemption.id,
//   sortComparer: (a, b) => moment(a.scannedOn).diff(b.scannedOn),
// });
// interface RedemptionState {
//   managedSchools: EntityState<School>;
//   managedEvents: EntityState<Event>;
//   managedTickets: EntityState<Ticket>;
//   ticketRedeptions: EntityState<Redemption>;
// }

// const initialState = {
//   managedSchools: schoolAdapter.getInitialState(),
//   managedEvents: eventAdapter.getInitialState(),
//   managedTickets: ticketsAdapter.getInitialState(),
//   ticketRedeptions: redemptionAdapter.getInitialState(),
// } as RedemptionState;

// const redemptionSlice = createSlice({
//   name: 'redemptionSlice',
//   initialState,
//   reducers: {
//     addManagedEvents: (state, { payload }: PayloadAction<Event[]>) => {
//       eventAdapter.upsertMany(state.managedEvents, payload);

//       const expiredIds = eventAdapter
//         .getSelectors()
//         .selectAll(state.managedEvents)
//         .filter(x => moment(x.endTime).endOf('date').isBefore(moment()))
//         .map(x => x.id);

//       eventAdapter.removeMany(state.managedEvents, expiredIds);
//     },
//     addManagedSchools: (state, { payload }: PayloadAction<School[]>) => {
//       const expiresAt = moment().add(1, 'day');
//       payload.forEach((s, i, ss): any => {
//         ss[i].name = payload[i].name.trim();
//       });
//       schoolAdapter.upsertMany(state.managedSchools, payload);
//       const missingIds = state.managedSchools.ids.filter(
//         x => !payload.map(p => p.id as any).includes(x),
//       );
//       schoolAdapter.removeMany(state.managedSchools, missingIds);
//       const schools: any = map(state.managedSchools.entities, x => ({
//         ...x,
//       }))
//         .filter((x: any) => x.expiresAt && x.expiresAt < moment().toDate())
//         .map(x => x.id);
//       schoolAdapter.removeMany(state.managedSchools, schools);
//     },
//     addManagedTickets: (state, { payload }: PayloadAction<Ticket[]>) => {
//       const tickets = payload.map(({ publicId, ...ticket }) => ({
//         ...ticket,
//         publicId: publicId.toLowerCase(),
//       }));
//       ticketsAdapter.upsertMany(state.managedTickets, tickets);
//     },
//     addTicketRedemption: (state, { payload }: PayloadAction<Redemption[]>) => {
     
//       const redemptions = payload.map(({ publicId, ...redemption }) => {
      
//         return {
//         ...redemption,
//         publicId: publicId.toLowerCase(),
//         id: uuid.v4().toString()
//       }});
      
//       redemptionAdapter.upsertMany(state.ticketRedeptions, redemptions);
//     },
//     resetRedemptions: () => {
//       return initialState;
//     },
//   },
//   // extraReducers: builder => {
//   //   builder.addMatcher(
//   //     redemptionApi.endpoints.redeemTicketAsAdmin.matchFulfilled,
//   //     (state, { meta, payload }) => {
//   //       if (isArray(payload)) {
//   //         const redemptions = map(payload, r => {
//   //           const old = state.managedTickets.entities[r.publicId.toLowerCase()];
//   //           if (old) {
//   //             old.redeemedOn = r.redeemedOn;
//   //           }
//   //         });
//   //         redemptionAdapter.upsertMany(state.ticketRedeptions, payload);
//   //       }
//   //     },
//   //   );
//   // },
// });

// export const {
//   addManagedEvents,
//   addManagedSchools,
//   resetRedemptions,
//   addManagedTickets,
//   addTicketRedemption,
// } = redemptionSlice.actions;

// export default redemptionSlice.reducer;
// const ticketSelectors = ticketsAdapter.getSelectors();
// const redemptionSelectors = redemptionAdapter.getSelectors();
// const schoolSelectors = schoolAdapter.getSelectors();
// const eventSelectors = eventAdapter.getSelectors();

// export const schoolSelector = (state: RootState) =>
//   schoolSelectors.selectAll(state.redemption.managedSchools);

// export const eventsSelector = (state: RootState) =>
//   eventSelectors
//     .selectAll(state.redemption.managedEvents)
//     .filter(x => x.schoolId === state.auth.selectedSchool?.id);

// export const selectedEventedTickets = (state: RootState) =>
//   ticketSelectors
//     .selectAll(state.redemption.managedTickets)
//     .filter(x => x.eventId === state.auth.selectedEvent?.id);

// export const selectedEventRedemptions = (state: RootState) =>
//   redemptionSelectors
//     .selectAll(state.redemption.ticketRedeptions);

// export const selectedEvent = (state: RootState) => state.auth.selectedEvent;

// export const selectPermissions = (state: RootState) => state.auth.permissions;
// export const canRedeemTickets = (state: RootState) => state.auth.user;
