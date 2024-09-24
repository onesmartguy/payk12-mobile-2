import React, { useState } from 'react';
import {
  ThemeProvider as ReThemeProvider,
  createTheme,
} from '@shopify/restyle';

import { Platform } from 'react-native';

const pxToNumber = (px: string) => {
  return parseInt(px.replace('px', ''), 10);
};

export const palette = {
  transparent: 'transparent',
  current: 'currentColor',
  lightBlue: '#CEDEE8',
  lightPurple: '#D9DBE8',
  lighterGray: '#F4F5FA',
  lightGray: '#CED6E0',
  blue: '#5F94B4',
  white: '#ffffff',
  yellow: '#E6C15D',
  green: '#41B174',
  black: '#2F2D2D',
  red: '#EB0202',
  gray: '#98A1AD',
  darkGray: '#576272',
  darkBlue: '#10224B',
  orange: '#F46932',
  blueGray: '#73768D',
  darkGrayBlue: '#10224B',
  blueGrayBackground: '#F2F5F8',

  transparentWhite: 'rgba(255,255,255,0.89)',
};
const type = (family = 'Gibson') => {
  return {
    normal: {
      fontFamily: Platform.select({
        ios: family,
        android: `${family}`,
      }),
      fontWeight: Platform.select({ ios: undefined, android: undefined }),
    },
    semiBold: {
      fontFamily: Platform.select({
        ios: family,
        android: `${family}-SemiBold`,
      }),
      fontWeight: Platform.select({ ios: '600', android: undefined }),
    },
    bold: {
      fontFamily: Platform.select({ ios: family, android: `${family}-Bold` }),
      fontWeight: Platform.select({ ios: '700', android: undefined }),
    },
    light: {
      fontFamily: Platform.select({ ios: family, android: `${family}-Light` }),
      fontWeight: Platform.select({ ios: '400', android: undefined }),
    },
  };
};
const theme = createTheme({
  spacing: {
    xxs: 4,
    xs: 8,
    s: 12,
    m: 16,
    lg: 24,
    xl: 32,
    '2xl': 40,
    '3xl': 60,
  },
  borderRadii: undefined,
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.darkGray,

    primaryCardBackground: palette.white,
    secondaryCardBackground: palette.lighterGray,
    primaryIcon: palette.blue,
    secondaryIcon: palette.darkGray,

    primaryButtonBackground: palette.darkBlue,
    primaryButtonBorder: palette.darkBlue,

    primaryButton: palette.darkBlue,
    secondaryButton: palette.blue,
    successButton: palette.green,
    criticalButton: palette.darkBlue,
    disabledButton: palette.darkGray,
    lightBlueNotice: palette.lightBlue,
    transparentButtonBackground: palette.transparent,
    error: palette.red,
    primaryText: palette.blueGray,
    infoText: palette.blue,
    secondaryText: palette.black,
    bodyText: palette.blueGray,
    titleText: palette.darkGray,
    headerText: palette.darkGrayBlue,
    primaryButtonText: palette.darkBlue,
    secondaryButtonText: palette.white,
    textInputPlaceholder: palette.gray,
    textInputIcon: palette.blue,
    textInputBorderColor: palette.gray,
    listDividerColor: palette.lightGray,
    listSectionBackgroudColor: palette.lightGray,
    listSectionTextColor: palette.lightGray,

    cardBackground: palette.lightGray,
    ticketCardBackground: palette.lighterGray,
    ...palette,
    loadingIndicator: palette.darkGrayBlue,
    loadingBackGround: palette.transparentWhite,
  },
  breakpoints: {},
  raduii: {},
  textVariants: {
    defaults: {
      fontSize: 16,
      lineHeight: 19,
      color: 'primaryText',
      ...type('Gibson').normal,
      // reg
    },
    title: {
      fontSize: 26,
      lineHeight: 35,
      ...type('Gibson').semiBold,
      color: 'titleText',
      marginBottom: 'lg',
      // SemiBold
    },
    header: {
      fontSize: 24,
      lineHeight: 24,
      color: 'headerText',
      ...type('Gibson').semiBold,
      // SemiBold
    },
    sectionHeader: {
      fontSize: 18,
      lineHeight: 25,
      color: 'headerText',
      ...type('Gibson').semiBold,
      // SemiBold
    },
    rowHeader: {
      fontSize: 22,
      lineHeight: 29,
      color: 'headerText',
      ...type('Gibson').semiBold,
      // SemiBold
    },

    header2: {
      fontSize: 20,
      lineHeight: 26,
      color: 'headerText',
      ...type('Gibson').semiBold,
      // SemiBold
    },
    row: {
      fontSize: 18,
      lineHeight: 22,
      color: 'headerText',
      // reg
    },
    rowBlack: {
      fontSize: 18,
      lineHeight: 22,
      color: 'black',
      // reg
    },
    rowDetails: {
      fontSize: 14,
      lineHeight: 17,
      color: 'primaryText',
      // reg
    },
    rowDetailsBlue: {
      fontSize: 14,
      lineHeight: 17,
      color: 'infoText',
      ...type('Gibson').normal,
      // reg
    },
    error: {
      fontSize: 14,
      lineHeight: 18,
      color: 'mainForeground',
      ...type('Gibson').normal,
      // Reg
    },
    link: {
      fontSize: 14,
      lineHeight: 17,
      color: 'mainForeground',
      ...type('Gibson').semiBold,
      // SemiBold
    },
    menuIcon: {
      fontSize: 24,
      lineHeight: 24,
      color: 'primaryIcon',
      ...type('Gibson').semiBold,
      // SemiBold
    },
    menuIconAlt: {
      fontSize: 24,
      lineHeight: 24,
      color: 'secondaryIcon',
      ...type('Gibson').semiBold,
      // SemiBold
    },
    button: {
      fontSize: 18,
      lineHeight: 22,
      color: 'primaryButtonText',
      // fontFamily: 'Montserrat-Regular',
      // SemiBold
    },
    buttonAlt: {
      fontSize: 18,
      lineHeight: 22,
      color: 'secondaryButtonText',
      // SemiBold
    },
    buttonSmall: {
      fontSize: 16,
      lineHeight: 20,
      color: 'primaryButtonText',
      // SemiBold
    },
    buttonSmaller: {
      fontSize: 12,
      lineHeight: 16,
      color: 'primaryButtonText',
      // SemiBold
    },
    buttonSmallAlt: {
      fontSize: 16,
      lineHeight: 20,
      color: 'secondaryButtonText',
      // SemiBold
    },
    buttonSmallerAlt: {
      fontSize: 12,
      lineHeight: 16,
      color: 'secondaryButtonText',
      // SemiBold
    },
    loading: {
      fontSize: 18,
      lineHeight: 22,
      color: 'primaryText',
      // SemiBold
    },

    EventRowName: {
      fontSize: 22,
      lineHeight: 29,
      color: 'darkBlue',
      ...type('Gibson').light,
    },
    EventRowStartDate: {
      fontSize: 16,
      lineHeight: 22,
      color: 'gray',
    },
    EventRowTicketCount: {
      fontSize: 16,
      lineHeight: 17,
      color: 'blue',
    },
  },
  cardVariants: {
    primary: {
      backgroundColor: 'primaryCardBackground',
      shadowOpacity: 0.3,
    },
    secondary: {
      backgroundColor: 'secondaryCardBackground',
      shadowOpacity: 0.1,
    },
  },
  buttonVariants: {
    defaults: {
      borderColor: 'primaryButton',
      borderWidth: 1,
      borderStyle: 'solid',
    },
    primary: {
      backgroundColor: 'primaryButton',
      borderColor: 'primaryButton',
    },
    secondary: {
      backgroundColor: 'secondaryButton',
      borderColor: 'secondaryButton',
    },
    citical: {
      backgroundColor: 'criticalButton',
      borderColor: 'criticalButton',
    },
    success: {
      backgroundColor: 'successButton',
      borderColor: 'successButton',
    },

    disabled: {
      backgroundColor: 'disabledButton',
      borderColor: 'disabledButton',
    },
  },
});

const darkTheme: Theme = {
  ...theme,
};

export type Theme = typeof theme;
export default theme;
