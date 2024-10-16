import { fetchEvents } from "@/api/redemption";
import useEventStore from "@/common/stores/useEventStore";
import { PagedMeta } from "@/common/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";;
import useSchoolStore from "../stores/useSchoolStore";


const useEvents = (options: {ids?: number[], tenantId?: number, schoolId?: number}) => {

    const [meta, setMeta] = useState<PagedMeta>({currentPage: 1, hasMore: false, itemsPerPage: 25, totalItems: 0, totalPages: 0})

    const upsertEvents = useEventStore((state) => state.upsertEvent);
    const events = useEventStore((state) => state.events);


    const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ['events', [options.ids, options.tenantId]], 
        initialPageParam: meta.currentPage, 
        queryFn: () => fetchEvents({...options, page: meta.currentPage, limit: meta.itemsPerPage})
            .then(async response => {
                const events = response.data.items;
                events.forEach(event => upsertEvents(event));
                console.log('events', events)
                setMeta(response.data.meta);
                return await response.data.items;
            }),
        getNextPageParam: (lastPage, allPages) => {
          if (meta.hasMore) {
            return allPages.length + 1;
          }
          return undefined;
        }
    });
    return {events, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage};
  };
  
  export default useEvents;
