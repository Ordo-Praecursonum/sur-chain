/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosMintV_1Beta_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.CosmosMintV_1Beta_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosMintV_1Beta_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  

  type QueryInflationMethod = typeof client.CosmosMintV_1Beta_1.query.queryInflation;
  type QueryInflationData = Awaited<ReturnType<QueryInflationMethod>>["data"];
  const QueryInflation = ( options: Partial<UseQueryOptions<QueryInflationData>>) => {
    const key = { type: 'QueryInflation',  };    
    return useQuery<QueryInflationData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosMintV_1Beta_1.query.queryInflation();
        return res.data;
    }, ...options});
  }
  

  type QueryAnnualProvisionsMethod = typeof client.CosmosMintV_1Beta_1.query.queryAnnualProvisions;
  type QueryAnnualProvisionsData = Awaited<ReturnType<QueryAnnualProvisionsMethod>>["data"];
  const QueryAnnualProvisions = ( options: Partial<UseQueryOptions<QueryAnnualProvisionsData>>) => {
    const key = { type: 'QueryAnnualProvisions',  };    
    return useQuery<QueryAnnualProvisionsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosMintV_1Beta_1.query.queryAnnualProvisions();
        return res.data;
    }, ...options});
  }
  
  return {QueryParams,QueryInflation,QueryAnnualProvisions,
  }
}
