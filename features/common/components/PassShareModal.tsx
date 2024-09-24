import { Image, TouchableOpacity } from 'react-native';
import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import {
  faExclamationTriangle,
  faTimes,
} from '@fortawesome/pro-regular-svg-icons';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { map } from 'lodash';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from '../../../ui/theme';
import { Pass } from '../types';
import { eventSection } from '../../../utils/EventUtils';
import {
  Box,
  Text,
  Button,
  TextInputField,
  RadioFieldOption,
  RadioField,
} from '../../../ui';

interface Props {
  show?: (pass: Pass) => void;
  close?: () => void;
}
const initalState = {
  email: '',
  tickets: [],
  sent: false,
};
type FormData = typeof initalState;
const radioOptions: RadioFieldOption[] = [
  { name: 'All events', value: 'All events' },
  { name: 'Choose events', value: 'Choose events' },
];
interface BottomSheetModalProps {
  onSubmit?: (data: FormData) => void;
  onClose?: () => void;
}

const PassShareModalComponent = forwardRef<Props, BottomSheetModalProps>(
  ({ onSubmit, onClose }, ref) => {
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [pass, setPass] = useState<Pass>();
    const [state, setState] = useState(initalState);
    const [chooseEvents, setChooseEvents] = useState('All events');
    const { bottom } = useSafeAreaInsets();
    useImperativeHandle(ref, () => ({
      show,
      close,
    }));
    // variables
    const snapPoints = useMemo(
      () => ['25%', state.sent ? '25%' : '85%'],
      [state.sent],
    );

    // callbacks
    const show = useCallback((selectedPass: Pass) => {
      setState(initalState);
      if (selectedPass) {
        setPass(selectedPass);
      }
      bottomSheetModalRef.current?.present();
    }, []);
    const close = useCallback(() => {
      bottomSheetModalRef.current?.close();
      onClose && onClose();
    }, []);

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: palette.blueGrayBackground }}
      >
        {pass && (
          <Box marginHorizontal="lg" style={{ paddingBottom: bottom }}>
            {!state.sent && (
              <>
                <Box>
                  <Text variant="header2" fontSize={18}>
                    {pass.name}
                  </Text>
                  <Text>
                    ({pass.events.length}) Ticket
                    {pass.events.length > 1 && 's'}
                  </Text>
                </Box>
                <Box>
                  <Box marginTop="m">
                    <Text>
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        style={{ marginRight: 12 }}
                        color={palette.red}
                      />
                      Your ticket(s) will be invalid after sharing them from
                      this screen.
                    </Text>
                  </Box>

                  <Text marginTop="m">
                    The new ticket holder(s) will receive an email with the new
                    ticket(s). You may revoke this transfer at any time.
                  </Text>

                  <Text marginTop="m" variant="header2" fontSize={18}>
                    Send to:
                  </Text>
                  <TextInputField
                    placeholder="Email"
                    value={state.email}
                    onChange={val => setState(s => ({ ...s, email: val }))}
                  />
                  <RadioField
                    options={radioOptions}
                    value={chooseEvents}
                    onChange={value => {
                      setChooseEvents(value);
                    }}
                    marginTop="m"
                  />
                  <ScrollView>
                    {chooseEvents === 'Choose events' && (
                      <Box>
                        <Text
                          marginVertical="m"
                          variant="header2"
                          fontSize={14}
                        >
                          Select one or more events:
                        </Text>
                        {pass.events &&
                          map(pass.events, item => (
                            <Box key={`k-${item.id}`}>
                              <Box marginLeft="lg">
                                <Text variant="rowHeader" fontSize={14}>
                                  {item.name}
                                </Text>
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    )}
                    <Box marginTop="xl">
                      <Button
                        variant="primary"
                        label={`Share ${
                          state.tickets.length > 1
                            ? `(${state.tickets.length})`
                            : ''
                        } Ticket${state.tickets.length > 1 ? 's' : ''}`}
                        disabled={!(state.tickets.length > 0 && state.email)}
                        onPress={() => onSubmit && onSubmit(state)}
                      />
                      <Button label="Cancel Sharing" onPress={close} />
                    </Box>
                  </ScrollView>
                </Box>
              </>
            )}
            {state.sent && (
              <Box alignItems="center" justifyContent="center">
                <Text variant="header2" fontSize={18}>
                  Ticket(s) successfully sent to
                </Text>
                <Text color="infoText">{state.email}</Text>
                <Box marginTop="lg" onTouchEnd={close}>
                  <FontAwesomeIcon icon={faTimes} />
                </Box>
              </Box>
            )}
          </Box>
        )}
      </BottomSheetModal>
    );
  },
);

export const PassShareModal = PassShareModalComponent;
export type PassShareModal = typeof PassShareModal;
export default PassShareModal;
