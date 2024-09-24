import React from 'react';
import {StyleSheet} from 'react-native';

export const CommonStyles = StyleSheet.create({
  container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.45,
    shadowRadius: 3.5,

    elevation: 5,
  },
});
export default {CommonStyles};
