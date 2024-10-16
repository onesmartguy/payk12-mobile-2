import { View, ActivityIndicator } from 'react-native';
import React from 'react';

import { Box } from '@/features/common/components/Box';
import { TextView } from '@/features/common/components/TextView';
import { palette } from '@/utils/theme';

interface Props {
  loadingText?: string;
  color?: string;
}
export const LoadingBlock: React.FC<Props> = ({
  loadingText = 'Loading',
  color = palette.blue,
}) => {
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <ActivityIndicator size="large" color={color} />
      {loadingText && <TextView variant="loading" color="primaryIcon">
        {loadingText}
      </TextView>}
    </Box>
  );
};

export default LoadingBlock;
