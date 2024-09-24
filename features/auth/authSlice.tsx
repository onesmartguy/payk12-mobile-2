// import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// import { useDispatch, useSelector } from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// import type { RootState } from '../../store';
// import { AppMode, School, User, Event } from '../common/types';
// import { resetRedemptions } from '../redemption/redemptionSlice';
// import { resetPasses, resetTickets } from '../ticketing/ticketingSlice';
// import { setAuthToken } from '../../services/http';

// import { authApi } from './service';

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   mode: AppMode;
//   permissions: string[];
//   bookmarks: {
//     lastScreen?: string;
//   };
//   selectedSchool?: School;
//   selectedEvent?: Event;
// }
// const initialState = { user: null, token: null } as AuthState;

// const slice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setCredentials: (
//       state,
//       {
//         payload: { user, token },
//       }: PayloadAction<{ user: User; token: string }>,
//     ) => {
//       const canRedemTickets = [
//         'School Corp Admin',
//         'School Admin',
//         'Department Admin',
//         'Super Admin',
//       ];
//       state.user = { ...user, canRedeem: canRedemTickets.includes(user.role) };
//       state.token = token;
//       AsyncStorage.setItem('.auth', token);
//       setAuthToken(token);
//     },
//     setSchool: (state, { payload }: PayloadAction<School>) => {
//       state.selectedSchool = payload;
//     },
//     setEvent: (state, { payload }: PayloadAction<Event>) => {
//       state.selectedEvent = payload;
//     },
//     signOut: () => {
//       AsyncStorage.removeItem('.auth');
//       return initialState;
//     },
//     setMode: (
//       state,
//       payload: PayloadAction<
//         'mytickets' | 'mypasses' | 'ticket-scanner' | undefined
//       >,
//     ) => {
//       state.mode = payload.payload;
//       state.selectedEvent = undefined;
//       state.selectedSchool = undefined;
//     },
//   },
//   extraReducers: builder => {
//     builder.addMatcher(
//       authApi.endpoints.authorize.matchFulfilled,
//       (state, { payload }) => {},
//     );
//   },
// });

// export const { setCredentials, signOut } = slice.actions;

// export default slice.reducer;

// export const useCurrentUser = () => {
//   return useSelector<RootState, User>(state => state.auth.user as User);
// };
// export const useAppContext = () => {
//   const dispatch = useDispatch();
//   const user = useSelector<RootState>(state => state.auth.user) as User;
//   const currentSchool = useSelector<RootState>(
//     state => state.auth.selectedSchool,
//   ) as School;
//   const currentEvent = useSelector<RootState>(
//     state => state.auth.selectedEvent,
//   ) as Event;
//   const setEvent = (event: Event) => {
//     dispatch(slice.actions.setEvent(event));
//   };
//   const setSchool = (school: School) => {
//     dispatch(slice.actions.setSchool(school));
//   };

//   return { currentEvent, currentSchool, setEvent, setSchool, user };
// };
// export const useAppMode = () => {
//   const dispatch = useDispatch();
//   const mode = useSelector<RootState, AppMode>(state => state.auth.mode);

//   const setMode = (mode: AppMode) => {
//     dispatch(resetRedemptions());
//     dispatch(slice.actions.setMode(mode));
//   };
//   return { mode, setMode };
// };

// export const selectPermissions = (state: RootState) => state.auth.permissions;
// export const canRedeemTickets = (state: RootState) => state.auth.user;
