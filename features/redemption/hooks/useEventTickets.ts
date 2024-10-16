import { fetchEventTickets } from "@/api/redemption";
import { EventModel, PagedMeta } from "@/common/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import useRedemptionStore from "../stores/redemptionStore";


const useEventTickets = (events: EventModel[]) => {

    const [meta, setMeta] = useState<PagedMeta>({currentPage: 1, hasMore: false, itemsPerPage: 25, totalItems: 0, totalPages: 0})

    const upsertTickets = useRedemptionStore((state) => state.upsertTicket);
    const tickets = useRedemptionStore((state) => state.tickets.filter(x => events.map(e => e.id).includes(x.eventId)));
    const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, refetch} = useInfiniteQuery({
        queryKey: ['eventTickets'], 
        initialPageParam: meta.currentPage, 
        queryFn: () => fetchEventTickets({eventIds: events.map(x => x.id) ?? [], page: meta.currentPage, limit: meta.itemsPerPage})
            .then(async response => {
                const tickets = response.data.items;
                tickets.forEach(t => upsertTickets(t));
                setMeta(response.data.meta);
                return await response.data.items;
            }),
        getNextPageParam: (lastPage, allPages) => {
          if (meta.hasMore) {
            return allPages.length + 1;
          }
          return undefined;
        },
        enabled: events.length > 0
    });
    return {tickets, error, fetchNextPage, hasNextPage, isFetching, refetch, isFetchingNextPage};
  };
  
  export default useEventTickets;