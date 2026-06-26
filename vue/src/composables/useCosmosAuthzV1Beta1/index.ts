/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosAuthzV_1Beta_1() {
  const client = useClient();
  type QueryGrantsMethod = typeof client.CosmosAuthzV_1Beta_1.query.queryGrants;
  type QueryGrantsData = Awaited<ReturnType<QueryGrantsMethod>>["data"] & { pageParam: number };
  const QueryGrants = (query:  NonNullable<Parameters<QueryGrantsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryGrantsData, unknown, InfiniteData<QueryGrantsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGrants', query };    
    return useInfiniteQuery<QueryGrantsData, unknown, InfiniteData<QueryGrantsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosAuthzV_1Beta_1.query.queryGrants(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryGranterGrantsMethod = typeof client.CosmosAuthzV_1Beta_1.query.queryGranterGrants;
  type QueryGranterGrantsData = Awaited<ReturnType<QueryGranterGrantsMethod>>["data"] & { pageParam: number };
  const QueryGranterGrants = (granter: string, query:  NonNullable<Parameters<QueryGranterGrantsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryGranterGrantsData, unknown, InfiniteData<QueryGranterGrantsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGranterGrants',  granter, query };    
    return useInfiniteQuery<QueryGranterGrantsData, unknown, InfiniteData<QueryGranterGrantsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { granter,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosAuthzV_1Beta_1.query.queryGranterGrants(granter, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryGranteeGrantsMethod = typeof client.CosmosAuthzV_1Beta_1.query.queryGranteeGrants;
  type QueryGranteeGrantsData = Awaited<ReturnType<QueryGranteeGrantsMethod>>["data"] & { pageParam: number };
  const QueryGranteeGrants = (grantee: string, query:  NonNullable<Parameters<QueryGranteeGrantsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryGranteeGrantsData, unknown, InfiniteData<QueryGranteeGrantsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGranteeGrants',  grantee, query };    
    return useInfiniteQuery<QueryGranteeGrantsData, unknown, InfiniteData<QueryGranteeGrantsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { grantee,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosAuthzV_1Beta_1.query.queryGranteeGrants(grantee, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryGrants,QueryGranterGrants,QueryGranteeGrants,
  }
}
