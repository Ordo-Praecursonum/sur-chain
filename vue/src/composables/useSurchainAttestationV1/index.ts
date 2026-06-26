/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useSurchainAttestationV_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.SurchainAttestationV_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.SurchainAttestationV_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  

  type QueryIsNullifierUsedMethod = typeof client.SurchainAttestationV_1.query.queryIsNullifierUsed;
  type QueryIsNullifierUsedData = Awaited<ReturnType<QueryIsNullifierUsedMethod>>["data"];
  const QueryIsNullifierUsed = (nullifier: string,  options: Partial<UseQueryOptions<QueryIsNullifierUsedData>>) => {
    const key = { type: 'QueryIsNullifierUsed',  nullifier };    
    return useQuery<QueryIsNullifierUsedData>({ queryKey: [key], queryFn: async () => {
      const { nullifier } = key
      const res = await client.SurchainAttestationV_1.query.queryIsNullifierUsed(nullifier);
        return res.data;
    }, ...options});
  }
  

  type QueryGetAttestationMethod = typeof client.SurchainAttestationV_1.query.queryGetAttestation;
  type QueryGetAttestationData = Awaited<ReturnType<QueryGetAttestationMethod>>["data"];
  const QueryGetAttestation = (username: string, nullifier: string,  options: Partial<UseQueryOptions<QueryGetAttestationData>>) => {
    const key = { type: 'QueryGetAttestation',  username,  nullifier };    
    return useQuery<QueryGetAttestationData>({ queryKey: [key], queryFn: async () => {
      const { username,  nullifier } = key
      const res = await client.SurchainAttestationV_1.query.queryGetAttestation(username, nullifier);
        return res.data;
    }, ...options});
  }
  

  type QueryVerifyContentMethod = typeof client.SurchainAttestationV_1.query.queryVerifyContent;
  type QueryVerifyContentData = Awaited<ReturnType<QueryVerifyContentMethod>>["data"];
  const QueryVerifyContent = (content_hash_hex: string,  options: Partial<UseQueryOptions<QueryVerifyContentData>>) => {
    const key = { type: 'QueryVerifyContent',  content_hash_hex };    
    return useQuery<QueryVerifyContentData>({ queryKey: [key], queryFn: async () => {
      const { content_hash_hex } = key
      const res = await client.SurchainAttestationV_1.query.queryVerifyContent(content_hash_hex);
        return res.data;
    }, ...options});
  }
  
  return {QueryParams,QueryIsNullifierUsed,QueryGetAttestation,QueryVerifyContent,
  }
}
