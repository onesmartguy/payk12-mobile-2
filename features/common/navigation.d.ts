export type RedemptionParamList  = {
    TicketScanner: undefined;
  };
  export type TicketingParamList = {
    UserPasses: undefined;
    UserTickets: { userId: string }; // Passing a parameter to ProfileDetails
  };
  export type ModalParamList = {
    EventSelectionModal: undefined;
    PassSelectionModal: undefined; // Passing a parameter to ProfileDetails
  };
  export type DrawerParamList = {
    Home: undefined;
    TicketScanner: undefined;
    UserPasses: undefined;
    UserTickets: undefined;
    Modals: NavigatorScreenParams<ModalParamList>;
  };
  
  // Extend the DrawerNavigationProp to include the DrawerParamList
  export type DrawerNavigationProps<T extends keyof DrawerParamList> = DrawerNavigationProp<DrawerParamList, T>;