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
import {Event, Ticket, CheckboxItem, BottomSheetProps} from '../types';
import {
  Box,
  Text,
  Button,
  TextInputField,
  RadioFieldOption,
  RadioField,
  CheckboxField,
} from '../../../ui';

import {CommonStyles} from './style';

interface BasicBottomSheetProps extends BottomSheetProps {
  onClose?: () => void;
}

export type BasicSheet = {
  show: (context: React.ReactElement) => void;
  close: () => void;
};


const BasicBottomSheetComponent = forwardRef<
BasicSheet,
BasicBottomSheetProps
>(({onClose, ...props}, ref) => {
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

  if(!state)
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

const BasicBottomSheet = memo(BasicBottomSheetComponent);
export default BasicBottomSheet;
