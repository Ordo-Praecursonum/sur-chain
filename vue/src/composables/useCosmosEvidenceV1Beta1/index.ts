/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosEvidenceV_1Beta_1() {
  const client = useClient();

  type QueryEvidenceMethod = typeof client.CosmosEvidenceV_1Beta_1.query.queryEvidence;
  type QueryEvidenceData = Awaited<ReturnType<QueryEvidenceMethod>>["data"];
  const QueryEvidence = (hash: string, query: NonNullable<Parameters<QueryEvidenceMethod>[1]>, options: Partial<UseQueryOptions<QueryEvidenceData>>) => {
    const key = { type: 'QueryEvidence',  hash, query };    
    return useQuery<QueryEvidenceData>({ queryKey: [key], queryFn: async () => {
      const { hash,query } = key
      const res = await client.CosmosEvidenceV_1Beta_1.query.queryEvidence(hash, query ?? undefined);
        return res.data;
    }, ...options});
  }
  
  type QueryAllEvidenceMethod = typeof client.CosmosEvidenceV_1Beta_1.query.queryAllEvidence;
  type QueryAllEvidenceData = Awaited<ReturnType<QueryAllEvidenceMethod>>["data"] & { pageParam: number };
  const QueryAllEvidence = (query:  NonNullable<Parameters<QueryAllEvidenceMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryAllEvidenceData, unknown, InfiniteData<QueryAllEvidenceData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryAllEvidence', query };    
    return useInfiniteQuery<QueryAllEvidenceData, unknown, InfiniteData<QueryAllEvidenceData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosEvidenceV_1Beta_1.query.queryAllEvidence(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryEvidence,QueryAllEvidence,
  }
}
