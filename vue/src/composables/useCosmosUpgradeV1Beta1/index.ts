/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosUpgradeV_1Beta_1() {
  const client = useClient();

  type QueryCurrentPlanMethod = typeof client.CosmosUpgradeV_1Beta_1.query.queryCurrentPlan;
  type QueryCurrentPlanData = Awaited<ReturnType<QueryCurrentPlanMethod>>["data"];
  const QueryCurrentPlan = ( options: Partial<UseQueryOptions<QueryCurrentPlanData>>) => {
    const key = { type: 'QueryCurrentPlan',  };    
    return useQuery<QueryCurrentPlanData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosUpgradeV_1Beta_1.query.queryCurrentPlan();
        return res.data;
    }, ...options});
  }
  

  type QueryAppliedPlanMethod = typeof client.CosmosUpgradeV_1Beta_1.query.queryAppliedPlan;
  type QueryAppliedPlanData = Awaited<ReturnType<QueryAppliedPlanMethod>>["data"];
  const QueryAppliedPlan = (name: string,  options: Partial<UseQueryOptions<QueryAppliedPlanData>>) => {
    const key = { type: 'QueryAppliedPlan',  name };    
    return useQuery<QueryAppliedPlanData>({ queryKey: [key], queryFn: async () => {
      const { name } = key
      const res = await client.CosmosUpgradeV_1Beta_1.query.queryAppliedPlan(name);
        return res.data;
    }, ...options});
  }
  

  type QueryUpgradedConsensusStateMethod = typeof client.CosmosUpgradeV_1Beta_1.query.queryUpgradedConsensusState;
  type QueryUpgradedConsensusStateData = Awaited<ReturnType<QueryUpgradedConsensusStateMethod>>["data"];
  const QueryUpgradedConsensusState = (last_height: string,  options: Partial<UseQueryOptions<QueryUpgradedConsensusStateData>>) => {
    const key = { type: 'QueryUpgradedConsensusState',  last_height };    
    return useQuery<QueryUpgradedConsensusStateData>({ queryKey: [key], queryFn: async () => {
      const { last_height } = key
      const res = await client.CosmosUpgradeV_1Beta_1.query.queryUpgradedConsensusState(last_height);
        return res.data;
    }, ...options});
  }
  

  type QueryModuleVersionsMethod = typeof client.CosmosUpgradeV_1Beta_1.query.queryModuleVersions;
  type QueryModuleVersionsData = Awaited<ReturnType<QueryModuleVersionsMethod>>["data"];
  const QueryModuleVersions = (query: NonNullable<Parameters<QueryModuleVersionsMethod>[0]>, options: Partial<UseQueryOptions<QueryModuleVersionsData>>) => {
    const key = { type: 'QueryModuleVersions', query };    
    return useQuery<QueryModuleVersionsData>({ queryKey: [key], queryFn: async () => {
      const {query } = key
      const res = await client.CosmosUpgradeV_1Beta_1.query.queryModuleVersions(query ?? undefined);
        return res.data;
    }, ...options});
  }
  

  type QueryAuthorityMethod = typeof client.CosmosUpgradeV_1Beta_1.query.queryAuthority;
  type QueryAuthorityData = Awaited<ReturnType<QueryAuthorityMethod>>["data"];
  const QueryAuthority = ( options: Partial<UseQueryOptions<QueryAuthorityData>>) => {
    const key = { type: 'QueryAuthority',  };    
    return useQuery<QueryAuthorityData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosUpgradeV_1Beta_1.query.queryAuthority();
        return res.data;
    }, ...options});
  }
  
  return {QueryCurrentPlan,QueryAppliedPlan,QueryUpgradedConsensusState,QueryModuleVersions,QueryAuthority,
  }
}
