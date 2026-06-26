/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosParamsV_1Beta_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.CosmosParamsV_1Beta_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = (query: NonNullable<Parameters<QueryParamsMethod>[0]>, options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams', query };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const {query } = key
      const res = await client.CosmosParamsV_1Beta_1.query.queryParams(query ?? undefined);
        return res.data;
    }, ...options});
  }
  

  type QuerySubspacesMethod = typeof client.CosmosParamsV_1Beta_1.query.querySubspaces;
  type QuerySubspacesData = Awaited<ReturnType<QuerySubspacesMethod>>["data"];
  const QuerySubspaces = ( options: Partial<UseQueryOptions<QuerySubspacesData>>) => {
    const key = { type: 'QuerySubspaces',  };    
    return useQuery<QuerySubspacesData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosParamsV_1Beta_1.query.querySubspaces();
        return res.data;
    }, ...options});
  }
  
  return {QueryParams,QuerySubspaces,
  }
}
