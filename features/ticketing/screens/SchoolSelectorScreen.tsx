import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { RefreshControl, SectionList, TouchableOpacity } from 'react-native';
import {
  DrawerScreenProps,
  DrawerNavigationProp,
} from '@react-navigation/drawer';
import moment from 'moment';
import _, { groupBy, map } from 'lodash';
import { useNavigation } from '@react-navigation/native';
import { SwipeListView, SwipeRow } from 'react-native-swipe-list-view';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { Box } from '../../../ui';
import { MainLayout, Header } from '../../../components';
import { useLazyGetTicketsQuery } from '../service';
import { StackParamList } from '../../../navigation';
import {
  Event,
  NamePageSearch,
  Pass,
  School,
  Ticket,
} from '../../common/types';
import { useAppContext } from '../../auth/authSlice';
import { getDateAsString } from '../../../utils';
import { SchoolSelectorView, TicketShareModal } from '../../common/components';

type Props = StackScreenProps<StackParamList, 'EventSelector'>;

export const SchoolSelectorScreen = ({ route }: Props) => {
  const [state, setState] = useState({
    tickets: [] as Ticket[],
    schools: [] as School[],
    events: [] as Event[],
    passes: [] as Pass[],
    selectedSchool: undefined as School | undefined,
    selectedPass: undefined as Pass | undefined,
    selectedEvent: undefined as Event | undefined,
  });
  const renderContent = () => {
    const dte = moment();
    const isRedeemed = state.selectedEvent
      ? state.selectedEvent.redemptions > 0
      : false;
    // if (isLoading) return <LoadingBlock />;

    // if (error) return <Text variant="loading">{JSON.stringify(error)}</Text>;

    // if (!data) return <NoResultsBox message="No Passes Found" icon="event" />;

    if (!state.selectedSchool)
      return (
        <SchoolSelectorView
          schools={state.schools}
          onSelected={school => setState({ ...state, selectedSchool: school })}
        />
      );
  };
  return (
    <BottomSheetModalProvider>
      <MainLayout>
        {/* <Header onBackPress={onBack} /> */}
        <Box paddingHorizontal="lg" flex={1}>
          {renderContent()}
        </Box>
      </MainLayout>
    </BottomSheetModalProvider>
  );
};

export default SchoolSelectorScreen;
