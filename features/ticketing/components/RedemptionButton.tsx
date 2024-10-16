import React, { createRef, useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import { StyleSheet } from 'react-native';
import Box from '@/common/components/Box';


interface RedemptionButtonProps {
  onPress?: () => void;
}

export const RedemptionButton: React.FC<RedemptionButtonProps> = ({
  onPress,
}) => {
  const animationRef = createRef<LottieView>();
  const [timer, setTimer] = useState<NodeJS.Timeout>();
  useEffect(() => {
    // animationRef.current?.play();
  }, []);
  const onButtonPress = () => {
    animationRef.current?.play();

    const timer = setTimeout(() => {
      if (onPress) onPress();
    }, 2000);
    setTimer(timer);
  };
  const onButtonPressEnd = () => {
    animationRef.current?.reset();
    if (timer) {
      clearTimeout(timer);
    }
  };
  return (
    <Box flex={1} onTouchStart={onButtonPress} onTouchEnd={onButtonPressEnd}>
      <LottieView
        ref={animationRef}
        source={require('./HTR_Button_2.json')}
        style={{ height: '100%', width: '100%' }}
        autoPlay={false}
        loop={false}
      />
    </Box>
  );
};

export type RedemptionButton = typeof RedemptionButton;
export default RedemptionButton;
