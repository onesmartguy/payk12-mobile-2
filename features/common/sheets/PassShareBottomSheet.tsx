import React, {
  useRef,
  useMemo,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import BottomSheet, {
  BottomSheetScrollView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle} from '@fortawesome/pro-regular-svg-icons/faExclamationTriangle';
import {orderBy} from 'lodash';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {palette} from '../../../ui/theme';
import {BottomSheetProps, Event, Pass} from '../types';
import {
  Box,
  Text,
  Button,
  TextInputField,
  RadioFieldOption,
  RadioField,
  CheckboxField,
} from '../../../ui';
import {getEventDateAsString} from '../../../utils/EventUtils';

import {CommonStyles} from './style';

export {CommonStyles} from './style';

interface PassShareBottomSheetProps extends BottomSheetProps {
  onClose?: () => void;
  onSubmit: (form: FormData) => void;
}
export type PassShareSheet = {
  show: (pass: Pass) => void;
  close: () => void;
};
const initalState = {
  email: '',
  events: [] as number[],
  transferPass: false,
  sent: false,
};
type FormData =   {
  email: string;
  events: number[];
  passId: number;
  transferPass: boolean;
}
const radioOptions: RadioFieldOption[] = [
  {name: 'All events', value: true},
  {name: 'Choose events', value: false},
];
const PassShareBottomSheetComponent = forwardRef<
  PassShareSheet,
  PassShareBottomSheetProps
>(({onClose, onSubmit, ...props}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [pass, setPass] = useState<Pass>();
  const [state, setState] = useState(initalState);
  const [transferAll, setTransferAll] = useState(true);

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);
  useImperativeHandle(ref, () => ({
    show,
    close,
  }));
  const {bottom: bottomSafeArea} = useSafeAreaInsets();
  // callbacks
  const show = (p: Pass) => {
    setState(initalState);
    setTransferAll(true);
    if (p) {
      setPass(p);
      setState({
        ...initalState,
        events: [],
      });
    }
    bottomSheetRef.current?.snapToIndex(0);
  };

  const close = () => {
    setState(initalState);
    setTransferAll(true);
    bottomSheetRef.current?.close();
    onClose && onClose();
  };
  const renderItem = (item: Event) => (
    <Box
      flexDirection="row"
      key={`k-${item.id}`}
      paddingVertical="s"
      borderBottomColor="darkGray"
      borderBottomWidth={1}
      onTouchEnd={() => {
        setState(s => {
          if (s.events.includes(item.id)) {
            s.events.splice(s.events.indexOf(item.id), 1);
          } else {
            s.events.push(item.id);
          }
          return {...s};
        });
      }}>
      <CheckboxField
        selected={state.events.includes(item.id)}
        alignSelf="center"
      />

      <Box marginLeft="lg">
        <Text variant="EventRowName" fontSize={20}>
          {item.name}
        </Text>
        <Text variant="EventRowTicketCount" fontSize={14}>
          {getEventDateAsString(item)}
        </Text>
      </Box>
    </Box>
  );

  if (!pass) return null;

  const orderedEvents = orderBy(pass.events.filter(x => x.isShareable), ['startTime']);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose
      style={{
        ...CommonStyles.container,
      }}
      {...props}>
      <Box onLayout={handleContentLayout}>
        {pass && (
          <Box
            flexGrow={1}
            paddingHorizontal="lg"
            style={{paddingBottom: bottomSafeArea}}>
            <Text variant="header2" fontSize={18}>
              {pass.name}
            </Text>
            <Text>
              ({orderedEvents.length}) Event
              {orderedEvents.length > 1 && 's'}
            </Text>

            <BottomSheetScrollView
              contentContainerStyle={{}}
              style={{flexGrow: 1, flexShrink: 1}}>
              <Box marginTop="m" flexDirection="column">
                <Text>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    style={{marginRight: 8}}
                    color={palette.yellow}
                  />
                  Your ticket(s) may not be available after sharing them from this
                  screen.
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
                onChange={val => setState(s => ({...s, email: val}))}
              />
              <RadioField
                options={radioOptions}
                value={transferAll}
                onChange={value => {
                  setTransferAll(value);
                }}
                marginVertical="lg"
              />
              {!transferAll && (
                <Box borderBottomColor="darkGray" borderBottomWidth={1}>
                  <Text variant="header2" fontSize={14} lineHeight={14}>
                    Select one or more tickets:
                  </Text>
                </Box>
              )}
              {!transferAll && (<Box flexGrow={1} flexShrink={1}>{orderedEvents.map(e => renderItem(e))}</Box>)}

              <Button
                variant="primary"
                label={`Share ${
                  state.events.length > 1 ? `(${state.events.length})` : ''
                } Ticket${state.events.length > 1 ? 's' : ''}`}
                disabled={
                  !((state.events.length > 0 || transferAll) && state.email)
                }
                onPress={() =>
                  onSubmit &&
                  onSubmit({
                    events: state.events,
                    transferPass: transferAll,
                    email: state.email,
                    passId: pass.id
                  })
                }
              />
              <Button label="Cancel Sharing" onPress={() => close()} />
            </BottomSheetScrollView>
          </Box>
        )}
      </Box>
    </BottomSheet>
  );
});

const PassShareBottomSheet = memo(PassShareBottomSheetComponent);
export default PassShareBottomSheet;
