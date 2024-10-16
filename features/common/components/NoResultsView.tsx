import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSchool, faCalendarStar } from '@fortawesome/pro-light-svg-icons';

import { Box } from '@/features/common/components/Box';
import { TextView } from '@/features/common/components/TextView';
import { palette } from '@/utils/theme';
import { TicketIcon } from '@/assets';

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
  const Icon = () =>
    {
      if(icon === 'school')
      return (<FontAwesomeIcon icon={faSchool} size={72} color={color} />)
      if(icon === 'event')
       return (<FontAwesomeIcon icon={faCalendarStar} size={72} color={color} />)
      if(icon === 'tickets')
       return (<TicketIcon />)
      return (null);
}
  return (
    <Box flex={1} alignItems="center" justifyContent="center">
      <Icon />
      <TextView marginTop="m" variant="loading" color="primaryIcon">
        {message}
      </TextView>
    </Box>
  );
};

export default NoResultsView;
