/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosBankV_1Beta_1() {
  const client = useClient();

  type QueryBalanceMethod = typeof client.CosmosBankV_1Beta_1.query.queryBalance;
  type QueryBalanceData = Awaited<ReturnType<QueryBalanceMethod>>["data"];
  const QueryBalance = (address: string, query: NonNullable<Parameters<QueryBalanceMethod>[1]>, options: Partial<UseQueryOptions<QueryBalanceData>>) => {
    const key = { type: 'QueryBalance',  address, query };    
    return useQuery<QueryBalanceData>({ queryKey: [key], queryFn: async () => {
      const { address,query } = key
      const res = await client.CosmosBankV_1Beta_1.query.queryBalance(address, query ?? undefined);
        return res.data;
    }, ...options});
  }
  
  type QueryAllBalancesMethod = typeof client.CosmosBankV_1Beta_1.query.queryAllBalances;
  type QueryAllBalancesData = Awaited<ReturnType<QueryAllBalancesMethod>>["data"] & { pageParam: number };
  const QueryAllBalances = (address: string, query:  NonNullable<Parameters<QueryAllBalancesMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryAllBalancesData, unknown, InfiniteData<QueryAllBalancesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryAllBalances',  address, query };    
    return useInfiniteQuery<QueryAllBalancesData, unknown, InfiniteData<QueryAllBalancesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { address,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBankV_1Beta_1.query.queryAllBalances(address, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QuerySpendableBalancesMethod = typeof client.CosmosBankV_1Beta_1.query.querySpendableBalances;
  type QuerySpendableBalancesData = Awaited<ReturnType<QuerySpendableBalancesMethod>>["data"] & { pageParam: number };
  const QuerySpendableBalances = (address: string, query:  NonNullable<Parameters<QuerySpendableBalancesMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QuerySpendableBalancesData, unknown, InfiniteData<QuerySpendableBalancesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QuerySpendableBalances',  address, query };    
    return useInfiniteQuery<QuerySpendableBalancesData, unknown, InfiniteData<QuerySpendableBalancesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { address,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBankV_1Beta_1.query.querySpendableBalances(address, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QuerySpendableBalanceByDenomMethod = typeof client.CosmosBankV_1Beta_1.query.querySpendableBalanceByDenom;
  type QuerySpendableBalanceByDenomData = Awaited<ReturnType<QuerySpendableBalanceByDenomMethod>>["data"];
  const QuerySpendableBalanceByDenom = (address: string, query: NonNullable<Parameters<QuerySpendableBalanceByDenomMethod>[1]>, options: Partial<UseQueryOptions<QuerySpendableBalanceByDenomData>>) => {
    const key = { type: 'QuerySpendableBalanceByDenom',  address, query };    
    return useQuery<QuerySpendableBalanceByDenomData>({ queryKey: [key], queryFn: async () => {
      const { address,query } = key
      const res = await client.CosmosBankV_1Beta_1.query.querySpendableBalanceByDenom(address, query ?? undefined);
        return res.data;
    }, ...options});
  }
  
  type QueryTotalSupplyMethod = typeof client.CosmosBankV_1Beta_1.query.queryTotalSupply;
  type QueryTotalSupplyData = Awaited<ReturnType<QueryTotalSupplyMethod>>["data"] & { pageParam: number };
  const QueryTotalSupply = (query:  NonNullable<Parameters<QueryTotalSupplyMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryTotalSupplyData, unknown, InfiniteData<QueryTotalSupplyData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryTotalSupply', query };    
    return useInfiniteQuery<QueryTotalSupplyData, unknown, InfiniteData<QueryTotalSupplyData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBankV_1Beta_1.query.queryTotalSupply(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QuerySupplyOfMethod = typeof client.CosmosBankV_1Beta_1.query.querySupplyOf;
  type QuerySupplyOfData = Awaited<ReturnType<QuerySupplyOfMethod>>["data"];
  const QuerySupplyOf = (query: NonNullable<Parameters<QuerySupplyOfMethod>[0]>, options: Partial<UseQueryOptions<QuerySupplyOfData>>) => {
    const key = { type: 'QuerySupplyOf', query };    
    return useQuery<QuerySupplyOfData>({ queryKey: [key], queryFn: async () => {
      const {query } = key
      const res = await client.CosmosBankV_1Beta_1.query.querySupplyOf(query ?? undefined);
        return res.data;
    }, ...options});
  }
  

  type QueryParamsMethod = typeof client.CosmosBankV_1Beta_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosBankV_1Beta_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  
  type QueryDenomsMetadataMethod = typeof client.CosmosBankV_1Beta_1.query.queryDenomsMetadata;
  type QueryDenomsMetadataData = Awaited<ReturnType<QueryDenomsMetadataMethod>>["data"] & { pageParam: number };
  const QueryDenomsMetadata = (query:  NonNullable<Parameters<QueryDenomsMetadataMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryDenomsMetadataData, unknown, InfiniteData<QueryDenomsMetadataData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDenomsMetadata', query };    
    return useInfiniteQuery<QueryDenomsMetadataData, unknown, InfiniteData<QueryDenomsMetadataData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBankV_1Beta_1.query.queryDenomsMetadata(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryDenomMetadataMethod = typeof client.CosmosBankV_1Beta_1.query.queryDenomMetadata;
  type QueryDenomMetadataData = Awaited<ReturnType<QueryDenomMetadataMethod>>["data"];
  const QueryDenomMetadata = (denom: string,  options: Partial<UseQueryOptions<QueryDenomMetadataData>>) => {
    const key = { type: 'QueryDenomMetadata',  denom };    
    return useQuery<QueryDenomMetadataData>({ queryKey: [key], queryFn: async () => {
      const { denom } = key
      const res = await client.CosmosBankV_1Beta_1.query.queryDenomMetadata(denom);
        return res.data;
    }, ...options});
  }
  

  type QueryDenomMetadataByQueryStringMethod = typeof client.CosmosBankV_1Beta_1.query.queryDenomMetadataByQueryString;
  type QueryDenomMetadataByQueryStringData = Awaited<ReturnType<QueryDenomMetadataByQueryStringMethod>>["data"];
  const QueryDenomMetadataByQueryString = (query: NonNullable<Parameters<QueryDenomMetadataByQueryStringMethod>[0]>, options: Partial<UseQueryOptions<QueryDenomMetadataByQueryStringData>>) => {
    const key = { type: 'QueryDenomMetadataByQueryString', query };    
    return useQuery<QueryDenomMetadataByQueryStringData>({ queryKey: [key], queryFn: async () => {
      const {query } = key
      const res = await client.CosmosBankV_1Beta_1.query.queryDenomMetadataByQueryString(query ?? undefined);
        return res.data;
    }, ...options});
  }
  
  type QueryDenomOwnersMethod = typeof client.CosmosBankV_1Beta_1.query.queryDenomOwners;
  type QueryDenomOwnersData = Awaited<ReturnType<QueryDenomOwnersMethod>>["data"] & { pageParam: number };
  const QueryDenomOwners = (denom: string, query:  NonNullable<Parameters<QueryDenomOwnersMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryDenomOwnersData, unknown, InfiniteData<QueryDenomOwnersData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDenomOwners',  denom, query };    
    return useInfiniteQuery<QueryDenomOwnersData, unknown, InfiniteData<QueryDenomOwnersData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { denom,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBankV_1Beta_1.query.queryDenomOwners(denom, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryDenomOwnersByQueryMethod = typeof client.CosmosBankV_1Beta_1.query.queryDenomOwnersByQuery;
  type QueryDenomOwnersByQueryData = Awaited<ReturnType<QueryDenomOwnersByQueryMethod>>["data"] & { pageParam: number };
  const QueryDenomOwnersByQuery = (query:  NonNullable<Parameters<QueryDenomOwnersByQueryMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryDenomOwnersByQueryData, unknown, InfiniteData<QueryDenomOwnersByQueryData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDenomOwnersByQuery', query };    
    return useInfiniteQuery<QueryDenomOwnersByQueryData, unknown, InfiniteData<QueryDenomOwnersByQueryData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBankV_1Beta_1.query.queryDenomOwnersByQuery(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QuerySendEnabledMethod = typeof client.CosmosBankV_1Beta_1.query.querySendEnabled;
  type QuerySendEnabledData = Awaited<ReturnType<QuerySendEnabledMethod>>["data"] & { pageParam: number };
  const QuerySendEnabled = (query:  NonNullable<Parameters<QuerySendEnabledMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QuerySendEnabledData, unknown, InfiniteData<QuerySendEnabledData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QuerySendEnabled', query };    
    return useInfiniteQuery<QuerySendEnabledData, unknown, InfiniteData<QuerySendEnabledData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosBankV_1Beta_1.query.querySendEnabled(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryBalance,QueryAllBalances,QuerySpendableBalances,QuerySpendableBalanceByDenom,QueryTotalSupply,QuerySupplyOf,QueryParams,QueryDenomsMetadata,QueryDenomMetadata,QueryDenomMetadataByQueryString,QueryDenomOwners,QueryDenomOwnersByQuery,QuerySendEnabled,
  }
}
