import React from 'react';
import { faArrowLeft, faBars } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Image } from 'react-native';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import { BoxProps } from '@shopify/restyle';

import { Images } from '@/assets';
import { Box } from '@/ui/Box';
import { Theme } from '@/utils/theme';
import { useSessionStore } from '@/stores';

type HeaderMenuIcon = 'LeftArrow' | 'Menu';

type HeaderViewOptions = {
  onBackPress?: () => void;
  onLeftHeaderItemPressed?: () => any;
  leftHeaderIcon?: HeaderMenuIcon;
  onRightHeaderItemPressed?: () => any;
  rightHeaderIcon?: HeaderMenuIcon;
};
export const HeaderView: React.FC<HeaderViewOptions> = ({
  onBackPress,
  leftHeaderIcon = 'LeftArrow',
  onLeftHeaderItemPressed,
  onRightHeaderItemPressed,
  rightHeaderIcon = 'Menu',
}) => {
  const {user} = useSessionStore();
  const handleBackButton = () => {
    onBackPress && onBackPress();
  };
  return (
    <Box flexDirection="row" marginBottom="xl" marginTop="s">
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        onTouchEnd={() => handleBackButton()}
        alignSelf="stretch"
      >
        {onBackPress && (
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={24}
            style={{ marginBottom: 8 }}
          />
        )}
      </Box>
      <Box
        flex={4}
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
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
        onTouchEnd={() => user}
      >
        {user && (
          <TouchableOpacity>
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

export default HeaderView;
export type { HeaderViewOptions };
