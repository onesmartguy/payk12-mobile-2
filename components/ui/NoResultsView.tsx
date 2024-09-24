import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSchool, faCalendarStar } from '@fortawesome/pro-light-svg-icons';

import { palette } from '../../utils/theme';
import { Box } from '@/ui/Box';
import { TextView } from '@/ui/TextView';

interface Props {
  message?: string;
  color?: string;
  icon?: 'school' | 'event' | 'tickets' | undefined;
}
const NoResultsView: React.FC<Props> = ({
  message = 'No Results Found',
  color = palette.blue,
  icon = 'school',
}) => {
  const Icon =
    icon === 'school'
      ? faSchool
      : icon === 'event'
      ? faCalendarStar
      : undefined;
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      {Icon && <FontAwesomeIcon icon={Icon} size={72} color={color} />}
      <TextView marginTop="m" variant="loading" color="primaryIcon">
        {message}
      </TextView>
    </Box>
  );
};

export default NoResultsView;
