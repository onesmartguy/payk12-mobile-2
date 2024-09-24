export type SlicedState = {
    loading: boolean;
    error?: string;
}
export type SlicedStateActions = {
    reset: () => Promise<void>;
    init: () => Promise<void>;
    persist: () => Promise<void>;
  }

  export interface UserProfile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName: string;
    tenantId?: number;
    schoolId?: number;
    role: {id: number, name: string};
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

  export interface PaginationState<T> {
    data: T[];                 // Array holding paginated data
    currentPage: number;       // Current page number
    totalPages: number;        // Total number of pages
    hasMore: boolean;          // Whether more data is available
    searchTerm: string;        // Search term for filtering results
    setSearchTerm: (term: string) => void;
    addData: (newData: T[], totalPages: number) => void;
    resetPagination: () => void;
  }
  export interface Entity {
    id: number;
    name: string;
  }
  export interface Ticket {
    id: number;
    publicId: string;
    eventId: number;
    eventName: string;
    productId: number;
    productName: string;
    redeemedOn?: Date;
    name: string;
    ticketNumber: string;
    formattedNumber: string;
    passNumber?: string;
    type: 'T' | 'P' | 'R';
    row: string;
    seat: string;
    section: string;
    ownerId: number;
    ownerEmail: string;
    ownerName: string;
    schoolId: number;
    schoolName: string;
    isRedeemed: boolean;
    isRedeemable: boolean;
    isShareable: boolean;
    shareIds: number[];
    redemptionIds: number[];
    isHoldToRedeem: boolean;
    startTime: Date;
    endTime: Date;
  }
  export interface Event {
    id: number;
    name: string;
    startTime: Date;
    endTime: Date;
    availibleTickets: number;
    tickets: Ticket[];
    schoolId: number;
    schoolName: string;
    redemptions: number;
    isRedeemable: boolean;
    isShareable: boolean;
    isHoldToRedeem: boolean;
    isAvailable: boolean;
    shareIds: number[];
    redemptionIds: number[];
  }
  export interface Pass {
    id: number;
    name: string;
    formattedNumber: string;
    passNumber: string;
    productId: number;
    productName: string;
    purchasedDate: Date;
    ownerId: number;
    ownerEmail: string;
    ownerName: string;
    schoolId: number;
    schoolName: string;
    type: string;
    isMultiEventPass: boolean;
    row: string;
    seat: string;
    section: string;
    reserveInfo?: string;
    startTime: Date;
    endTime: Date;
    expiresOn: Date;
    remainingUses?: number;
    uses: number;
    maxUses?: number;
    isRefunded: boolean;
    isHoldToRedeem: boolean;
    isRedeemable: boolean;
    isShareable: boolean;
    isActive: boolean;
    isRedeemed: boolean;
    shareIds: number[];
    redemptionIds: number[];
    upcomingEvent?: Event;
    upcomoningEvent?: Event;
    events: Event[];
    lastUsed?: Date;
    redeemedEvents: number[];
  }
  
  export interface Redemption {
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