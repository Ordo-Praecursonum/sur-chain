/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosAuthV_1Beta_1() {
  const client = useClient();
  type QueryAccountsMethod = typeof client.CosmosAuthV_1Beta_1.query.queryAccounts;
  type QueryAccountsData = Awaited<ReturnType<QueryAccountsMethod>>["data"] & { pageParam: number };
  const QueryAccounts = (query:  NonNullable<Parameters<QueryAccountsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryAccountsData, unknown, InfiniteData<QueryAccountsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryAccounts', query };    
    return useInfiniteQuery<QueryAccountsData, unknown, InfiniteData<QueryAccountsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosAuthV_1Beta_1.query.queryAccounts(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryAccountMethod = typeof client.CosmosAuthV_1Beta_1.query.queryAccount;
  type QueryAccountData = Awaited<ReturnType<QueryAccountMethod>>["data"];
  const QueryAccount = (address: string,  options: Partial<UseQueryOptions<QueryAccountData>>) => {
    const key = { type: 'QueryAccount',  address };    
    return useQuery<QueryAccountData>({ queryKey: [key], queryFn: async () => {
      const { address } = key
      const res = await client.CosmosAuthV_1Beta_1.query.queryAccount(address);
        return res.data;
    }, ...options});
  }
  

  type QueryAccountAddressByIDMethod = typeof client.CosmosAuthV_1Beta_1.query.queryAccountAddressById;
  type QueryAccountAddressByIDData = Awaited<ReturnType<QueryAccountAddressByIDMethod>>["data"];
  const QueryAccountAddressByID = (id: string, query: NonNullable<Parameters<QueryAccountAddressByIDMethod>[1]>, options: Partial<UseQueryOptions<QueryAccountAddressByIDData>>) => {
    const key = { type: 'QueryAccountAddressByID',  id, query };    
    return useQuery<QueryAccountAddressByIDData>({ queryKey: [key], queryFn: async () => {
      const { id,query } = key
      const res = await client.CosmosAuthV_1Beta_1.query.queryAccountAddressById(id, query ?? undefined);
        return res.data;
    }, ...options});
  }
  

  type QueryParamsMethod = typeof client.CosmosAuthV_1Beta_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosAuthV_1Beta_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  

  type QueryModuleAccountsMethod = typeof client.CosmosAuthV_1Beta_1.query.queryModuleAccounts;
  type QueryModuleAccountsData = Awaited<ReturnType<QueryModuleAccountsMethod>>["data"];
  const QueryModuleAccounts = ( options: Partial<UseQueryOptions<QueryModuleAccountsData>>) => {
    const key = { type: 'QueryModuleAccounts',  };    
    return useQuery<QueryModuleAccountsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosAuthV_1Beta_1.query.queryModuleAccounts();
        return res.data;
    }, ...options});
  }
  

  type QueryModuleAccountByNameMethod = typeof client.CosmosAuthV_1Beta_1.query.queryModuleAccountByName;
  type QueryModuleAccountByNameData = Awaited<ReturnType<QueryModuleAccountByNameMethod>>["data"];
  const QueryModuleAccountByName = (name: string,  options: Partial<UseQueryOptions<QueryModuleAccountByNameData>>) => {
    const key = { type: 'QueryModuleAccountByName',  name };    
    return useQuery<QueryModuleAccountByNameData>({ queryKey: [key], queryFn: async () => {
      const { name } = key
      const res = await client.CosmosAuthV_1Beta_1.query.queryModuleAccountByName(name);
        return res.data;
    }, ...options});
  }
  

  type QueryBech32PrefixMethod = typeof client.CosmosAuthV_1Beta_1.query.queryBech32Prefix;
  type QueryBech32PrefixData = Awaited<ReturnType<QueryBech32PrefixMethod>>["data"];
  const QueryBech32Prefix = ( options: Partial<UseQueryOptions<QueryBech32PrefixData>>) => {
    const key = { type: 'QueryBech32Prefix',  };    
    return useQuery<QueryBech32PrefixData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosAuthV_1Beta_1.query.queryBech32Prefix();
        return res.data;
    }, ...options});
  }
  

  type QueryAddressBytesToStringMethod = typeof client.CosmosAuthV_1Beta_1.query.queryAddressBytesToString;
  type QueryAddressBytesToStringData = Awaited<ReturnType<QueryAddressBytesToStringMethod>>["data"];
  const QueryAddressBytesToString = (address_bytes: string,  options: Partial<UseQueryOptions<QueryAddressBytesToStringData>>) => {
    const key = { type: 'QueryAddressBytesToString',  address_bytes };    
    return useQuery<QueryAddressBytesToStringData>({ queryKey: [key], queryFn: async () => {
      const { address_bytes } = key
      const res = await client.CosmosAuthV_1Beta_1.query.queryAddressBytesToString(address_bytes);
        return res.data;
    }, ...options});
  }
  

  type QueryAddressStringToBytesMethod = typeof client.CosmosAuthV_1Beta_1.query.queryAddressStringToBytes;
  type QueryAddressStringToBytesData = Awaited<ReturnType<QueryAddressStringToBytesMethod>>["data"];
  const QueryAddressStringToBytes = (address_string: string,  options: Partial<UseQueryOptions<QueryAddressStringToBytesData>>) => {
    const key = { type: 'QueryAddressStringToBytes',  address_string };    
    return useQuery<QueryAddressStringToBytesData>({ queryKey: [key], queryFn: async () => {
      const { address_string } = key
      const res = await client.CosmosAuthV_1Beta_1.query.queryAddressStringToBytes(address_string);
        return res.data;
    }, ...options});
  }
  

  type QueryAccountInfoMethod = typeof client.CosmosAuthV_1Beta_1.query.queryAccountInfo;
  type QueryAccountInfoData = Awaited<ReturnType<QueryAccountInfoMethod>>["data"];
  const QueryAccountInfo = (address: string,  options: Partial<UseQueryOptions<QueryAccountInfoData>>) => {
    const key = { type: 'QueryAccountInfo',  address };    
    return useQuery<QueryAccountInfoData>({ queryKey: [key], queryFn: async () => {
      const { address } = key
      const res = await client.CosmosAuthV_1Beta_1.query.queryAccountInfo(address);
        return res.data;
    }, ...options});
  }
  
  return {QueryAccounts,QueryAccount,QueryAccountAddressByID,QueryParams,QueryModuleAccounts,QueryModuleAccountByName,QueryBech32Prefix,QueryAddressBytesToString,QueryAddressStringToBytes,QueryAccountInfo,
  }
}
