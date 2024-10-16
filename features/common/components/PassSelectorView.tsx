import { BoxProps, TextProps } from "@shopify/restyle";
import Box from "./Box";
import { palette, Theme } from "@/utils/theme";
import { EventModel, PassModel, SchoolModel } from "../types";
import { Dimensions, SectionList, SectionListData, StyleSheet } from "react-native";
import TextView from "./TextView";
import { memo, useRef } from "react";
import Animated, { Extrapolate, interpolate, useAnimatedStyle, useSharedValue } from "react-native-reanimated";
import { RectButton, Swipeable } from "react-native-gesture-handler";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEllipsisV } from "@fortawesome/pro-regular-svg-icons";
import { groupBy, map, maxBy, orderBy } from "lodash";



const win = Dimensions.get('window');

interface PassRow extends BoxProps<Theme>, PassModel {
  ticketCount: number;
  nameStyle?: TextProps<Theme>;
  startDateStyle?: TextProps<Theme>;
  ticketsStyle?: TextProps<Theme>;
}

const PassBaseRow = ({
  name,
  isShareable,
  seat,
  isRedeemable,
  isHoldToRedeem,
  ticketCount,
  nameStyle,
  startDateStyle,
  ticketsStyle,
  ...props
}: PassRow) => {
  return (
    <Box>
      {name && (
        <TextView variant="EventRowName" {...nameStyle}>
          {name}
        </TextView>
      )}
      
        <TextView variant="EventRowStartDate" {...startDateStyle}>
          {seat ? `Seat: ${seat.name}, Row: ${seat.row}, Sec: ${seat.section}` : 'General Admission'}
        </TextView>
    

      <TextView variant="EventRowTicketCount" {...ticketsStyle}>
        {ticketCount > 0
          ? `(${ticketCount}) Event${ticketCount > 1 ? 's' : ''} Left`
          : 'Expired'}
      </TextView>
    </Box>
  );
};
interface Props extends BoxProps<Theme> {
  passes: PassModel[];
  events: EventModel[];
  school?: SchoolModel;
  onSelected: (pass: PassModel) => void;
  isShareable?: (pass: PassModel) => boolean;
  onShare?: (pass: PassModel) => void;
}
const remainingUses = (pass: PassModel) => ((pass.passType == 'multi' ? pass.maxUses : pass.allowedEventIds.length) - pass.redeemedEventIds.length) ?? 0;
const PassItem = memo(
  ({
    pass,
    shareable = false,
    onShare,
    onSelected,
  }: {
    pass: PassModel;
    onShare?: () => void;
    shareable: boolean;
    onSelected?: () => void;
  }) => {

    const swipeableRef = useRef<Swipeable>(null)



    const onClose = () => {};

    const renderLeftActions = (progress: any, drag: any) => {
      return (
        <RectButton
          style={[
            {
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: palette.lighterGray,
              width: win.width / 4,
            }
          ]}
          onPress={() => {
            swipeableRef.current?.close();
            onShare && onShare()}}
        >
          <Animated.Text
            style={[
              {
                alignSelf: 'center',
                fontSize: 16,
                color: palette.darkGray,
              },
            ]}
          >
            Share
          </Animated.Text>
        </RectButton>
      );
    };

    const opacity = shareable ? 1 : 0;
    return (
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        containerStyle={{ backgroundColor: palette.lighterGray }}
      >
        <RectButton onPress={() => onSelected && onSelected()}>
          <Box
            borderBottomWidth={1}
            borderColor="listDividerColor"
            flex={1}
            flexDirection="row"
            paddingVertical="s"
            backgroundColor="white"
          >
            <Box
              alignItems="center"
              justifyContent="center"
              paddingRight="s"
              opacity={opacity}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </Box>

            <PassBaseRow {...pass} ticketCount={remainingUses(pass)} />
          </Box>
        </RectButton>
      </Swipeable>
    );
  }
);

export const PassSelectorView: React.FC<Props> = ({
  passes,
  school,
  events,
  isShareable,
  onShare,
  onSelected,
  ...props
}) => {
  const titleText = 'Select your Pass';
  const handleSelectedPass = (pass: PassModel) => {
    if (onSelected) onSelected(pass);
  };
  const shareable = (pass: PassModel) => {
      return pass.isShareable && onShare != undefined;  
  };
  const renderHeader = () => (
    <Box flex={1}>
      <TextView variant="title" marginBottom="lg">
        {titleText}
      </TextView>
      {school && 
      (<Box>
        <TextView variant="header2" marginBottom="m">
          {school.name}
        </TextView>
        <TextView marginBottom="m">
          Select a pass below to gain access to your event.
        </TextView>
      </Box>)
      }
    </Box>
  );
  const renderSectionHeader = (info: {
    section: SectionListData<
      PassModel,
      {
        title: string;
        data: PassModel[];
      }
    >;
  }) => (
    <Box backgroundColor="listSectionBackgroudColor" padding="xs">
      <TextView variant="sectionHeader">{info.section.title}</TextView>
    </Box>
  );
  const sectionGroup = groupBy(passes, (p) =>
    (remainingUses(p)) ? 'My Passes' : 'Expired' 
  );
  const passEvents = (pass: PassModel) => pass.allowedEventIds.map((id) => events?.find((e) => e.id === id));
  const sections = orderBy(
    map(sectionGroup, (data, key) => ({
      title: key,
      data: orderBy(data, (x) => maxBy(passEvents(x), e => e?.startTime), "desc"),
      sort: key === 'Expired' ? 2 : 1,
    })),
    'sort'
  );
  return (
    <Box flex={1} paddingHorizontal="lg" {...props}>
      <Box flex={1}>
        <SectionList
          sections={sections}
          ItemSeparatorComponent={() => (
            <Box
              flex={1}
              backgroundColor="black"
              height={StyleSheet.hairlineWidth}
            />
          )}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => (
            <PassItem
              pass={item}
              onSelected={() => handleSelectedPass(item)}
              shareable={shareable(item)}
              onShare={() => {
                onShare && onShare(item);
              }}
            />

            // <Box><Text>{JSON.stringify(item, null, 2)}</Text></Box>
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderSectionHeader={renderSectionHeader}
        />
      </Box>
    </Box>
  );
};
export default PassSelectorView;
