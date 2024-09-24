import { View, ActivityIndicator } from 'react-native';
import React from 'react';

import { Box, Text } from '../ui';
import { palette } from '../ui/theme';

interface Props {
  loadingText?: string;
  color?: string;
}
const LoadingBlock: React.FC<Props> = ({
  loadingText = 'Loading',
  color = palette.darkBlue,
}) => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <ActivityIndicator size={48} color={color} />
      {loadingText && (
        <Text variant="loading" color="primaryIcon">
          {loadingText}
        </Text>
      )}
    </Box>
  );
};

export default LoadingBlock;
