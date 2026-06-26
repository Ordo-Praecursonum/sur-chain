/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosSlashingV_1Beta_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.CosmosSlashingV_1Beta_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosSlashingV_1Beta_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  

  type QuerySigningInfoMethod = typeof client.CosmosSlashingV_1Beta_1.query.querySigningInfo;
  type QuerySigningInfoData = Awaited<ReturnType<QuerySigningInfoMethod>>["data"];
  const QuerySigningInfo = (cons_address: string,  options: Partial<UseQueryOptions<QuerySigningInfoData>>) => {
    const key = { type: 'QuerySigningInfo',  cons_address };    
    return useQuery<QuerySigningInfoData>({ queryKey: [key], queryFn: async () => {
      const { cons_address } = key
      const res = await client.CosmosSlashingV_1Beta_1.query.querySigningInfo(cons_address);
        return res.data;
    }, ...options});
  }
  
  type QuerySigningInfosMethod = typeof client.CosmosSlashingV_1Beta_1.query.querySigningInfos;
  type QuerySigningInfosData = Awaited<ReturnType<QuerySigningInfosMethod>>["data"] & { pageParam: number };
  const QuerySigningInfos = (query:  NonNullable<Parameters<QuerySigningInfosMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QuerySigningInfosData, unknown, InfiniteData<QuerySigningInfosData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QuerySigningInfos', query };    
    return useInfiniteQuery<QuerySigningInfosData, unknown, InfiniteData<QuerySigningInfosData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosSlashingV_1Beta_1.query.querySigningInfos(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryParams,QuerySigningInfo,QuerySigningInfos,
  }
}
