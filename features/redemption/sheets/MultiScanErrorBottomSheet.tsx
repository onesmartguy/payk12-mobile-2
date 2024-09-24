import { Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  createRef,
} from 'react';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetProps,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faExclamationTriangle,
  faTimes,
} from '@fortawesome/pro-regular-svg-icons';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native-gesture-handler';

import { palette } from '../../../ui/theme';
import { Event, Redemption } from '../../common/types';
import { Box, Text, Button, TextInputField } from '../../../ui';
import { RootState } from '../../../store';
import { DuplicateIcon, InvalidIcon, ValidIcon } from '../../../assets';
import { RedemptionRow } from '../components/RedemptionRow';

interface MultiScanErrorBottomSheetProps {
  onClose?: () => void;
}
export type MultiScanErrorSheet = {
  show: (redemptions: Redemption[]) => void;
  close: () => void;
};
const MultiScanErrorBottomSheetComponent = forwardRef<
  MultiScanErrorSheet,
  MultiScanErrorBottomSheetProps
>(({ onClose }, ref) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [redemptions, setRedemptions] = useState([] as Redemption[]);
  useImperativeHandle(ref, () => ({ close, show }));
  const close = useCallback(() => {
    setRedemptions(() => []);
    bottomSheetModalRef.current?.close();
    onClose && onClose();
  }, []);
  const show = useCallback(redemptions => {
    if (bottomSheetModalRef.current) {
      setRedemptions(() => redemptions);
      if (bottomSheetModalRef.current.present) {
        bottomSheetModalRef.current.present();
      } else if (bottomSheetModalRef.current.expand) {
        bottomSheetModalRef.current.expand();
      }
    }
  }, []);

  // variables
  const snapPoints = useMemo(() => ['0%', 'CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  return (
    <BottomSheet
      ref={bottomSheetModalRef}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      style={style.container}
      enablePanDownToClose
    >
      <BottomSheetView onLayout={handleContentLayout}>
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
            Multi-Ticket Scan Results
          </Text>
          <FlatList
            style={{ flex: 1 }}
            data={redemptions}
            keyExtractor={(item, index) => `${item.id}_${index}`}
            renderItem={item => <RedemptionRow redemption={item.item} />}
            ListEmptyComponent={<Text>Empty List</Text>}
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
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
});

const MultiScanErrorBottomSheet = memo(MultiScanErrorBottomSheetComponent);
export default MultiScanErrorBottomSheet;
