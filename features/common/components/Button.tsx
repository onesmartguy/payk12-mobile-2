import PropTypes from 'prop-types';
import {
  createVariant,
  useTheme,
  SpacingProps,
  BorderProps,
  BackgroundColorProps,
  useRestyle,
  TypographyProps,
  composeRestyleFunctions,
} from '@shopify/restyle';
import React from 'react';
import {
  ActivityIndicator,
  GestureResponderEvent,
  TouchableOpacity,
} from 'react-native';


import { TextView } from './TextView';
import { Box } from './Box';
import { Theme } from '@/utils/theme';

const restyleButtonFunctions = composeRestyleFunctions<Theme, any>([
  createVariant<Theme>({ themeKey: 'buttonVariants' }),
]);
const restyleTextFunctions = composeRestyleFunctions<Theme, any>([
  createVariant<Theme>({ themeKey: 'textVariants' }),
]);
type Props = SpacingProps<Theme> &
  BorderProps<Theme> &
  TypographyProps<Theme> &
  BackgroundColorProps<Theme> & {
    onPress: (event: GestureResponderEvent) => void;
    label: string;
    isLoading?: boolean;
    disabled?: boolean;
    variant?: 'default' | 'primary' | 'secondary' | 'success' | 'success-sm';
  };

const Button = ({
  label,
  onPress,
  isLoading,
  disabled,
  variant = 'default',
  fontSize,
  ...rest
}: Props) => {
  const theme = useTheme<Theme>();
  const styles = {
    buttonVariant: 'defaults',
    textVariant: 'button',
  };
  switch (variant) {
    case 'primary':
      styles.buttonVariant = 'primary';
      styles.textVariant = 'buttonAlt';
      break;
    case 'secondary':
      styles.buttonVariant = 'secondary';
      styles.textVariant = 'buttonAlt';
      break;

    case 'success':
      styles.buttonVariant = 'success';
      styles.textVariant = 'buttonSmallAlt';
      break;
    case 'success-sm':
      styles.buttonVariant = 'success';
      styles.textVariant = 'buttonSmallerAlt';
      break;
  }
  const boxStyles = useRestyle(restyleButtonFunctions as any, {
    variant: disabled === true ? 'disabled' : styles.buttonVariant,
  });
  const textStyles = useRestyle(restyleTextFunctions as any, {
    variant: styles.textVariant,
  });
  const handleOnPress = disabled ? undefined : onPress;
  return (
    <TouchableOpacity onPress={handleOnPress}>
      <Box
        justifyContent="center"
        marginVertical="s"
        marginHorizontal="s"
        paddingVertical="s"
        flexDirection="row"
        borderRadius={45}
        {...boxStyles}
        {...rest}
      >
        <TextView
          textTransform="uppercase"
          {...(textStyles as any)}
          fontSize={fontSize}
          numberOfLines={1}
        >
          {label}
        </TextView>
        {isLoading ? <ActivityIndicator style={{ marginLeft: 4 }} /> : null}
      </Box>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  color: PropTypes.any,
  isLoading: PropTypes.any,
  label: PropTypes.any,
};

export default Button;
