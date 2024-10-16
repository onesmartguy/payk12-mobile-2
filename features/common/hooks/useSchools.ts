import { fetchEvents, fetchSchools } from "@/api/redemption";
import useSchoolStore from "@/common/stores/useSchoolStore";
import { PagedMeta } from "@/common/types";
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";


const useSchools = (options: {ids?: number[], tenantId?: number}) => {

    const [meta, setMeta] = useState<PagedMeta>({currentPage: 1, hasMore: false, itemsPerPage: 25, totalItems: 0, totalPages: 0})

    const upsertSchools = useSchoolStore((state) => state.upsertSchools);
    const schools = useSchoolStore((state) => state.schools);

    const {data, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage} = useInfiniteQuery({
        queryKey: ['schools'], 
        initialPageParam: meta.currentPage, 
        queryFn: async () => { 
          const req = await fetchSchools({...options, page: meta.currentPage, limit: meta.itemsPerPage})
          const schools = req.data.items;
          upsertSchools(schools);
          setMeta(x => req.data.meta);
          return req.data;
        },
        getNextPageParam: (lastPage, allPages) => {
          if (meta.hasMore) {
            return allPages.length + 1;
          }
          return null;
        },
        enabled: !!options.ids && options.ids.length > 0
    });
    return {schools, error, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage};
  };

  export default useSchools;
