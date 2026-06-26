/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcApplicationsInterchainAccountsHostV_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.IbcApplicationsInterchainAccountsHostV_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcApplicationsInterchainAccountsHostV_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  
  return {QueryParams,
  }
}
