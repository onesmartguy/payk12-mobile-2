import React, {memo, useCallback, useContext, useEffect, useState} from 'react';
import {FlatList} from 'react-native-gesture-handler';
import _, {orderBy} from 'lodash';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';


import Box from '@/ui/Box';
import TextView from '@/ui/TextView';
import SearchBox from '@/ui/SearchBox';
import NoResultsView from '@/ui/NoResultsView';
import {School, NamePageSearch} from '../../features/common/types';
import {} from '../../features/redemption/redemptionSlice';
import {useAppContext} from '../../features/auth/authSlice';

import LoadingBlock from '../../components/LoadingBlock';
import {useManagedSchools} from '../../features/redemption/hooks/useManagedSchools';
import BasicListItem from '@/ui/BasicListItem';



export const AdminSchoolSelectionScreen: React.FC<any> = ({
  navigation,
  route,
}) => {
  const [filter, setFilter] = useState<NamePageSearch>({
    page: 1,
    pageSize: 25,
  });
  const {managedSchools, addManagedSchools} = useManagedSchools();
  const [schools, setSchools] = useState(managedSchools);
  const {setSchool} = useAppContext();

  const [fetch, {data, error, isLoading}] = useLazyGetSchoolsAsAdminQuery();
  const isFocused = useIsFocused();
  const navigateToSchool = (school: School) => {
    setSchool(school);
    navigation.navigate('AdminEventSelector');
  };

  const refresh = useCallback(() => {
    fetch({});
  }, [fetch]);
  useEffect(() => {
    if (managedSchools && managedSchools.length > 0) {
      const filtered = orderBy(
        filter.name
          ? managedSchools.filter(x =>
              x.name.toLowerCase().includes(filter.name!.toLowerCase()),
            )
          : managedSchools,
        ['name'],
      );
      setSchools(filtered);
    }
  }, [managedSchools, filter]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (data && data.length > 0) addManagedSchools(data);
  }, [data]);

  const titleText = 'Select your school';
  const noResultsText = 'No Results';
  const loadingText = 'Loading';

  const renderContent = () => {
    if (isLoading) return <LoadingBlock />;

    if (error)
      return <TextView variant="loading">{JSON.stringify({error, schools})}</TextView>;

    if (!managedSchools) return <NoResultsView />;
    return (
      <Box flex={1}>
        <FlatList
          data={schools}
          onRefresh={refresh}
          renderItem={context => (
            <BasicListItem
              key={context.item.id}
              label={context.item.name}
              onPress={() => navigateToSchool(context.item)}
            />
          )}
        />
      </Box>
    );
  };
  return (

      <Box flex={1} paddingHorizontal="lg">
        <Box>
          <TextView variant="title" marginBottom="lg">
            {titleText}
          </TextView>
          <SearchBox
            onChange={value => setFilter(x => ({...x, name: value}))}
            value={filter.name}
          />
        </Box>
        {renderContent()}
      </Box>
  );
};

export default AdminSchoolSelectionScreen;
