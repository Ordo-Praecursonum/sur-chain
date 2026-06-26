/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcCoreClientV_1() {
  const client = useClient();

  type QueryClientStateMethod = typeof client.IbcCoreClientV_1.query.queryClientState;
  type QueryClientStateData = Awaited<ReturnType<QueryClientStateMethod>>["data"];
  const QueryClientState = (client_id: string,  options: Partial<UseQueryOptions<QueryClientStateData>>) => {
    const key = { type: 'QueryClientState',  client_id };    
    return useQuery<QueryClientStateData>({ queryKey: [key], queryFn: async () => {
      const { client_id } = key
      const res = await client.IbcCoreClientV_1.query.queryClientState(client_id);
        return res.data;
    }, ...options});
  }
  
  type QueryClientStatesMethod = typeof client.IbcCoreClientV_1.query.queryClientStates;
  type QueryClientStatesData = Awaited<ReturnType<QueryClientStatesMethod>>["data"] & { pageParam: number };
  const QueryClientStates = (query:  NonNullable<Parameters<QueryClientStatesMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryClientStatesData, unknown, InfiniteData<QueryClientStatesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryClientStates', query };    
    return useInfiniteQuery<QueryClientStatesData, unknown, InfiniteData<QueryClientStatesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreClientV_1.query.queryClientStates(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryConsensusStateMethod = typeof client.IbcCoreClientV_1.query.queryConsensusState;
  type QueryConsensusStateData = Awaited<ReturnType<QueryConsensusStateMethod>>["data"];
  const QueryConsensusState = (client_id: string, revision_number: string, revision_height: string, query: NonNullable<Parameters<QueryConsensusStateMethod>[3]>, options: Partial<UseQueryOptions<QueryConsensusStateData>>) => {
    const key = { type: 'QueryConsensusState',  client_id,  revision_number,  revision_height, query };    
    return useQuery<QueryConsensusStateData>({ queryKey: [key], queryFn: async () => {
      const { client_id,  revision_number,  revision_height,query } = key
      const res = await client.IbcCoreClientV_1.query.queryConsensusState(client_id, revision_number, revision_height, query ?? undefined);
        return res.data;
    }, ...options});
  }
  
  type QueryConsensusStatesMethod = typeof client.IbcCoreClientV_1.query.queryConsensusStates;
  type QueryConsensusStatesData = Awaited<ReturnType<QueryConsensusStatesMethod>>["data"] & { pageParam: number };
  const QueryConsensusStates = (client_id: string, query:  NonNullable<Parameters<QueryConsensusStatesMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryConsensusStatesData, unknown, InfiniteData<QueryConsensusStatesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryConsensusStates',  client_id, query };    
    return useInfiniteQuery<QueryConsensusStatesData, unknown, InfiniteData<QueryConsensusStatesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { client_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreClientV_1.query.queryConsensusStates(client_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryConsensusStateHeightsMethod = typeof client.IbcCoreClientV_1.query.queryConsensusStateHeights;
  type QueryConsensusStateHeightsData = Awaited<ReturnType<QueryConsensusStateHeightsMethod>>["data"] & { pageParam: number };
  const QueryConsensusStateHeights = (client_id: string, query:  NonNullable<Parameters<QueryConsensusStateHeightsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryConsensusStateHeightsData, unknown, InfiniteData<QueryConsensusStateHeightsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryConsensusStateHeights',  client_id, query };    
    return useInfiniteQuery<QueryConsensusStateHeightsData, unknown, InfiniteData<QueryConsensusStateHeightsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { client_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreClientV_1.query.queryConsensusStateHeights(client_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryClientStatusMethod = typeof client.IbcCoreClientV_1.query.queryClientStatus;
  type QueryClientStatusData = Awaited<ReturnType<QueryClientStatusMethod>>["data"];
  const QueryClientStatus = (client_id: string,  options: Partial<UseQueryOptions<QueryClientStatusData>>) => {
    const key = { type: 'QueryClientStatus',  client_id };    
    return useQuery<QueryClientStatusData>({ queryKey: [key], queryFn: async () => {
      const { client_id } = key
      const res = await client.IbcCoreClientV_1.query.queryClientStatus(client_id);
        return res.data;
    }, ...options});
  }
  

  type QueryClientParamsMethod = typeof client.IbcCoreClientV_1.query.queryClientParams;
  type QueryClientParamsData = Awaited<ReturnType<QueryClientParamsMethod>>["data"];
  const QueryClientParams = ( options: Partial<UseQueryOptions<QueryClientParamsData>>) => {
    const key = { type: 'QueryClientParams',  };    
    return useQuery<QueryClientParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcCoreClientV_1.query.queryClientParams();
        return res.data;
    }, ...options});
  }
  

  type QueryClientCreatorMethod = typeof client.IbcCoreClientV_1.query.queryClientCreator;
  type QueryClientCreatorData = Awaited<ReturnType<QueryClientCreatorMethod>>["data"];
  const QueryClientCreator = (client_id: string,  options: Partial<UseQueryOptions<QueryClientCreatorData>>) => {
    const key = { type: 'QueryClientCreator',  client_id };    
    return useQuery<QueryClientCreatorData>({ queryKey: [key], queryFn: async () => {
      const { client_id } = key
      const res = await client.IbcCoreClientV_1.query.queryClientCreator(client_id);
        return res.data;
    }, ...options});
  }
  

  type QueryUpgradedClientStateMethod = typeof client.IbcCoreClientV_1.query.queryUpgradedClientState;
  type QueryUpgradedClientStateData = Awaited<ReturnType<QueryUpgradedClientStateMethod>>["data"];
  const QueryUpgradedClientState = ( options: Partial<UseQueryOptions<QueryUpgradedClientStateData>>) => {
    const key = { type: 'QueryUpgradedClientState',  };    
    return useQuery<QueryUpgradedClientStateData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcCoreClientV_1.query.queryUpgradedClientState();
        return res.data;
    }, ...options});
  }
  

  type QueryUpgradedConsensusStateMethod = typeof client.IbcCoreClientV_1.query.queryUpgradedConsensusState;
  type QueryUpgradedConsensusStateData = Awaited<ReturnType<QueryUpgradedConsensusStateMethod>>["data"];
  const QueryUpgradedConsensusState = ( options: Partial<UseQueryOptions<QueryUpgradedConsensusStateData>>) => {
    const key = { type: 'QueryUpgradedConsensusState',  };    
    return useQuery<QueryUpgradedConsensusStateData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcCoreClientV_1.query.queryUpgradedConsensusState();
        return res.data;
    }, ...options});
  }
  

  type QueryVerifyMembershipMethod = typeof client.IbcCoreClientV_1.query.queryVerifyMembership;
  type QueryVerifyMembershipData = Awaited<ReturnType<QueryVerifyMembershipMethod>>["data"];
  const QueryVerifyMembership = ( options: Partial<UseQueryOptions<QueryVerifyMembershipData>>) => {
    const key = { type: 'QueryVerifyMembership',  };    
    return useQuery<QueryVerifyMembershipData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcCoreClientV_1.query.queryVerifyMembership({...key});
        return res.data;
    }, ...options});
  }
  
  return {QueryClientState,QueryClientStates,QueryConsensusState,QueryConsensusStates,QueryConsensusStateHeights,QueryClientStatus,QueryClientParams,QueryClientCreator,QueryUpgradedClientState,QueryUpgradedConsensusState,QueryVerifyMembership,
  }
}
