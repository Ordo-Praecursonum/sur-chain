/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosBaseTendermintV_1Beta_1() {
  const client = useClient();

  type ServiceGetNodeInfoMethod = typeof client.CosmosBaseTendermintV_1Beta_1.query.serviceGetNodeInfo;
  type ServiceGetNodeInfoData = Awaited<ReturnType<ServiceGetNodeInfoMethod>>["data"];
  const ServiceGetNodeInfo = ( options: Partial<UseQueryOptions<ServiceGetNodeInfoData>>) => {
    const key = { type: 'ServiceGetNodeInfo',  };    
    return useQuery<ServiceGetNodeInfoData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosBaseTendermintV_1Beta_1.query.serviceGetNodeInfo();
        return res.data;
    }, ...options});
  }
  

  type ServiceGetSyncingMethod = typeof client.CosmosBaseTendermintV_1Beta_1.query.serviceGetSyncing;
  type ServiceGetSyncingData = Awaited<ReturnType<ServiceGetSyncingMethod>>["data"];
  const ServiceGetSyncing = ( options: Partial<UseQueryOptions<ServiceGetSyncingData>>) => {
    const key = { type: 'ServiceGetSyncing',  };    
    return useQuery<ServiceGetSyncingData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosBaseTendermintV_1Beta_1.query.serviceGetSyncing();
        return res.data;
    }, ...options});
  }
  

  type ServiceGetLatestBlockMethod = typeof client.CosmosBaseTendermintV_1Beta_1.query.serviceGetLatestBlock;
  type ServiceGetLatestBlockData = Awaited<ReturnType<ServiceGetLatestBlockMethod>>["data"];
  const ServiceGetLatestBlock = ( options: Partial<UseQueryOptions<ServiceGetLatestBlockData>>) => {
    const key = { type: 'ServiceGetLatestBlock',  };    
    return useQuery<ServiceGetLatestBlockData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosBaseTendermintV_1Beta_1.query.serviceGetLatestBlock();
        return res.data;
    }, ...options});
  }
  

  type ServiceGetBlockByHeightMethod = typeof client.CosmosBaseTendermintV_1Beta_1.query.serviceGetBlockByHeight;
  type ServiceGetBlockByHeightData = Awaited<ReturnType<ServiceGetBlockByHeightMethod>>["data"];
  const ServiceGetBlockByHeight = (height: string,  options: Partial<UseQueryOptions<ServiceGetBlockByHeightData>>) => {
    const key = { type: 'ServiceGetBlockByHeight',  height };    
    return useQuery<ServiceGetBlockByHeightData>({ queryKey: [key], queryFn: async () => {
      const { height } = key
      const res = await client.CosmosBaseTendermintV_1Beta_1.query.serviceGetBlockByHeight(height);
        return res.data;
    }, ...options});
  }
  
  type ServiceGetLatestValidatorSetMethod = typeof client.CosmosBaseTendermintV_1Beta_1.query.serviceGetLatestValidatorSet;
  type ServiceGetLatestValidatorSetData = Awaited<ReturnType<ServiceGetLatestValidatorSetMethod>>["data"] & { pageParam: number };
  const ServiceGetLatestValidatorSet = (query:  NonNullable<Parameters<ServiceGetLatestValidatorSetMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<ServiceGetLatestValidatorSetData, unknown, InfiniteData<ServiceGetLatestValidatorSetData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'ServiceGetLatestValidatorSet', query };    
    return useInfiniteQuery<ServiceGetLatestValidatorSetData, unknown, InfiniteData<ServiceGetLatestValidatorSetData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBaseTendermintV_1Beta_1.query.serviceGetLatestValidatorSet(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type ServiceGetValidatorSetByHeightMethod = typeof client.CosmosBaseTendermintV_1Beta_1.query.serviceGetValidatorSetByHeight;
  type ServiceGetValidatorSetByHeightData = Awaited<ReturnType<ServiceGetValidatorSetByHeightMethod>>["data"] & { pageParam: number };
  const ServiceGetValidatorSetByHeight = (height: string, query:  NonNullable<Parameters<ServiceGetValidatorSetByHeightMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<ServiceGetValidatorSetByHeightData, unknown, InfiniteData<ServiceGetValidatorSetByHeightData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'ServiceGetValidatorSetByHeight',  height, query };    
    return useInfiniteQuery<ServiceGetValidatorSetByHeightData, unknown, InfiniteData<ServiceGetValidatorSetByHeightData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { height,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBaseTendermintV_1Beta_1.query.serviceGetValidatorSetByHeight(height, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type ServiceABCIQueryMethod = typeof client.CosmosBaseTendermintV_1Beta_1.query.serviceAbciquery;
  type ServiceABCIQueryData = Awaited<ReturnType<ServiceABCIQueryMethod>>["data"];
  const ServiceABCIQuery = (query: NonNullable<Parameters<ServiceABCIQueryMethod>[0]>, options: Partial<UseQueryOptions<ServiceABCIQueryData>>) => {
    const key = { type: 'ServiceABCIQuery', query };    
    return useQuery<ServiceABCIQueryData>({ queryKey: [key], queryFn: async () => {
      const {query } = key
      const res = await client.CosmosBaseTendermintV_1Beta_1.query.serviceAbciquery(query ?? undefined);
        return res.data;
    }, ...options});
  }
  
  return {ServiceGetNodeInfo,ServiceGetSyncing,ServiceGetLatestBlock,ServiceGetBlockByHeight,ServiceGetLatestValidatorSet,ServiceGetValidatorSetByHeight,ServiceABCIQuery,
  }
}
