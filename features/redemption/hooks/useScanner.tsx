import { useDispatch, useSelector, useStore } from 'react-redux';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { InteractionManager } from 'react-native';
import { isArray, uniqueId } from 'lodash';
import moment from 'moment';

import { RootState } from '../../../store';
import { useRedeemTicketAsAdminMutation } from '../service';
import {
  addTicketRedemption,
  selectedEvent,
  selectedEventRedemptions,
  selectedEventedTickets,
} from '../redemptionSlice';
import { playNotice, playSuccess, playError } from '../../../assets/sounds';
import { Event, Redemption, ListResponse } from '../../common/types';

export const useScanner = () => {
  const store = useStore<RootState>().getState();
  const event = selectedEvent(store);
  const redemptions = useSelector(selectedEventedTickets);
  const dispatch = useDispatch();

  const [redeemTicketAsync, { isLoading: isUpdating }] =
    useRedeemTicketAsAdminMutation();

  const redeemTicket = async (tickets: string | string[]) => {
    if (!event) return;
    const payload = {
      events: [event.id],
      schoolId: event.schoolId,
      tickets: isArray(tickets) ? tickets : [tickets],
    };
    const dte = moment();
    let scanResult = [] as Redemption[];
    try {
      const { data }: { data: Redemption[] } = (await redeemTicketAsync(
        payload,
      )) as any;
      scanResult = data;

      if (scanResult.every(x => x.isValid)) {
        playSuccess();
      } else {
        playError();
      }
      dispatch(addTicketRedemption(scanResult));
    } catch (error) {
      playError();
    }

    return scanResult;
  };

  return { redeemTicket, isUpdating, redemptions };
};

export default useScanner;
