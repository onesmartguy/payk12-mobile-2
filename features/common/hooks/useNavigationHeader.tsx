import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Image, StyleSheet, Dimensions, StyleProp, View } from 'react-native';
import {
  NavigationProp,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { faArrowLeft, faBars } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { isEmpty } from 'lodash';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { DrawerNavigationOptions } from '@react-navigation/drawer';
import { StackScreenProps } from '@react-navigation/stack';
import { backgroundColor } from '@shopify/restyle';

import { Images } from '../../../assets';
import { Box, Text, palette } from '../../../ui';

const win = Dimensions.get('screen');
const iconWidth = win.width / 5;
const getHeaderLogo = () => (
  <Box
    width={iconWidth * 3}
    height={42}
    alignItems="center"
    justifyContent="center"
    paddingVertical="xxs"
    backgroundColor="error"
  >
    <Image
      source={Images.logo}
      style={{
        flex: 1,
        resizeMode: 'contain',
        alignSelf: 'center',
      }}
    />
  </Box>
);
export const getHeaderRight = (toggle: any) => {
  return (
    <Box width={iconWidth} backgroundColor="error">
      {toggle && (
        <Box onTouchEnd={() => toggle()} alignSelf="center">
          <FontAwesomeIcon icon={faBars} size={23} />
        </Box>
      )}
    </Box>
  );
};

export const getOptions = (
  navProps: any,
): NativeStackNavigationOptions | NativeStackNavigationOptions => {
  const state = navProps?.navigation?.getState();
  const parent = navProps?.navigation?.getParent();
  
  const parentGoBack = parent?.canGoBack ? parent?.goBack : null;
  const RightIcon = getHeaderRight(
    state.type === 'drawer'
      ? navProps?.navigation?.toggleDrawer
      : parent && parent?.getState()?.type === 'drawer'
      ? parent.toggleDrawer
      : null,
  );
  const LeftIcon = getHeaderLeft(parentGoBack);
  const HeaderLogo = getHeaderLogo();
  const style = StyleSheet.create({
    header: {
      backgroundColor: palette.blue,
    },
  });
  return {
    headerTitle: () => HeaderLogo,
    headerLeft: () => LeftIcon,
    headerRight: () => RightIcon,
    headerShown: true,
  };
};

export const getHeaderLeft = (goBack: () => void) => {
  return (
    <Box
      width={iconWidth}
      justifyContent="center"
      alignItems="center"
      backgroundColor="error"
    >
      {goBack && (
        <Box onTouchEnd={() => goBack()} alignSelf="center">
          <FontAwesomeIcon icon={faArrowLeft} size={23} />
        </Box>
      )}
    </Box>
  );
};
