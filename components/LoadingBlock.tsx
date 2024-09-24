import { View, ActivityIndicator } from 'react-native';
import React from 'react';

import { Box } from '@/ui/Box';
import { TextView } from '@/ui/TextView';
import { palette } from '@/utils/theme';

interface Props {
  loadingText?: string;
  color?: string;
}
const LoadingBlock: React.FC<Props> = ({
  loadingText = 'Loading',
  color = palette.blue,
}) => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <ActivityIndicator size="large" color={color} />
      <TextView variant="loading" color="primaryIcon">
        {loadingText}
      </TextView>
    </Box>
  );
};

export default LoadingBlock;
