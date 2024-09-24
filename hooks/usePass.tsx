
import { Event, Pass, School } from '@app/features/common/types';
import http from '@app/services/http';
import { useQuery } from '@tanstack/react-query';
import { useRefreshByUser } from './useRefreshByUser';
import { useRefreshOnFocus } from './useRefreshOnFocus';
import {useEffect, useState} from 'react';
import { orderBy, uniqBy, map, sum, first, sumBy } from 'lodash';
import { useHandler } from 'react-native-reanimated';

const fetchPass = async (id: number) => {
  var passes = await http.get<Pass>(`api/ticketing/my-passes/${id}`);
  return passes.data;
};

const usePass = (id: number) => {
  const { isLoading, isFetching, error, data: pass, refetch } = useQuery<Pass, Error>(
    ['mypasses', id],
    fetchPass(id) as any
  );
  const { isRefetchingByUser, refetchByUser } = useRefreshByUser(refetch);
  useRefreshOnFocus(refetch);

  return {pass, isLoading, error, isRefetchingByUser, isFetching, refetchByUser} 
}

export default usePass