/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useSurchainIdentityV_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.SurchainIdentityV_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.SurchainIdentityV_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  

  type QueryGetUserProfileMethod = typeof client.SurchainIdentityV_1.query.queryGetUserProfile;
  type QueryGetUserProfileData = Awaited<ReturnType<QueryGetUserProfileMethod>>["data"];
  const QueryGetUserProfile = (username: string,  options: Partial<UseQueryOptions<QueryGetUserProfileData>>) => {
    const key = { type: 'QueryGetUserProfile',  username };    
    return useQuery<QueryGetUserProfileData>({ queryKey: [key], queryFn: async () => {
      const { username } = key
      const res = await client.SurchainIdentityV_1.query.queryGetUserProfile(username);
        return res.data;
    }, ...options});
  }
  

  type QueryGetDeviceCommitmentMethod = typeof client.SurchainIdentityV_1.query.queryGetDeviceCommitment;
  type QueryGetDeviceCommitmentData = Awaited<ReturnType<QueryGetDeviceCommitmentMethod>>["data"];
  const QueryGetDeviceCommitment = (username: string, device_index: string,  options: Partial<UseQueryOptions<QueryGetDeviceCommitmentData>>) => {
    const key = { type: 'QueryGetDeviceCommitment',  username,  device_index };    
    return useQuery<QueryGetDeviceCommitmentData>({ queryKey: [key], queryFn: async () => {
      const { username,  device_index } = key
      const res = await client.SurchainIdentityV_1.query.queryGetDeviceCommitment(username, device_index);
        return res.data;
    }, ...options});
  }
  
  return {QueryParams,QueryGetUserProfile,QueryGetDeviceCommitment,
  }
}
