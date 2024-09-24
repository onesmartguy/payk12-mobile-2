import React from 'react';
import { View as ViewRN, StyleProp, ViewStyle } from 'react-native';

export const View: React.FC<{ style?: StyleProp<ViewStyle> }> = ({
  children,
  style,
}) => {
  return <ViewRN style={style}>{children}</ViewRN>;
};

export default View;
