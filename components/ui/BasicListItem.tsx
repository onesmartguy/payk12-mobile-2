import React, { memo } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';

import Box  from '@/ui/Box';
import TextView from '@/ui/TextView';

export const BasicListItem = memo(
  ({ label, onPress }: { label: string; onPress?: () => any }) => {
    return (
      <TouchableOpacity onPress={onPress}>
        <Box
          borderBottomWidth={1}
          borderColor="listDividerColor"
          paddingBottom="lg"
          paddingTop="2xl"
        >
          <TextView variant="header">{label}</TextView>
        </Box>
      </TouchableOpacity>
    );
  },
);

export default BasicListItem;
