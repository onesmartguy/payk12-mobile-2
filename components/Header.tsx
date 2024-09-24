import React from 'react';
import { faArrowLeft, faBars } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';
import { BoxProps } from '@shopify/restyle';

import { Images } from '../assets';
import { Box } from '../ui';
import { signOut, useCurrentUser } from '../features/auth/authSlice';
import { StackParamList } from '../navigation';
import { Theme } from '../ui/theme';

interface HeaderProps extends BoxProps<Theme> {
  onBackPress?: () => void;
}
export const Header: React.FC<HeaderProps> = ({ onBackPress, ...props }) => {
  const user = useCurrentUser();
  const navigation = useNavigation<DrawerNavigationProp<StackParamList>>();
  const dispatch = useDispatch();
  return (
    <Box flexDirection="row" marginBottom="3xl" marginTop="s" {...props}>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        onTouchEnd={() => onBackPress && onBackPress()}
      >
        {onBackPress && (
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faArrowLeft}
              size={24}
              style={{ marginBottom: 8 }}
            />
          </TouchableOpacity>
        )}
      </Box>
      <Box
        flex={4}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
      >
        <Image
          source={Images.logo}
          style={{ height: 40, resizeMode: 'contain' }}
        />
      </Box>
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        onTouchEnd={() => user && navigation.openDrawer()}
      >
        {user && (
          <TouchableOpacity onPress={() => navigation.openDrawer()}>
            <FontAwesomeIcon
              icon={faBars}
              size={24}
              style={{ marginBottom: 8 }}
            />
          </TouchableOpacity>
        )}
      </Box>
    </Box>
  );
};

export default Header;
