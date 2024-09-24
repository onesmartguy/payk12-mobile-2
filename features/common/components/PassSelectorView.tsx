import React, { memo, useRef } from 'react';
import {
  Dimensions,
  SectionList,
  SectionListData,
  StyleSheet,
} from 'react-native';
import { FlatList, RectButton, Swipeable } from 'react-native-gesture-handler';
import { groupBy, map, min, orderBy } from 'lodash';
import { BoxProps, TextProps, backgroundColor } from '@shopify/restyle';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import { getDateAsString } from '../../../utils';
import { Text, Box } from '../../../ui';
import { Pass, School } from '../types';
import { palette, Theme } from '../../../ui/theme';


const win = Dimensions.get('window');

interface PassRow extends BoxProps<Theme>, Pass {
  ticketCount: number;
  nameStyle?: TextProps<Theme>;
  startDateStyle?: TextProps<Theme>;
  ticketsStyle?: TextProps<Theme>;
}

const PassBaseRow = ({
  name,
  upcomingEvent,
  upcomoningEvent,
  isShareable,
  isRedeemable,
  isHoldToRedeem,
  uses,
  reserveInfo,
  ticketCount,
  nameStyle,
  startDateStyle,
  ticketsStyle,
  ...props
}: PassRow) => {
  return (
    <Box {...props}>
      {name && (
        <Text variant="EventRowName" {...nameStyle}>
          {name}
        </Text>
      )}
      
        <Text variant="EventRowStartDate" {...startDateStyle}>
          {reserveInfo}
        </Text>
    

      <Text variant="EventRowTicketCount" {...ticketsStyle}>
        {ticketCount > 0
          ? `(${ticketCount}) Event${ticketCount > 1 ? 's' : ''} Left`
          : 'Expired'}
      </Text>
    </Box>
  );
};
interface Props extends BoxProps<Theme> {
  passes: Pass[];
  school?: School;
  onSelected: (pass: Pass) => void;
  isShareable?: (pass: Pass) => boolean;
  onShare?: (pass: Pass) => void;
}

const PassItem = memo(
  ({
    pass,
    shareable = false,
    onShare,
    onSelected,
  }: {
    pass: Pass;
    onShare?: () => void;
    shareable: boolean;
    onSelected?: () => void;
  }) => {

    const swipeableRef = useRef<Swipeable>(null)
    const translateX = useSharedValue(0);
    const leftActionStyles = useAnimatedStyle(() => {
      const transX = interpolate(
        translateX.value,
        [0, 50, win.width / 4, win.width / 4], // between the beginning and end of the slider
        [-(win.width / 4), 0, 0, 1], // penguin will make 4 full spins
        Extrapolate.CLAMP
      );

      return {
        transform: [{ translateX: transX }],
      };
    });

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
            },
            leftActionStyles,
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
    const gamesLeft = pass.remainingUses || pass.events.filter(x => x.isRedeemable).length || 0;
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

            <PassBaseRow {...pass} ticketCount={gamesLeft} />
          </Box>
        </RectButton>
      </Swipeable>
    );
  }
);

export const PassSelectorView: React.FC<Props> = ({
  passes,
  school,
  isShareable,
  onShare,
  onSelected,
  ...props
}) => {
  const titleText = 'Select your Pass';
  const handleSelectedPass = (pass: Pass) => {
    if (onSelected) onSelected(pass);
  };
  const shareable = (pass: Pass) => {
      return pass.isShareable && onShare != undefined;  
  };
  const renderHeader = () => (
    <Box flex={1}>
      <Text variant="title" marginBottom="lg">
        {titleText}
      </Text>
      {school && 
      (<Box>
        <Text variant="header2" marginBottom="m">
          {school.name}
        </Text>
        <Text marginBottom="m">
          Select a pass below to gain access to your event.
        </Text>
      </Box>)
      }
    </Box>
  );
  const renderSectionHeader = (info: {
    section: SectionListData<
      Pass,
      {
        title: string;
        data: Pass[];
      }
    >;
  }) => (
    <Box backgroundColor="listSectionBackgroudColor" padding="xs">
      <Text variant="sectionHeader">{info.section.title}</Text>
    </Box>
  );
  const sectionGroup = groupBy(passes, (p) =>
    (!p.remainingUses || p.remainingUses > 0) ? 'My Passes' : 'Expired' 
  );
  const sections = orderBy(
    map(sectionGroup, (data, key) => ({
      title: key,
      data: orderBy(data, (x) => x.upcomingEvent?.startTime || x.startTime, "desc"),
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
