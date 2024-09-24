
import { Event, Pass, School } from '@app/features/common/types';
import http from '@app/services/http';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRefreshByUser } from './useRefreshByUser';
import { useRefreshOnFocus } from './useRefreshOnFocus';
import {useEffect, useState} from 'react';
import { orderBy, uniqBy, map, sum, first, sumBy } from 'lodash';
import { useHandler } from 'react-native-reanimated';

export type ShareResult = {
  email: string;
  isSuccess: boolean;
  tickets: number[];
  errorMessage: string;
}
type ShareOptions = {
  email: string;
  events?: number[];
  passId?: number;
  tickets?: number[];
  transferPass?: boolean;
}
const shareItemAsync = async (options: ShareOptions) => {
  var passes = await http.post<ShareResult>(`api/ticketing/transfer`, options);
  return passes.data;
};

const useSharing = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation(shareItemAsync, {
    onSuccess: data => {
      const tickets = queryClient.getQueryData(['mytickets'])

      // Optimistically update to the new value
      // queryClient.setQueryData(['mytickets'], old => [...old, newTodo])
      // queryClient.setQueryData(['mytickets'], data)

      queryClient.invalidateQueries(['mytickets'])
    }
  })
  const sharePass = async (options: ShareOptions) => {
    var sharePassResults = await mutation.mutateAsync(options)
    return sharePassResults;
  }
  const shareTickets = async (options: ShareOptions) => {
    var shareTicketResults = await mutation.mutateAsync(options)
    return shareTicketResults;
  }

 
  
  useEffect(() => {
   //console.log('pass', pass)
  }, []);
  const { isLoading, isSuccess, reset, error } = mutation
  return {sharePass, isLoading, isSuccess, reset, error, shareTickets} 
}

export default useSharing