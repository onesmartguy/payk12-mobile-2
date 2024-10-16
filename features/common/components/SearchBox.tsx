import PropTypes from 'prop-types';
import { useTheme } from '@shopify/restyle';
import React from 'react';
import { TextInput } from 'react-native';
import { faFilter } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { Box } from '@/features/common/components/Box';
import { Theme } from '../../../utils/theme';

interface Props {
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  onSearch?: (value: string) => void;
}

const SearchBox = ({
  placeholder,
  onChange,
  value,
  onSearch,
  ...rest
}: Props) => {
  const theme = useTheme<Theme>();

  return (
    <Box
      flexDirection="row"
      borderBottomColor="textInputBorderColor"
      borderBottomWidth={1}
    >
      <Box padding="m">
        <FontAwesomeIcon
          icon={faFilter}
          size={20}
          color={theme.colors.textInputIcon}
        />
      </Box>

      <TextInput
        onChangeText={onChange}
        value={value}
        style={{ borderWidth: 0, flex: 1 }}
        placeholder={placeholder ?? 'Search'}
        placeholderTextColor={theme.colors.textInputPlaceholder}
        autoCapitalize="none"
        keyboardType="web-search"
        blurOnSubmit
        returnKeyType="search"
        onSubmitEditing={({ nativeEvent: { text } }) =>
          onSearch && onSearch(text)
        }
        clearButtonMode="while-editing"
      />
    </Box>
  );
};

export default SearchBox;
