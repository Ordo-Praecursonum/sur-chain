/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosCircuitV_1() {
  const client = useClient();

  type QueryAccountMethod = typeof client.CosmosCircuitV_1.query.queryAccount;
  type QueryAccountData = Awaited<ReturnType<QueryAccountMethod>>["data"];
  const QueryAccount = (address: string,  options: Partial<UseQueryOptions<QueryAccountData>>) => {
    const key = { type: 'QueryAccount',  address };    
    return useQuery<QueryAccountData>({ queryKey: [key], queryFn: async () => {
      const { address } = key
      const res = await client.CosmosCircuitV_1.query.queryAccount(address);
        return res.data;
    }, ...options});
  }
  
  type QueryAccountsMethod = typeof client.CosmosCircuitV_1.query.queryAccounts;
  type QueryAccountsData = Awaited<ReturnType<QueryAccountsMethod>>["data"] & { pageParam: number };
  const QueryAccounts = (query:  NonNullable<Parameters<QueryAccountsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryAccountsData, unknown, InfiniteData<QueryAccountsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryAccounts', query };    
    return useInfiniteQuery<QueryAccountsData, unknown, InfiniteData<QueryAccountsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosCircuitV_1.query.queryAccounts(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryDisabledListMethod = typeof client.CosmosCircuitV_1.query.queryDisabledList;
  type QueryDisabledListData = Awaited<ReturnType<QueryDisabledListMethod>>["data"];
  const QueryDisabledList = ( options: Partial<UseQueryOptions<QueryDisabledListData>>) => {
    const key = { type: 'QueryDisabledList',  };    
    return useQuery<QueryDisabledListData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosCircuitV_1.query.queryDisabledList();
        return res.data;
    }, ...options});
  }
  
  return {QueryAccount,QueryAccounts,QueryDisabledList,
  }
}
