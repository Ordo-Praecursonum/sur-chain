/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosTxV_1Beta_1() {
  const client = useClient();

  type ServiceSimulateMethod = typeof client.CosmosTxV_1Beta_1.query.serviceSimulate;
  type ServiceSimulateData = Awaited<ReturnType<ServiceSimulateMethod>>["data"];
  const ServiceSimulate = ( options: Partial<UseQueryOptions<ServiceSimulateData>>) => {
    const key = { type: 'ServiceSimulate',  };    
    return useQuery<ServiceSimulateData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosTxV_1Beta_1.query.serviceSimulate({...key});
        return res.data;
    }, ...options});
  }
  

  type ServiceGetTxMethod = typeof client.CosmosTxV_1Beta_1.query.serviceGetTx;
  type ServiceGetTxData = Awaited<ReturnType<ServiceGetTxMethod>>["data"];
  const ServiceGetTx = (hash: string,  options: Partial<UseQueryOptions<ServiceGetTxData>>) => {
    const key = { type: 'ServiceGetTx',  hash };    
    return useQuery<ServiceGetTxData>({ queryKey: [key], queryFn: async () => {
      const { hash } = key
      const res = await client.CosmosTxV_1Beta_1.query.serviceGetTx(hash);
        return res.data;
    }, ...options});
  }
  

  type ServiceBroadcastTxMethod = typeof client.CosmosTxV_1Beta_1.query.serviceBroadcastTx;
  type ServiceBroadcastTxData = Awaited<ReturnType<ServiceBroadcastTxMethod>>["data"];
  const ServiceBroadcastTx = ( options: Partial<UseQueryOptions<ServiceBroadcastTxData>>) => {
    const key = { type: 'ServiceBroadcastTx',  };    
    return useQuery<ServiceBroadcastTxData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosTxV_1Beta_1.query.serviceBroadcastTx({...key});
        return res.data;
    }, ...options});
  }
  
  type ServiceGetTxsEventMethod = typeof client.CosmosTxV_1Beta_1.query.serviceGetTxsEvent;
  type ServiceGetTxsEventData = Awaited<ReturnType<ServiceGetTxsEventMethod>>["data"] & { pageParam: number };
  const ServiceGetTxsEvent = (query:  NonNullable<Parameters<ServiceGetTxsEventMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<ServiceGetTxsEventData, unknown, InfiniteData<ServiceGetTxsEventData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'ServiceGetTxsEvent', query };    
    return useInfiniteQuery<ServiceGetTxsEventData, unknown, InfiniteData<ServiceGetTxsEventData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosTxV_1Beta_1.query.serviceGetTxsEvent(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type ServiceGetBlockWithTxsMethod = typeof client.CosmosTxV_1Beta_1.query.serviceGetBlockWithTxs;
  type ServiceGetBlockWithTxsData = Awaited<ReturnType<ServiceGetBlockWithTxsMethod>>["data"] & { pageParam: number };
  const ServiceGetBlockWithTxs = (height: string, query:  NonNullable<Parameters<ServiceGetBlockWithTxsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<ServiceGetBlockWithTxsData, unknown, InfiniteData<ServiceGetBlockWithTxsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'ServiceGetBlockWithTxs',  height, query };    
    return useInfiniteQuery<ServiceGetBlockWithTxsData, unknown, InfiniteData<ServiceGetBlockWithTxsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { height,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosTxV_1Beta_1.query.serviceGetBlockWithTxs(height, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type ServiceTxDecodeMethod = typeof client.CosmosTxV_1Beta_1.query.serviceTxDecode;
  type ServiceTxDecodeData = Awaited<ReturnType<ServiceTxDecodeMethod>>["data"];
  const ServiceTxDecode = ( options: Partial<UseQueryOptions<ServiceTxDecodeData>>) => {
    const key = { type: 'ServiceTxDecode',  };    
    return useQuery<ServiceTxDecodeData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosTxV_1Beta_1.query.serviceTxDecode({...key});
        return res.data;
    }, ...options});
  }
  

  type ServiceTxEncodeMethod = typeof client.CosmosTxV_1Beta_1.query.serviceTxEncode;
  type ServiceTxEncodeData = Awaited<ReturnType<ServiceTxEncodeMethod>>["data"];
  const ServiceTxEncode = ( options: Partial<UseQueryOptions<ServiceTxEncodeData>>) => {
    const key = { type: 'ServiceTxEncode',  };    
    return useQuery<ServiceTxEncodeData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosTxV_1Beta_1.query.serviceTxEncode({...key});
        return res.data;
    }, ...options});
  }
  

  type ServiceTxEncodeAminoMethod = typeof client.CosmosTxV_1Beta_1.query.serviceTxEncodeAmino;
  type ServiceTxEncodeAminoData = Awaited<ReturnType<ServiceTxEncodeAminoMethod>>["data"];
  const ServiceTxEncodeAmino = ( options: Partial<UseQueryOptions<ServiceTxEncodeAminoData>>) => {
    const key = { type: 'ServiceTxEncodeAmino',  };    
    return useQuery<ServiceTxEncodeAminoData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosTxV_1Beta_1.query.serviceTxEncodeAmino({...key});
        return res.data;
    }, ...options});
  }
  

  type ServiceTxDecodeAminoMethod = typeof client.CosmosTxV_1Beta_1.query.serviceTxDecodeAmino;
  type ServiceTxDecodeAminoData = Awaited<ReturnType<ServiceTxDecodeAminoMethod>>["data"];
  const ServiceTxDecodeAmino = ( options: Partial<UseQueryOptions<ServiceTxDecodeAminoData>>) => {
    const key = { type: 'ServiceTxDecodeAmino',  };    
    return useQuery<ServiceTxDecodeAminoData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosTxV_1Beta_1.query.serviceTxDecodeAmino({...key});
        return res.data;
    }, ...options});
  }
  
  return {ServiceSimulate,ServiceGetTx,ServiceBroadcastTx,ServiceGetTxsEvent,ServiceGetBlockWithTxs,ServiceTxDecode,ServiceTxEncode,ServiceTxEncodeAmino,ServiceTxDecodeAmino,
  }
}
