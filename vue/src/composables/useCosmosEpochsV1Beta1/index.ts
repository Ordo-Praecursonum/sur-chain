/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosEpochsV_1Beta_1() {
  const client = useClient();

  type QueryEpochInfosMethod = typeof client.CosmosEpochsV_1Beta_1.query.queryEpochInfos;
  type QueryEpochInfosData = Awaited<ReturnType<QueryEpochInfosMethod>>["data"];
  const QueryEpochInfos = ( options: Partial<UseQueryOptions<QueryEpochInfosData>>) => {
    const key = { type: 'QueryEpochInfos',  };    
    return useQuery<QueryEpochInfosData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosEpochsV_1Beta_1.query.queryEpochInfos();
        return res.data;
    }, ...options});
  }
  

  type QueryCurrentEpochMethod = typeof client.CosmosEpochsV_1Beta_1.query.queryCurrentEpoch;
  type QueryCurrentEpochData = Awaited<ReturnType<QueryCurrentEpochMethod>>["data"];
  const QueryCurrentEpoch = (query: NonNullable<Parameters<QueryCurrentEpochMethod>[0]>, options: Partial<UseQueryOptions<QueryCurrentEpochData>>) => {
    const key = { type: 'QueryCurrentEpoch', query };    
    return useQuery<QueryCurrentEpochData>({ queryKey: [key], queryFn: async () => {
      const {query } = key
      const res = await client.CosmosEpochsV_1Beta_1.query.queryCurrentEpoch(query ?? undefined);
        return res.data;
    }, ...options});
  }
  
  return {QueryEpochInfos,QueryCurrentEpoch,
  }
}
