import React, { Children, PropsWithChildren } from 'react';
import { faArrowLeft, faBars } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';

import { Images } from '@/assets';
import { Box } from '@/features/common/components/Box';
import useSessionStore from '@/auth/stores/useSessionStore';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerNavigationProps, DrawerParamList } from '../navigation';

type HeaderMenuIcon = 'LeftArrow' | 'Menu';

type HeaderViewOptions = {
  onBackPress?: (() => void) | null
  onLeftHeaderItemPressed?: () => any;
  leftHeaderIcon?: HeaderMenuIcon;
  onRightHeaderItemPressed?: () => any;
  rightHeaderIcon?: HeaderMenuIcon;
  safeArea?: boolean;
} & PropsWithChildren<{}>;

export const HeaderView: React.FC<HeaderViewOptions> = ({
  onBackPress,
  leftHeaderIcon = 'LeftArrow',
  onLeftHeaderItemPressed,
  onRightHeaderItemPressed,
  rightHeaderIcon = 'Menu',
  safeArea = true,
  children
}) => {
  const navigation = useNavigation<DrawerNavigationProps<DrawerParamList>>();
  const router = useRouter();
  const {user} = useSessionStore();
  const handleBackButton = () => {
    !!onBackPress && onBackPress();
  };
  const renderContent = () => (
    <Box flex={1}>
    <Box flexDirection="row" marginBottom="xl" marginTop="s">
      <Box
        flex={1}
        alignItems="center"
        justifyContent="center"
        onTouchEnd={handleBackButton}
        alignSelf="stretch"
      >
        {router.canGoBack()  && !!onBackPress && (
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
        onTouchEnd={() => navigation.openDrawer()}
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
    {children}
    </Box>
  );
  return safeArea ? (<SafeAreaView style={{ flex: 1 }}>{renderContent()}</SafeAreaView>) : renderContent();
};

export default HeaderView;
export type { HeaderViewOptions };
