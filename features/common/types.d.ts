
import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

declare module '*.svg' {
  const content: any;
  export default content;
}

export interface User {
  id: number;
  firstName?: string;
  lastLame?: string;
  email?: string;
  role: string;
  canRedeem: boolean;
}

export type AppMode = 'mytickets' | 'mypasses' | 'ticket-scanner' | undefined;


export type AppScreens = {
  Home: undefined; // No params for Home screen
  Profile: { userId: string }; // Profile screen expects a userId as a param
  TicketScanner: { events: EventModel[] };
  UserTickets: undefined;
  UserPasses: undefined;
  Login: undefined;
};

export type AppModels = {
  '/ticketing/EventSelectionModal': {
    tenant?: string;
    school?: string;
  },
}

export type AppModals = {
  EventSelector: { tenant?: number }; // No params for Home screen
  SchoolSelector: { tenant?: number } | undefined; // Profile screen expects a userId as a param
  PermissionRequest: {};
  UserTickets: { userId: number };
  UserPasses: { userId: number };
};

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  tenantId?: number;
  schoolId?: number;
  role: { id: number, name: string };
  permissions: string[];
}
export interface DecodedToken extends JwtPayload {
  id: string;
  ses: string;
  uid?: string;
  fn?: string;
  ln?: string;
  name?: string;
  email?: string;
  rid?: number,
  rln?: string,
  tn?: string,
  tid?: number,
  sn?: string,
  sid?: number,
  dn?: string,
  did?: number,
  nbf: number,
  exp: number,
  iat: number,
}
export type PagedRequest = {
  page?: number;
  limit?: number;
}
export type SearchRequest = {
  search?: string;
} & PagedRequest

export interface PagedResponse<T> {
  items: T[];
  meta: PagedMeta;

}
export type PagedMeta = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  hasMore: boolean;
}
export type BaseEntity = {
  id: number;
  name: string;
}

export type TenantModel = {
  logo?: string;
} & BaseEntity;

export type SchoolModel = {
  logo?: string;
  availibleEvents: number;
  availibleTickets: number;
  upcomingEvent?: EventModel;
  events: EventModel[];
  tenant: BaseEntity;
} & BaseEntity;

export type Seat = {
  id: number;
  name: string;
  row: string;
  section: string;
}
export type Voucher = {
  id: number;//
  publicId: string;//
  tenantId: number;//
  eventId: number;//
  event?: EventModel;//
  schoolId?: number;
  redeemedOn?: Date;//
  name: string;//
  code: string;//
  formattedCode: string;//
  type: VoucherType;
  seat?: Seat;
  ownerId: number;
  ownerEmail: string;
  ownerName: string;
  isRedeemed: boolean;
  isShareable: boolean;
  isHoldToRedeem: boolean;
  voucherDefinitionId: number;
  purchasedOn?: Date;

}
export type TicketModel = {
  id: number;//
  publicId: string;
  eventId: number;
  event?: EventModel;
  
} & Voucher;

export interface EventModel {
  id: number;
  name: string;
  startTime: Date;
  endTime: Date;
  allowedPasses: number[];
  schoolId?: number;
  departmentId?: number;
  facilityId?: number;
  tenantId: number;
  flags: number;
}
type VoucherType = 'pass' | 'ticket' | 'other';
type PassType = 'season' | 'reserved' | 'multi';

export type PassModel = {
  passType: PassType;
  voucherDefinitionId: number;
  schoolId: number;
  passCategoryIds: number[];
  allowedEventIds: number[];
  redeemedEventIds: number[];
  expiresOn?: Date;
  maxUses: number;
  isRedeemable: boolean;
  isShareable: boolean;
} & Voucher;

export interface RedemptionModel {
  id: string;
  ticketNumber: string;
  publicId: string;
  eventId: number;
  eventIds: number[];
  status: 'valid' | 'duplicate' | 'invalid' | 'error' | 'conflict';
  statusType: number;
  isValid: boolean;
  purchaserId: number;
  ownerId: number;
  ownerName: string;
  section: string;
  redeemableEventIds: number[];
  row: string;
  seat: string;
  message: string;
  isRedeemed: boolean;
  isRedeemable: boolean;
  redeemedOn: Date;
  scannedOn: Date;
}
export type VoucherRedemptionType = 'qrcode' | 'hold-to-redeem' | 'manual';
export type VoucherScanStatus = 'valid' | 'duplicate' | 'invalid' | 'error' | 'conflict';
export type VoucherScan = {
  voucherId?: number
  voucherCode: string
  eventIds: number[]
  ownerId: number
  status: VoucherScanStatus
  redeemedBy: number
  redemptionType: VoucherRedemptionTyp
  tenantId?: number
  schoolId?: number
  message?: string
}




export interface Cache {
  expiresAt: Date;
}
export type CheckboxItem<T> = {
  isSelected: boolean;
} & T;


export interface BottomSheetProps {
  style?: StyleProp<
    Animated.AnimateStyle<
      Omit<
        ViewStyle,
        | 'opacity'
        | 'bottom'
        | 'flexDirection'
        | 'left'
        | 'position'
        | 'right'
        | 'top'
        | 'transform'
      >
    >
  >;
}
