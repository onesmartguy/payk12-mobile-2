import React from 'react';
import { faCircle } from '@fortawesome/pro-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { BoxProps } from '@shopify/restyle';

import { Box } from '@/ui/Box';
import { palette, Theme } from '@/utils/theme';

interface Props extends BoxProps<Theme> {
  onChange?: (isSelected: any) => any;
  selected?: boolean;
  size?: number;
}

export const CheckboxField: React.FC<Props> = ({
  onChange,
  selected,
  size = 24,
  ...props
}) => {
  return (
    <Box
      onTouchEnd={() => {
        onChange && onChange(!selected);
      }}
      {...props}
    >
      <FontAwesomeIcon
        icon={(selected ? faCheckCircle : faCircle) as any}
        size={size}
        color={palette.darkBlue}
      />
    </Box>
  );
};

export default CheckboxField;
