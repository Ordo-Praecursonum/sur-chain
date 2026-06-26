/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcCoreConnectionV_1() {
  const client = useClient();

  type QueryConnectionMethod = typeof client.IbcCoreConnectionV_1.query.queryConnection;
  type QueryConnectionData = Awaited<ReturnType<QueryConnectionMethod>>["data"];
  const QueryConnection = (connection_id: string,  options: Partial<UseQueryOptions<QueryConnectionData>>) => {
    const key = { type: 'QueryConnection',  connection_id };    
    return useQuery<QueryConnectionData>({ queryKey: [key], queryFn: async () => {
      const { connection_id } = key
      const res = await client.IbcCoreConnectionV_1.query.queryConnection(connection_id);
        return res.data;
    }, ...options});
  }
  
  type QueryConnectionsMethod = typeof client.IbcCoreConnectionV_1.query.queryConnections;
  type QueryConnectionsData = Awaited<ReturnType<QueryConnectionsMethod>>["data"] & { pageParam: number };
  const QueryConnections = (query:  NonNullable<Parameters<QueryConnectionsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryConnectionsData, unknown, InfiniteData<QueryConnectionsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryConnections', query };    
    return useInfiniteQuery<QueryConnectionsData, unknown, InfiniteData<QueryConnectionsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreConnectionV_1.query.queryConnections(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryClientConnectionsMethod = typeof client.IbcCoreConnectionV_1.query.queryClientConnections;
  type QueryClientConnectionsData = Awaited<ReturnType<QueryClientConnectionsMethod>>["data"];
  const QueryClientConnections = (client_id: string,  options: Partial<UseQueryOptions<QueryClientConnectionsData>>) => {
    const key = { type: 'QueryClientConnections',  client_id };    
    return useQuery<QueryClientConnectionsData>({ queryKey: [key], queryFn: async () => {
      const { client_id } = key
      const res = await client.IbcCoreConnectionV_1.query.queryClientConnections(client_id);
        return res.data;
    }, ...options});
  }
  

  type QueryConnectionClientStateMethod = typeof client.IbcCoreConnectionV_1.query.queryConnectionClientState;
  type QueryConnectionClientStateData = Awaited<ReturnType<QueryConnectionClientStateMethod>>["data"];
  const QueryConnectionClientState = (connection_id: string,  options: Partial<UseQueryOptions<QueryConnectionClientStateData>>) => {
    const key = { type: 'QueryConnectionClientState',  connection_id };    
    return useQuery<QueryConnectionClientStateData>({ queryKey: [key], queryFn: async () => {
      const { connection_id } = key
      const res = await client.IbcCoreConnectionV_1.query.queryConnectionClientState(connection_id);
        return res.data;
    }, ...options});
  }
  

  type QueryConnectionConsensusStateMethod = typeof client.IbcCoreConnectionV_1.query.queryConnectionConsensusState;
  type QueryConnectionConsensusStateData = Awaited<ReturnType<QueryConnectionConsensusStateMethod>>["data"];
  const QueryConnectionConsensusState = (connection_id: string, revision_number: string, revision_height: string,  options: Partial<UseQueryOptions<QueryConnectionConsensusStateData>>) => {
    const key = { type: 'QueryConnectionConsensusState',  connection_id,  revision_number,  revision_height };    
    return useQuery<QueryConnectionConsensusStateData>({ queryKey: [key], queryFn: async () => {
      const { connection_id,  revision_number,  revision_height } = key
      const res = await client.IbcCoreConnectionV_1.query.queryConnectionConsensusState(connection_id, revision_number, revision_height);
        return res.data;
    }, ...options});
  }
  

  type QueryConnectionParamsMethod = typeof client.IbcCoreConnectionV_1.query.queryConnectionParams;
  type QueryConnectionParamsData = Awaited<ReturnType<QueryConnectionParamsMethod>>["data"];
  const QueryConnectionParams = ( options: Partial<UseQueryOptions<QueryConnectionParamsData>>) => {
    const key = { type: 'QueryConnectionParams',  };    
    return useQuery<QueryConnectionParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcCoreConnectionV_1.query.queryConnectionParams();
        return res.data;
    }, ...options});
  }
  
  return {QueryConnection,QueryConnections,QueryClientConnections,QueryConnectionClientState,QueryConnectionConsensusState,QueryConnectionParams,
  }
}
