import {useDispatch, useSelector} from 'react-redux';
import React, {useState, useEffect} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {InteractionManager} from 'react-native';
import {RootState} from 'src/store';

import {useRedeemTicketAsAdminMutation} from '../service';
import {addManagedSchools, schoolSelector} from '../redemptionSlice';
import {AppMode, Event, School} from '../../common/types';

export const useManagedSchools = () => {
  const managedSchoolState = useSelector<RootState>(schoolSelector) as School[];
  const dispatch = useDispatch();
  const [managedSchools, setSchools] = useState([] as School[]);

  useEffect(() => {
    setSchools(managedSchoolState);
  }, [managedSchoolState]);
  const _addManagedSchools = (schools: School[]) => {
    dispatch(addManagedSchools(schools as any));
  };
  // );

  return {managedSchools, addManagedSchools: _addManagedSchools};
};

export default useManagedSchools;
