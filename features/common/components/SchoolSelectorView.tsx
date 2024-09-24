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
import { BoxProps } from '@shopify/restyle';

import { StackParamList } from '../../../navigation';
import { Header, MainLayout, BasicListItem } from '../../../components';
import { Text, Box, SearchBox, NoResultsBox } from '../../../ui';
import { School } from '../types';
import { Theme } from '../../../ui/theme';

interface Props extends BoxProps<Theme> {
  schools: School[];
  onSelected: (school: School) => void;
}
export const SchoolSelectorView: React.FC<Props> = ({
  schools,
  onSelected,
  ...props
}) => {
  const titleText = 'Select your school';
  const handleSelectedSchool = (school: School) => {
    if (onSelected) onSelected(school);
  };
  const renderHeader = () => (
    <Box flex={1}>
      <Text variant="title" marginBottom="lg">
        {titleText}
      </Text>
    </Box>
  );

  return (
    <Box flex={1} paddingHorizontal="lg" {...props}>
      <Box flex={1}>
        <FlatList
          data={orderBy(schools, ['name'])}
          ListHeaderComponent={() => renderHeader()}
          renderItem={context => (
            <BasicListItem
              key={context.item.id}
              label={context.item.name}
              onPress={() => handleSelectedSchool(context.item)}
            />
          )}
        />
      </Box>
    </Box>
  );
};
export default SchoolSelectorView;
