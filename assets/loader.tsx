import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Circle, Svg} from 'react-native-svg';

import {Box} from '../ui';

interface Props {
  color: string;
}
export const Loader: React.FC<Props> = ({color = '#000'}) => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Svg id="L5" x="0px" y="0px" viewBox="0 0 100 100">
        <Circle fill={color} stroke="none" cx="6" cy="50" r="6">
          {/* <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 15 ; 0 -15; 0 15"
          repeatCount="indefinite"
          begin="0.1"
        /> */}
        </Circle>
        <Circle fill={color} stroke="none" cx="30" cy="50" r="6">
          {/* <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 10 ; 0 -10; 0 10"
          repeatCount="indefinite"
          begin="0.2"
        /> */}
        </Circle>
        <Circle fill={color} stroke="none" cx="54" cy="50" r="6">
          {/* <animateTransform
          attributeName="transform"
          dur="1s"
          type="translate"
          values="0 5 ; 0 -5; 0 5"
          repeatCount="indefinite"
          begin="0.3"
        /> */}
        </Circle>
      </Svg>
    </Box>
  );
};

export default Loader;
