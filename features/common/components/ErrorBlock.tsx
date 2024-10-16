import { View, ActivityIndicator, useWindowDimensions } from 'react-native';
import React from 'react';

import { Box, Text } from '../ui';
import { palette } from '../ui/theme';

interface Props {
  loadingText?: string;
  color?: string;
  error?: any;
}
const ErrorBlock: React.FC<Props> = ({
  loadingText = 'Oops! We could not complete your action. Please try again.',
  color = palette.blue,
  error,
}) => {
  const { width } = useWindowDimensions();
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Box maxWidth={width * 0.6}>
        <Text variant="loading" color="primaryIcon">
          {loadingText}
        </Text>
      </Box>
    </Box>
  );
};

export default ErrorBlock;
