/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosNftV_1Beta_1() {
  const client = useClient();

  type QueryBalanceMethod = typeof client.CosmosNftV_1Beta_1.query.queryBalance;
  type QueryBalanceData = Awaited<ReturnType<QueryBalanceMethod>>["data"];
  const QueryBalance = (owner: string, class_id: string,  options: Partial<UseQueryOptions<QueryBalanceData>>) => {
    const key = { type: 'QueryBalance',  owner,  class_id };    
    return useQuery<QueryBalanceData>({ queryKey: [key], queryFn: async () => {
      const { owner,  class_id } = key
      const res = await client.CosmosNftV_1Beta_1.query.queryBalance(owner, class_id);
        return res.data;
    }, ...options});
  }
  

  type QueryOwnerMethod = typeof client.CosmosNftV_1Beta_1.query.queryOwner;
  type QueryOwnerData = Awaited<ReturnType<QueryOwnerMethod>>["data"];
  const QueryOwner = (class_id: string, id: string,  options: Partial<UseQueryOptions<QueryOwnerData>>) => {
    const key = { type: 'QueryOwner',  class_id,  id };    
    return useQuery<QueryOwnerData>({ queryKey: [key], queryFn: async () => {
      const { class_id,  id } = key
      const res = await client.CosmosNftV_1Beta_1.query.queryOwner(class_id, id);
        return res.data;
    }, ...options});
  }
  

  type QuerySupplyMethod = typeof client.CosmosNftV_1Beta_1.query.querySupply;
  type QuerySupplyData = Awaited<ReturnType<QuerySupplyMethod>>["data"];
  const QuerySupply = (class_id: string,  options: Partial<UseQueryOptions<QuerySupplyData>>) => {
    const key = { type: 'QuerySupply',  class_id };    
    return useQuery<QuerySupplyData>({ queryKey: [key], queryFn: async () => {
      const { class_id } = key
      const res = await client.CosmosNftV_1Beta_1.query.querySupply(class_id);
        return res.data;
    }, ...options});
  }
  
  type QueryNFTsMethod = typeof client.CosmosNftV_1Beta_1.query.queryNfts;
  type QueryNFTsData = Awaited<ReturnType<QueryNFTsMethod>>["data"] & { pageParam: number };
  const QueryNFTs = (query:  NonNullable<Parameters<QueryNFTsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryNFTsData, unknown, InfiniteData<QueryNFTsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryNFTs', query };    
    return useInfiniteQuery<QueryNFTsData, unknown, InfiniteData<QueryNFTsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosNftV_1Beta_1.query.queryNfts(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryNFTMethod = typeof client.CosmosNftV_1Beta_1.query.queryNft;
  type QueryNFTData = Awaited<ReturnType<QueryNFTMethod>>["data"];
  const QueryNFT = (class_id: string, id: string,  options: Partial<UseQueryOptions<QueryNFTData>>) => {
    const key = { type: 'QueryNFT',  class_id,  id };    
    return useQuery<QueryNFTData>({ queryKey: [key], queryFn: async () => {
      const { class_id,  id } = key
      const res = await client.CosmosNftV_1Beta_1.query.queryNft(class_id, id);
        return res.data;
    }, ...options});
  }
  

  type QueryClassMethod = typeof client.CosmosNftV_1Beta_1.query.queryClass;
  type QueryClassData = Awaited<ReturnType<QueryClassMethod>>["data"];
  const QueryClass = (class_id: string,  options: Partial<UseQueryOptions<QueryClassData>>) => {
    const key = { type: 'QueryClass',  class_id };    
    return useQuery<QueryClassData>({ queryKey: [key], queryFn: async () => {
      const { class_id } = key
      const res = await client.CosmosNftV_1Beta_1.query.queryClass(class_id);
        return res.data;
    }, ...options});
  }
  
  type QueryClassesMethod = typeof client.CosmosNftV_1Beta_1.query.queryClasses;
  type QueryClassesData = Awaited<ReturnType<QueryClassesMethod>>["data"] & { pageParam: number };
  const QueryClasses = (query:  NonNullable<Parameters<QueryClassesMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryClassesData, unknown, InfiniteData<QueryClassesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryClasses', query };    
    return useInfiniteQuery<QueryClassesData, unknown, InfiniteData<QueryClassesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosNftV_1Beta_1.query.queryClasses(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryBalance,QueryOwner,QuerySupply,QueryNFTs,QueryNFT,QueryClass,QueryClasses,
  }
}
