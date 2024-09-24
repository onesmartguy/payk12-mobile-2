import { StyleSheet } from 'react-native';
import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  useEffect,
} from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';
import { backgroundColor } from '@shopify/restyle';

import { Event, Redemption } from '../../common/types';
import { Box, Text } from '../../../ui';
import { RootState } from '../../../store';
import { RedemptionRow } from '../components/RedemptionRow';
import { selectedEventRedemptions } from '../redemptionSlice';

interface Props {
  errors: Redemption[];
  onClose?: () => void;
}
export type CheckInErrorLogSheet = {
  show: () => void;
  close: () => void;
};
const RedemCheckInErrorLogBottomSheetComponent = forwardRef<
  CheckInErrorLogSheet,
  Props
>(({ onClose, errors }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheet>(null);
  useImperativeHandle(ref, () => ({
    show,
    close,
  }));
  // variables

  // callbacks
  const show = useCallback(() => {
    if (bottomSheetModalRef.current) {
      bottomSheetModalRef.current.expand();
    }
  }, []);

  // variables
  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);
  const close = useCallback(() => {
    bottomSheetModalRef.current?.close();
  }, []);

  return (
    <BottomSheet
      ref={bottomSheetModalRef}
      index={-1}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      style={style.container}
      onClose={() => onClose && onClose()}
      enablePanDownToClose
    >
      <BottomSheetView onLayout={handleContentLayout} style={{ flexGrow: 1 }}>
        <Box flex={1} marginHorizontal="lg" marginVertical="lg">
          <Text
            textAlign="center"
            textTransform="uppercase"
            fontWeight="600"
            fontSize={24}
            lineHeight={28}
            color="headerText"
            marginBottom="lg"
          >
            Check-In Issue Found
          </Text>
          <FlatList
            style={{ flex: 1, flexGrow: 1 }}
            data={errors}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={item => <RedemptionRow redemption={item.item} />}
          />
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
});
const style = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});
const CheckInErrorLogBottomSheet = memo(
  RedemCheckInErrorLogBottomSheetComponent,
);
export default CheckInErrorLogBottomSheet;
