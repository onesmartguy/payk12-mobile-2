import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, RefreshControl } from 'react-native';
import {
  DrawerScreenProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import { FlatList } from 'react-native-gesture-handler';
import qs from 'query-string';
import { orderBy } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { StackParamList } from '../../../navigation';
import { Header, MainLayout, BasicListItem } from '../../../components';
import { Text, Box, SearchBox, NoResultsBox } from '../../../ui';
import { RootState } from '../../../store';
import { useAppContext } from '../../auth/authSlice';
import { School } from '../types';

type Props = StackScreenProps<StackParamList, 'SchoolPickerModal'>;

export const SchoolSelectorModal: React.FC<Props> = ({ route, navigation }) => {
  const [schools, setSchools] = useState<School[]>(route.params.schools || []);

  const titleText = 'Select your school';
  const goBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  };
  const onSelect = (school: School) => {
    if (route?.params.onSelected) {
      route.params.onSelected(school);
      goBack();
    }
  };
  const renderContent = () => {
    return (
      <Box flex={1} paddingHorizontal="lg">
        <Box flex={1}>
          <FlatList
            data={orderBy(schools, ['name'])}
            renderItem={context => (
              <BasicListItem
                key={context.item.id}
                label={context.item.name}
                onPress={() => onSelect(context.item)}
              />
            )}
          />
        </Box>
      </Box>
    );
  };

  return (
    <MainLayout>
      <Header onBackPress={goBack} />
      <Box paddingHorizontal="lg">
        <Text variant="title" marginBottom="lg">
          {titleText}
        </Text>
      </Box>
      {renderContent()}
    </MainLayout>
  );
};
export default SchoolSelectorModal;
