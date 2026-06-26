/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcApplicationsInterchainAccountsControllerV_1() {
  const client = useClient();

  type QueryInterchainAccountMethod = typeof client.IbcApplicationsInterchainAccountsControllerV_1.query.queryInterchainAccount;
  type QueryInterchainAccountData = Awaited<ReturnType<QueryInterchainAccountMethod>>["data"];
  const QueryInterchainAccount = (owner: string, connection_id: string,  options: Partial<UseQueryOptions<QueryInterchainAccountData>>) => {
    const key = { type: 'QueryInterchainAccount',  owner,  connection_id };    
    return useQuery<QueryInterchainAccountData>({ queryKey: [key], queryFn: async () => {
      const { owner,  connection_id } = key
      const res = await client.IbcApplicationsInterchainAccountsControllerV_1.query.queryInterchainAccount(owner, connection_id);
        return res.data;
    }, ...options});
  }
  

  type QueryParamsMethod = typeof client.IbcApplicationsInterchainAccountsControllerV_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.IbcApplicationsInterchainAccountsControllerV_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  
  return {QueryInterchainAccount,QueryParams,
  }
}
