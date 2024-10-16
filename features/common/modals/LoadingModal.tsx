import * as React from 'react';
import { ActivityIndicator } from 'react-native';

import { Box } from '@/features/common/components/Box';
import { palette } from '@/utils/theme';

interface Props {}
export const LoadingModal: React.FC<Props> = () => {
  return (
    <Box
      flex={1}
      alignItems="center"
      justifyContent="center"
      backgroundColor="white"
    >
      <ActivityIndicator size={48} color={palette.darkBlue} />
    </Box>
  );
};

export default LoadingModal;
