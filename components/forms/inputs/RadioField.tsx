import React, { Component, useState, useEffect } from 'react';

import { faCircle } from '@fortawesome/pro-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons/faCheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { map } from 'lodash';
import { BoxProps } from '@shopify/restyle';

import { Box } from '@/ui/Box';
import { TextView } from '@/ui/TextView';
import { palette, Theme } from '../../../utils/theme';
import IconView from '@/components/ui/IconView';

interface Props extends BoxProps<Theme> {
  name?: string;
  options: RadioFieldOption[];
  onChange?: (value: any) => any;
  direction?: 'vertical' | 'horizontal';
  value?: object | string | boolean | number;
}

export type RadioFieldOption = {
  name: string;
  value: object | string | boolean | number;
};
export const RadioField: React.VFC<Props> = ({
  name,
  onChange,
  value,
  options = [],
  direction = 'horizontal',
  ...props
}) => {
  const [selectedValue, setSelectedValue] = useState(value);

  useEffect(() => {
    if (onChange) onChange(selectedValue);
  }, [selectedValue]);

  const flexDirection = direction === 'horizontal' ? 'row' : 'column';

  return (
    <Box flexDirection={flexDirection} {...props}>
      {options &&
        map(options, (o, i) => {
          const icon = selectedValue === o.value ? faCheckCircle : faCircle;
          return (
            <Box
              flex={1}
              flexDirection="row"
              key={`${o.name}_${i}`}
              onTouchEnd={() => {
                setSelectedValue(o.value);
              }}
              alignItems="center"
            >
              <IconView
                icon={icon as any}
                size={24}
                color={palette.darkBlue}
              />
              <TextView marginLeft="xxs">{o.name}</TextView>
            </Box>
          );
        })}
    </Box>
  );
};

export default RadioField;
