import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
  ReactElement,
  Children,
} from 'react';


import {CommonStyles} from './style';
import BottomSheet, { BottomSheetProps, BottomSheetView } from '@gorhom/bottom-sheet';

interface BasicBottomSheetProps extends BottomSheetProps {
  onClose?: () => void;
}

// export type BasicSheet = {
//   show: (context: React.ReactElement) => void;
//   close: () => void;
// };


const BasicBottomSheetComponent = forwardRef<
Partial<BottomSheet>,
Partial<BasicBottomSheetProps>
>(({onClose, children, ...props}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [state, setState] = useState<ReactElement>();

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);


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
    expand: () => bottomSheetRef.current?.expand(),
    collapse: () => bottomSheetRef.current?.collapse(),
    snapToIndex: (index: number) => bottomSheetRef.current?.snapToIndex(index),
    close: () => bottomSheetRef.current?.close(),
  }));

  if(!state)
    return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing
      enablePanDownToClose
      style={CommonStyles.container}
      {...props}>
        {state ?? children}
    </BottomSheet>
  );
});

export default BasicBottomSheetComponent;
