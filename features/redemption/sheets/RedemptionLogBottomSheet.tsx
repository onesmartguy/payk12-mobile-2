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
  onClose?: () => void;
  events: Event[]
}
export type RedemptionLogSheet = {
  show: () => void;
  close: () => void;
};
const RedemptionLogBottomSheetComponent = forwardRef<RedemptionLogSheet, Props>(
  ({ onClose, events }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheet>(null);
    const logHistory = useSelector(selectedEventRedemptions);
    const event = useSelector<RootState>(x => x.auth.selectedEvent) as Event;
    const [log, setLog] = useState([] as Redemption[]);
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
      onClose && onClose();
    }, []);
    useEffect(() => {
      if (logHistory.length > 0 && events) {
        const filtered = logHistory.filter(x => 
          x.redeemableEventIds?.some(rid => events.some(e => rid === e.id)) || 
          x.eventIds?.some(rid => events.some(e => rid === e.id)));
        setLog(filtered);
      } else {
        setLog([]);
      }

      return () => {};
    }, [events, logHistory]);

    useEffect(() => {
    }, [logHistory]);
    return (
      <BottomSheet
        ref={bottomSheetModalRef}
        index={-1}
        snapPoints={animatedSnapPoints}
        handleHeight={animatedHandleHeight}
        contentHeight={animatedContentHeight}
        style={style.container}
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
              Previous Scans
            </Text>
            <FlatList
              style={{ flex: 1, flexGrow: 1 }}
              data={log}
              keyExtractor={(item, index) => `${item.id}_${index}`}
              renderItem={item => <RedemptionRow redemption={item.item} />}
              ListEmptyComponent={<Text textAlign='center'>No Previous Scans</Text>}
            />
          </Box>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);
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
const RedemptionLogBottomSheet = memo(RedemptionLogBottomSheetComponent);
export default RedemptionLogBottomSheet;
