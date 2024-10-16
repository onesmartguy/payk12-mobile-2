import BottomSheet, { BottomSheetProps, BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { EventModel, PassModel } from "../types";
import Box from "../components/Box";
import CheckboxField from "../components/CheckboxField";
import TextView from "../components/TextView";
import { orderBy } from "lodash";
import { getEventDateAsString } from "@/utils/events";
import { CommonStyles } from "./style";
import RadioField, { RadioFieldOption } from "../components/RadioField";
import { forwardRef, memo, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { palette } from "@/utils/theme";
import { faExclamationTriangle } from "@fortawesome/pro-regular-svg-icons";
import Button from "../components/Button";
import TextField from "../components/TextField";


interface PassShareBottomSheetProps extends Partial<BottomSheetProps> {
  onClose?: () => void;
  onSubmit: (form: FormData) => void;
}
export type PassShareSheet = {
  show: (pass: PassModel) => void;
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
  const [pass, setPass] = useState<PassModel>();
  const [state, setState] = useState(initalState);
  const [transferAll, setTransferAll] = useState(true);

  const snapPoints = useMemo(() => ['CONTENT_HEIGHT'], []);
 
  useImperativeHandle(ref, () => ({
    show,
    close,
  }));
  const {bottom: bottomSafeArea} = useSafeAreaInsets();
  // callbacks
  const show = (p: PassModel) => {
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
  const renderItem = (item: EventModel) => (
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
        <TextView variant="EventRowName" fontSize={20}>
          {item.name}
        </TextView>
        <TextView variant="EventRowTicketCount" fontSize={14}>
          {getEventDateAsString(item)}
        </TextView>
      </Box>
    </Box>
  );

  if (!pass) return null;

  const orderedEvents = orderBy(pass.events.filter(x => x.isShareable), ['startTime']);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      enablePanDownToClose
      enableDynamicSizing
      style={{
        ...CommonStyles.container,
      }}
      {...props}>
      <Box>
        {pass && (
          <Box
            flexGrow={1}
            paddingHorizontal="lg"
            style={{paddingBottom: bottomSafeArea}}>
            <TextView variant="header2" fontSize={18}>
              {pass.name}
            </TextView>
            <TextView>
              ({orderedEvents.length}) Event
              {orderedEvents.length > 1 && 's'}
            </TextView>

            <BottomSheetScrollView
              contentContainerStyle={{}}
              style={{flexGrow: 1, flexShrink: 1}}>
              <Box marginTop="m" flexDirection="column">
                <TextView>
                  <FontAwesomeIcon
                    icon={faExclamationTriangle}
                    style={{marginRight: 8}}
                    color={palette.yellow}
                  />
                  Your ticket(s) may not be available after sharing them from this
                  screen.
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
                value={transferAll}
                onChange={value => {
                  setTransferAll(value);
                }}
                marginVertical="lg"
              />
              {!transferAll && (
                <Box borderBottomColor="darkGray" borderBottomWidth={1}>
                  <TextView variant="header2" fontSize={14} lineHeight={14}>
                    Select one or more tickets:
                  </TextView>
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

export default PassShareBottomSheetComponent;
