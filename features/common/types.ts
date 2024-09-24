import { StyleProp, ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';

export interface User {
  id: number;
  firstName?: string;
  lastLame?: string;
  email?: string;
  role: string;
  canRedeem: boolean;
}

export type AppMode = 'mytickets' | 'mypasses' | 'ticket-scanner' | undefined;
export interface School {
  id: number;
  name: string;
  availibleEvents: number;
  availibleTickets: number;
  upcomingEvent?: Event;
  events: Event[];
}
export interface Cache {
  expiresAt: Date;
}
export type CheckboxItem<T> = {
  isSelected: boolean;
} & T;


export interface ListResponse<T> {
  pageSize: number;
  currentPage: number;
  totalItems: number;
  totalPages: number;
  items: T[];
}

export interface NamePageSearch extends PagedReequest {
  name?: string;
  schoolId?: number;
  eventId?: number;
}
interface PagedReequest {
  page?: number;
  pageSize?: number;
}

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
