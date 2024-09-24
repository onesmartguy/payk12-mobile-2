import {
  createEntityAdapter,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import {uniqBy, uniqWith} from 'lodash';
import moment from 'moment';
import {useStore} from 'react-redux';

import type {RootState} from '../../store';
import type {Event, School, Ticket, Pass} from '../common/types';

const ticketAdapter = createEntityAdapter<Ticket>({
  selectId: ticket => ticket.publicId,
  sortComparer: (a, b) => moment(a.endTime).diff(b.endTime),
});

const passAdapter = createEntityAdapter<Pass>({
  selectId: pass => pass.id,
  sortComparer: (a, b) => moment(a.expiresOn).diff(b.expiresOn),
});

const ticketingSlice = createSlice({
  name: 'tickets',
  initialState: ticketAdapter.getInitialState(),
  reducers: {
    upsertTickets: (state, {payload = []}: PayloadAction<Ticket[]>) => {
      ticketAdapter.upsertMany(state, payload);
    },
    resetTickets: state => {
      return ticketAdapter.getInitialState();
    },
  },
});
const passSlice = createSlice({
  name: 'passes',
  initialState: passAdapter.getInitialState(),
  reducers: {
    upsertPasses: (state, {payload = []}: PayloadAction<Pass[]>) => {
      const passes = payload
        .map(x => ({...x, events: x.events || []}))
        .filter(x => x.type !== 'P' && x.type !== 'R');

      passAdapter.upsertMany(state, passes);
    },
    resetPasses: state => {
      return passAdapter.getInitialState();
    },
  },
});
export const selectAllPasses = (state: RootState) =>
  passAdapter.getSelectors().selectAll(state.passes);

export const selectAllTickets = (state: RootState) => {
  return ticketAdapter
    .getSelectors()
    .selectAll(state.tickets)
    .filter(x => x.type !== 'P');
};

export const {upsertTickets, resetTickets} = ticketingSlice.actions;
export const {upsertPasses, resetPasses} = passSlice.actions;

export const reducers = {
  tickets: ticketingSlice.reducer,
  passes: passSlice.reducer,
};

export const selectCurrentUser = (state: RootState) => state.auth.user;
