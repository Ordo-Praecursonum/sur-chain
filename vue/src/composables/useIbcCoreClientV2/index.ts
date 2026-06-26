/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcCoreClientV_2() {
  const client = useClient();

  type QueryCounterpartyInfoMethod = typeof client.IbcCoreClientV_2.query.queryCounterpartyInfo;
  type QueryCounterpartyInfoData = Awaited<ReturnType<QueryCounterpartyInfoMethod>>["data"];
  const QueryCounterpartyInfo = (client_id: string,  options: Partial<UseQueryOptions<QueryCounterpartyInfoData>>) => {
    const key = { type: 'QueryCounterpartyInfo',  client_id };    
    return useQuery<QueryCounterpartyInfoData>({ queryKey: [key], queryFn: async () => {
      const { client_id } = key
      const res = await client.IbcCoreClientV_2.query.queryCounterpartyInfo(client_id);
        return res.data;
    }, ...options});
  }
  

  type QueryConfigMethod = typeof client.IbcCoreClientV_2.query.queryConfig;
  type QueryConfigData = Awaited<ReturnType<QueryConfigMethod>>["data"];
  const QueryConfig = (client_id: string,  options: Partial<UseQueryOptions<QueryConfigData>>) => {
    const key = { type: 'QueryConfig',  client_id };    
    return useQuery<QueryConfigData>({ queryKey: [key], queryFn: async () => {
      const { client_id } = key
      const res = await client.IbcCoreClientV_2.query.queryConfig(client_id);
        return res.data;
    }, ...options});
  }
  
  return {QueryCounterpartyInfo,QueryConfig,
  }
}
