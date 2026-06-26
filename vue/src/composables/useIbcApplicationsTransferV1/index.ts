/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcApplicationsTransferV_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.IbcApplicationsTransferV_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcApplicationsTransferV_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  
  type QueryDenomsMethod = typeof client.IbcApplicationsTransferV_1.query.queryDenoms;
  type QueryDenomsData = Awaited<ReturnType<QueryDenomsMethod>>["data"] & { pageParam: number };
  const QueryDenoms = (query:  NonNullable<Parameters<QueryDenomsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryDenomsData, unknown, InfiniteData<QueryDenomsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDenoms', query };    
    return useInfiniteQuery<QueryDenomsData, unknown, InfiniteData<QueryDenomsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcApplicationsTransferV_1.query.queryDenoms(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryDenomMethod = typeof client.IbcApplicationsTransferV_1.query.queryDenom;
  type QueryDenomData = Awaited<ReturnType<QueryDenomMethod>>["data"];
  const QueryDenom = (hash: string,  options: Partial<UseQueryOptions<QueryDenomData>>) => {
    const key = { type: 'QueryDenom',  hash };    
    return useQuery<QueryDenomData>({ queryKey: [key], queryFn: async () => {
      const { hash } = key
      const res = await client.IbcApplicationsTransferV_1.query.queryDenom(hash);
        return res.data;
    }, ...options});
  }
  

  type QueryDenomHashMethod = typeof client.IbcApplicationsTransferV_1.query.queryDenomHash;
  type QueryDenomHashData = Awaited<ReturnType<QueryDenomHashMethod>>["data"];
  const QueryDenomHash = (trace: string,  options: Partial<UseQueryOptions<QueryDenomHashData>>) => {
    const key = { type: 'QueryDenomHash',  trace };    
    return useQuery<QueryDenomHashData>({ queryKey: [key], queryFn: async () => {
      const { trace } = key
      const res = await client.IbcApplicationsTransferV_1.query.queryDenomHash(trace);
        return res.data;
    }, ...options});
  }
  

  type QueryEscrowAddressMethod = typeof client.IbcApplicationsTransferV_1.query.queryEscrowAddress;
  type QueryEscrowAddressData = Awaited<ReturnType<QueryEscrowAddressMethod>>["data"];
  const QueryEscrowAddress = (channel_id: string, port_id: string,  options: Partial<UseQueryOptions<QueryEscrowAddressData>>) => {
    const key = { type: 'QueryEscrowAddress',  channel_id,  port_id };    
    return useQuery<QueryEscrowAddressData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id } = key
      const res = await client.IbcApplicationsTransferV_1.query.queryEscrowAddress(channel_id, port_id);
        return res.data;
    }, ...options});
  }
  

  type QueryTotalEscrowForDenomMethod = typeof client.IbcApplicationsTransferV_1.query.queryTotalEscrowForDenom;
  type QueryTotalEscrowForDenomData = Awaited<ReturnType<QueryTotalEscrowForDenomMethod>>["data"];
  const QueryTotalEscrowForDenom = (denom: string,  options: Partial<UseQueryOptions<QueryTotalEscrowForDenomData>>) => {
    const key = { type: 'QueryTotalEscrowForDenom',  denom };    
    return useQuery<QueryTotalEscrowForDenomData>({ queryKey: [key], queryFn: async () => {
      const { denom } = key
      const res = await client.IbcApplicationsTransferV_1.query.queryTotalEscrowForDenom(denom);
        return res.data;
    }, ...options});
  }
  
  return {QueryParams,QueryDenoms,QueryDenom,QueryDenomHash,QueryEscrowAddress,QueryTotalEscrowForDenom,
  }
}
