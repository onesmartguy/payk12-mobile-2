import React, {
  useRef,
  useMemo,
  useCallback,
  useState,
  forwardRef,
  useImperativeHandle,
  memo,
} from 'react';
import BottomSheet, {
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faExclamationTriangle} from '@fortawesome/pro-regular-svg-icons';
import {ScrollView} from 'react-native-gesture-handler';
import {map} from 'lodash';

import {palette} from '../../../ui/theme';
import {Event, Ticket, CheckboxItem, BottomSheetProps} from '../types';
import {
  Box,
  Text,
  Button,
  TextInputField,
  RadioFieldOption,
  RadioField,
  CheckboxField,
} from '../../../ui';

import {CommonStyles} from './style';

export {CommonStyles} from './style';

interface TicketShareBottomSheetProps extends BottomSheetProps {
  onClose?: () => void;
  onSubmit: (form: FormData) => void;
}

export type TicketShareSheet = {
  show: (event: Event, tickets: Ticket[]) => void;
  close: () => void;
};
const initalState = {
  email: '',
  tickets: [] as CheckboxItem<Ticket>[],
  sent: false
};
type FormData = {
  email: string;
  tickets: number[];
  eventId: number;
};
const radioOptions: RadioFieldOption[] = [
  {name: 'All tickets', value: 'All tickets'},
  {name: 'Choose tickets', value: 'Choose tickets'},
];
const TicketShareBottomSheetComponent = forwardRef<
  TicketShareSheet,
  TicketShareBottomSheetProps
>(({onClose, onSubmit, ...props}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [event, setEvent] = useState<Event>();
  const [state, setState] = useState(initalState);
  const [chooseTickets, setChooseTickets] = useState('All tickets');

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  // callbacks
  const show = (evt: Event, tickets: Ticket[]) => {
    setState(initalState);
    if (evt) {
      setEvent(evt);
    }
    if (tickets) {
      setState({
        ...state,
        tickets: tickets.filter(x => x.isShareable).map(x => ({...x, isSelected: false})),
      });
    }

    bottomSheetRef.current?.snapToIndex(0);
  };

  const close = useCallback(() => {
    setState(initalState);
    setChooseTickets('All tickets')
    bottomSheetRef.current?.close();
    onClose && onClose();
  }, []);
  useImperativeHandle(ref, () => ({
    show,
    close,
  }));

  const selectedTickets = 
    chooseTickets == 'Choose tickets' ? 
      state.tickets.filter(x => x.isSelected).map(x => x.id) : 
      chooseTickets == 'All tickets' ? state.tickets.map(x => x.id) : []
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      enablePanDownToClose
      style={CommonStyles.container}
      {...props}>
      <BottomSheetView onLayout={handleContentLayout}>
        {event && (
          <Box margin="lg">
            {!state.sent && (
              <>
                <Box>
                  <Text variant="header2" fontSize={18}>
                    {event.name}
                  </Text>
                  <Text>
                    ({event.availibleTickets}) Ticket
                    {event.availibleTickets > 1 && 's'}
                  </Text>
                </Box>
                <Box>
                  <Box marginTop="m">
                    <Text>
                      <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        style={{marginRight: 12}}
                        color={palette.yellow}
                      />
                      Your ticket(s) may not be available after sharing them from
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
                    onChange={val => setState(s => ({...s, email: val}))}
                  />
                  <RadioField
                    options={radioOptions}
                    value={chooseTickets}
                    onChange={value => {
                      setChooseTickets(value);
                    }}
                    marginTop="m"
                  />
                  <ScrollView>
                    {chooseTickets === 'Choose tickets' && (
                      <Box>
                        <Box
                          borderBottomColor="darkGray"
                          borderBottomWidth={1}
                          marginTop="lg">
                          <Text variant="header2" fontSize={14} lineHeight={14}>
                            Select one or more tickets:
                          </Text>
                        </Box>
                        {state.tickets &&
                          map(state.tickets, (item, i) => (
                            <Box
                              flexDirection="row"
                              key={`k-${item.id}`}
                              paddingVertical="s"
                              borderBottomColor="darkGray"
                              borderBottomWidth={1}>
                              <CheckboxField
                                selected={item.isSelected}
                                onChange={() => {
                                  state.tickets[i].isSelected =
                                    !state.tickets[i].isSelected;
                                  setState(s => ({...s}));
                                }}
                                alignSelf="center"
                              />

                              <Box marginLeft="lg">
                                <Text variant="EventRowName" fontSize={20}>
                                  {item.ownerName}
                                </Text>
                                <Text
                                  variant="EventRowTicketCount"
                                  fontSize={14}>
                                  Ticket #{item.ticketNumber}
                                </Text>
                                {item.seat && (
                                  <Text
                                    variant="EventRowStartDate"
                                    fontSize={14}>
                                    Sec: {item.section}
                                    {'  '} Row: {item.row}
                                    {'  '}
                                    Seat:
                                    {item.seat}
                                  </Text>
                                )}
                              </Box>
                            </Box>
                          ))}
                      </Box>
                    )}
                    <Box marginTop="2xl">
                      <Button
                        variant="primary"
                        label={`Share ${
                          selectedTickets.length > 1
                            ? `(${selectedTickets.length})`
                            : ''
                        } Ticket${selectedTickets.length > 1 ? 's' : ''}`}
                        disabled={!(state.email && selectedTickets.length > 0)}
                        onPress={() =>
                          onSubmit &&
                          onSubmit({
                            ...state,
                            tickets: selectedTickets,
                            eventId: event.id
                          })
                        }
                      />
                      <Button label="Cancel Sharing" onPress={close} />
                    </Box>
                  </ScrollView>
                </Box>
              </>
            )}
          </Box>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

const TicketShareBottomSheet = memo(TicketShareBottomSheetComponent);
export default TicketShareBottomSheet;
