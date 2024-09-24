import React from 'react';
import {
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  spacing,
  border,
  backgroundColor,
  composeRestyleFunctions,
  useRestyle,
} from '@shopify/restyle';
import { RectButton, RectButtonProps } from 'react-native-gesture-handler';

import { Theme } from '../utils/theme';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme>;

const restyleFunctions = composeRestyleFunctions<Theme, RestyleProps>([
  spacing,
  border,
  backgroundColor,
]);

type Props = RestyleProps & RectButtonProps;

const Button = ({ onPress, ...rest }: Props) => {
  const props = useRestyle(restyleFunctions, rest);

  return <RectButton onPress={onPress} {...rest} />;
};
