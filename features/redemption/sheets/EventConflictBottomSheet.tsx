import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  ReactElement,
} from 'react';
import BottomSheet, {
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle} from '@fortawesome/pro-regular-svg-icons';
import {ScrollView} from 'react-native-gesture-handler';
import {map} from 'lodash';

import {palette} from '../../../ui/theme';
import {Event, Ticket, CheckboxItem, BottomSheetProps} from '../../common/types';
import {
  Box,
  Text,
  Button,
  TextInputField,
  RadioFieldOption,
  RadioField,
  CheckboxField,
} from '../../../ui';

import {CommonStyles} from '../../common/sheets/style';

interface EventConflictBottomSheetProps extends BottomSheetProps {
  onSelect: (event: Event) => void;
  events: Event[];
  onClose?: () => void;
}

export type EventConflictSheet = {
  show: (context: React.ReactElement) => void;
  close: () => void;
};


const EventConflictBottomSheetComponent = forwardRef<
EventConflictSheet,
EventConflictBottomSheetProps
>(({onClose, onSelect, events, ...props}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [state, setState] = useState<ReactElement>();

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  // callbacks
  const show = (context: React.ReactElement) => {
    setState(context);
    bottomSheetRef.current?.snapToIndex(0);
  };

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
    onClose && onClose();
  }, []);

  useImperativeHandle(ref, () => ({
    show,
    close,
  }));

  if(!events || !state || !onSelect)
    return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose
      style={CommonStyles.container}
      {...props}>
      <BottomSheetView onLayout={handleContentLayout}>
        {state}
      </BottomSheetView>
    </BottomSheet>
  );
});

const EventConflictBottomSheet = memo(EventConflictBottomSheetComponent);
export default EventConflictBottomSheet;
