import React, { Component } from 'react';
import { View, Text, StyleProp, ViewProps } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import IconView, {
  FontAwesome5IconProps,
} from 'react-native-vector-icons/FontAwesome5';

interface ButtonProps extends ViewProps {
  name: string;
  onPress?: () => any;
  size?: number;
}
export const Icon = ({ ...props }: FontAwesome5IconProps): JSX.Element => {
  return <IconView {...props} />;
};
export const IconButton: React.VFC<ButtonProps> = ({
  name,
  size = 30,
  ...props
}) => {
  return (
    <TouchableOpacity {...props}>
      <Icon name={name} size={size} />
    </TouchableOpacity>
  );
};

export default IconButton;
