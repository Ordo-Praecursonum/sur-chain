/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosFeegrantV_1Beta_1() {
  const client = useClient();

  type QueryAllowanceMethod = typeof client.CosmosFeegrantV_1Beta_1.query.queryAllowance;
  type QueryAllowanceData = Awaited<ReturnType<QueryAllowanceMethod>>["data"];
  const QueryAllowance = (granter: string, grantee: string,  options: Partial<UseQueryOptions<QueryAllowanceData>>) => {
    const key = { type: 'QueryAllowance',  granter,  grantee };    
    return useQuery<QueryAllowanceData>({ queryKey: [key], queryFn: async () => {
      const { granter,  grantee } = key
      const res = await client.CosmosFeegrantV_1Beta_1.query.queryAllowance(granter, grantee);
        return res.data;
    }, ...options});
  }
  
  type QueryAllowancesMethod = typeof client.CosmosFeegrantV_1Beta_1.query.queryAllowances;
  type QueryAllowancesData = Awaited<ReturnType<QueryAllowancesMethod>>["data"] & { pageParam: number };
  const QueryAllowances = (grantee: string, query:  NonNullable<Parameters<QueryAllowancesMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryAllowancesData, unknown, InfiniteData<QueryAllowancesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryAllowances',  grantee, query };    
    return useInfiniteQuery<QueryAllowancesData, unknown, InfiniteData<QueryAllowancesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { grantee,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosFeegrantV_1Beta_1.query.queryAllowances(grantee, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryAllowancesByGranterMethod = typeof client.CosmosFeegrantV_1Beta_1.query.queryAllowancesByGranter;
  type QueryAllowancesByGranterData = Awaited<ReturnType<QueryAllowancesByGranterMethod>>["data"] & { pageParam: number };
  const QueryAllowancesByGranter = (granter: string, query:  NonNullable<Parameters<QueryAllowancesByGranterMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryAllowancesByGranterData, unknown, InfiniteData<QueryAllowancesByGranterData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryAllowancesByGranter',  granter, query };    
    return useInfiniteQuery<QueryAllowancesByGranterData, unknown, InfiniteData<QueryAllowancesByGranterData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { granter,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosFeegrantV_1Beta_1.query.queryAllowancesByGranter(granter, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryAllowance,QueryAllowances,QueryAllowancesByGranter,
  }
}
