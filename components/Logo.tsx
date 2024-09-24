import { Image, Text } from 'react-native';
import React from 'react';

import Box from '../ui/Box';
import { Images } from '../assets';

const Logo = () => {
  return (
    <Box>
      <Image source={Images.logo} />
    </Box>
  );
};

export default Logo;
