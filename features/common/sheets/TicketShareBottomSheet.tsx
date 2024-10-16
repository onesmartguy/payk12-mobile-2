import BottomSheet, { BottomSheetProps, BottomSheetView } from "@gorhom/bottom-sheet";
import { CheckboxItem, EventModel, TicketModel } from "../types";
import { forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import RadioField, { RadioFieldOption } from "../components/RadioField";
import { CommonStyles } from "./style";
import Box from "../components/Box";
import TextView from "../components/TextView";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons";
import { palette } from "@/utils/theme";
import { ScrollView } from "react-native";
import { map } from "lodash";
import CheckboxField from "../components/CheckboxField";
import Button from "../components/Button";
import TextField from "../components/TextField";
import { Formik } from "formik";


interface TicketShareBottomSheetProps extends Partial<BottomSheetProps> {
  onClose?: () => void;
  onSubmit: (form: FormData) => void;
}

export type TicketShareSheet = {
  show: (event: EventModel) => void;
  close: () => void;
};
const initalState = {
  email: '',
  tickets: [] as CheckboxItem<TicketModel>[],
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
export const TicketShareBottomSheet = forwardRef<
  TicketShareSheet,
  TicketShareBottomSheetProps
>(({onClose, onSubmit, ...props}, ref) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [event, setEvent] = useState<EventModel>();
  const [state, setState] = useState(initalState);
  const [chooseTickets, setChooseTickets] = useState('All tickets');

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);

  const handleClose = useCallback(() => {
    setState(initalState);
    setChooseTickets('All tickets')
    bottomSheetRef.current?.close();
    onClose && onClose();
  }, []);

  const handleShow = useCallback((evt: EventModel) => {
    setState(initalState);
      evt && setEvent(evt);
      evt.tickets &&
        setState({
          ...state,
          tickets: evt.tickets.filter(x => x.isShareable).map(x => ({...x, isSelected: false})),
        });
      bottomSheetRef.current?.snapToIndex(0);
  }, []);

  useImperativeHandle(ref, () => ({
    show: handleShow,
    close: handleClose,
  }));

  const selectedTickets = 
    chooseTickets == 'Choose tickets' ? 
      state.tickets.filter(x => x.isSelected).map(x => x.id) : 
      chooseTickets == 'All tickets' ? state.tickets.map(x => x.id) : []

  if(event == null){
    return null;
  }
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose
      enableDynamicSizing
      style={CommonStyles.container}
      {...props}>
       
      <BottomSheetView>
        {event && (
           <Formik initialValues={{email: ''}} onSubmit={() => {
            onSubmit({
              ...state,
              tickets: selectedTickets,
              eventId: event.id
            })
          }}>
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <Box margin="lg">
            {!state.sent && (
              <>
                <Box>
                  <TextView variant="header2" fontSize={18}>
                    {event.name}
                  </TextView>
                  <TextView>
                    ({event.availibleTickets}) Ticket
                    {event.availibleTickets > 1 && 's'}
                  </TextView>
                </Box>
                <Box>
                  <Box marginTop="m">
                  <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        style={{marginRight: 12}}
                        color={palette.yellow}
                      />
                    <TextView>
                      
                      Your ticket(s) may not be available after sharing them from
                      this screen.
                    </TextView>
                  </Box>

                  <TextView marginTop="m">
                    The new ticket holder(s) will receive an email with the new
                    ticket(s). You may revoke this transfer at any time.
                  </TextView>

                  <TextView marginTop="m" variant="header2" fontSize={18}>
                    Send to:
                  </TextView>
                  <TextField
                    name="email"
                    placeholder="Email"
                    value={state.email}
                    onChangeText={val => setState(s => ({...s, email: val}))}
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
                          <TextView variant="header2" fontSize={14} lineHeight={14}>
                            Select one or more tickets:
                          </TextView>
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
                                <TextView variant="EventRowName" fontSize={20}>
                                  {item.ownerName}
                                </TextView>
                                <TextView
                                  variant="EventRowTicketCount"
                                  fontSize={14}>
                                  Ticket #{item.code}
                                </TextView>
                                {item.seat && (
                                  <TextView
                                    variant="EventRowStartDate"
                                    fontSize={14}>
                                    Sec: {item.section}
                                    {'  '} Row: {item.row}
                                    {'  '}
                                    Seat:
                                    {item.seat}
                                  </TextView>
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
                        onPress={() => handleSubmit()}
                      />
                      <Button label="Cancel Sharing" onPress={() => handleClose()} />
                    </Box>
                  </ScrollView>
                </Box>
              </>
            )}
          </Box>)}
          </Formik>
        )}
      </BottomSheetView>
    </BottomSheet>
  );
});

export default TicketShareBottomSheet;
