import PropTypes from 'prop-types';
import {
  createVariant,
  useTheme,
  BoxProps,
} from '@shopify/restyle';
import React from 'react';
import {
  TextInput,
  TextInputProps,
} from 'react-native';
import { faUser, faLock, faFilter } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


import { Box } from '@/features/common/components/Box';
import { Theme } from '@/utils/theme';
import { useField, useFormikContext } from 'formik';

const restyleFunctions = [createVariant({ themeKey: 'buttonVariants' })];
const restyleTextFunctions = [createVariant({ themeKey: 'textVariants' })];

type Props =  {
  name: string
  icon?: 'user' | 'search' | undefined;
} & BoxProps<Theme> & TextInputProps

const TextField: React.FC<Props> = ({
  name,
  icon,
  placeholder,
  ...props
}) => {
  const theme = useTheme<Theme>();

  const [field, meta, helpers] = useField(name)
  const { value, onChange, onBlur } = field;
  const { error, touched } = meta;

  const renderIcon = () => {
    if (props.secureTextEntry) return faLock;
    if (icon === 'search') return faFilter;
    if (icon === 'user') return faUser;
    return null;
  };

  return (
    <Box
      flexDirection="row"
      borderBottomColor="textInputBorderColor"
      borderBottomWidth={1}
      marginTop="m"
      {...props}
    >
      {renderIcon() && (
        <Box
          marginRight={icon == 'search' ? undefined : 's'}
          padding={icon == 'search' ? 's' : 'm'}
        >
          <FontAwesomeIcon
            icon={renderIcon() as any}
            size={20}
            color={theme.colors.textInputIcon}
          />
        </Box>
      )}
      <TextInput
        onChangeText={onChange(name)}
        value={value}
        style={{ borderWidth: 0, flex: 1 }}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textInputPlaceholder}
        secureTextEntry={props.secureTextEntry}
        autoCapitalize="none"
        onBlur={onBlur(name)}
        onKeyPress={() => {}}
        clearButtonMode="while-editing"
      />
    </Box>
  );
};

export default TextField;
