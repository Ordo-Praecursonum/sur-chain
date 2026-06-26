/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosDistributionV_1Beta_1() {
  const client = useClient();

  type QueryParamsMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosDistributionV_1Beta_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  

  type QueryValidatorDistributionInfoMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryValidatorDistributionInfo;
  type QueryValidatorDistributionInfoData = Awaited<ReturnType<QueryValidatorDistributionInfoMethod>>["data"];
  const QueryValidatorDistributionInfo = (validator_address: string,  options: Partial<UseQueryOptions<QueryValidatorDistributionInfoData>>) => {
    const key = { type: 'QueryValidatorDistributionInfo',  validator_address };    
    return useQuery<QueryValidatorDistributionInfoData>({ queryKey: [key], queryFn: async () => {
      const { validator_address } = key
      const res = await client.CosmosDistributionV_1Beta_1.query.queryValidatorDistributionInfo(validator_address);
        return res.data;
    }, ...options});
  }
  

  type QueryValidatorOutstandingRewardsMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryValidatorOutstandingRewards;
  type QueryValidatorOutstandingRewardsData = Awaited<ReturnType<QueryValidatorOutstandingRewardsMethod>>["data"];
  const QueryValidatorOutstandingRewards = (validator_address: string,  options: Partial<UseQueryOptions<QueryValidatorOutstandingRewardsData>>) => {
    const key = { type: 'QueryValidatorOutstandingRewards',  validator_address };    
    return useQuery<QueryValidatorOutstandingRewardsData>({ queryKey: [key], queryFn: async () => {
      const { validator_address } = key
      const res = await client.CosmosDistributionV_1Beta_1.query.queryValidatorOutstandingRewards(validator_address);
        return res.data;
    }, ...options});
  }
  

  type QueryValidatorCommissionMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryValidatorCommission;
  type QueryValidatorCommissionData = Awaited<ReturnType<QueryValidatorCommissionMethod>>["data"];
  const QueryValidatorCommission = (validator_address: string,  options: Partial<UseQueryOptions<QueryValidatorCommissionData>>) => {
    const key = { type: 'QueryValidatorCommission',  validator_address };    
    return useQuery<QueryValidatorCommissionData>({ queryKey: [key], queryFn: async () => {
      const { validator_address } = key
      const res = await client.CosmosDistributionV_1Beta_1.query.queryValidatorCommission(validator_address);
        return res.data;
    }, ...options});
  }
  
  type QueryValidatorSlashesMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryValidatorSlashes;
  type QueryValidatorSlashesData = Awaited<ReturnType<QueryValidatorSlashesMethod>>["data"] & { pageParam: number };
  const QueryValidatorSlashes = (validator_address: string, query:  NonNullable<Parameters<QueryValidatorSlashesMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryValidatorSlashesData, unknown, InfiniteData<QueryValidatorSlashesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryValidatorSlashes',  validator_address, query };    
    return useInfiniteQuery<QueryValidatorSlashesData, unknown, InfiniteData<QueryValidatorSlashesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { validator_address,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosDistributionV_1Beta_1.query.queryValidatorSlashes(validator_address, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryDelegationRewardsMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryDelegationRewards;
  type QueryDelegationRewardsData = Awaited<ReturnType<QueryDelegationRewardsMethod>>["data"];
  const QueryDelegationRewards = (delegator_address: string, validator_address: string,  options: Partial<UseQueryOptions<QueryDelegationRewardsData>>) => {
    const key = { type: 'QueryDelegationRewards',  delegator_address,  validator_address };    
    return useQuery<QueryDelegationRewardsData>({ queryKey: [key], queryFn: async () => {
      const { delegator_address,  validator_address } = key
      const res = await client.CosmosDistributionV_1Beta_1.query.queryDelegationRewards(delegator_address, validator_address);
        return res.data;
    }, ...options});
  }
  

  type QueryDelegationTotalRewardsMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryDelegationTotalRewards;
  type QueryDelegationTotalRewardsData = Awaited<ReturnType<QueryDelegationTotalRewardsMethod>>["data"];
  const QueryDelegationTotalRewards = (delegator_address: string,  options: Partial<UseQueryOptions<QueryDelegationTotalRewardsData>>) => {
    const key = { type: 'QueryDelegationTotalRewards',  delegator_address };    
    return useQuery<QueryDelegationTotalRewardsData>({ queryKey: [key], queryFn: async () => {
      const { delegator_address } = key
      const res = await client.CosmosDistributionV_1Beta_1.query.queryDelegationTotalRewards(delegator_address);
        return res.data;
    }, ...options});
  }
  

  type QueryDelegatorValidatorsMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryDelegatorValidators;
  type QueryDelegatorValidatorsData = Awaited<ReturnType<QueryDelegatorValidatorsMethod>>["data"];
  const QueryDelegatorValidators = (delegator_address: string,  options: Partial<UseQueryOptions<QueryDelegatorValidatorsData>>) => {
    const key = { type: 'QueryDelegatorValidators',  delegator_address };    
    return useQuery<QueryDelegatorValidatorsData>({ queryKey: [key], queryFn: async () => {
      const { delegator_address } = key
      const res = await client.CosmosDistributionV_1Beta_1.query.queryDelegatorValidators(delegator_address);
        return res.data;
    }, ...options});
  }
  

  type QueryDelegatorWithdrawAddressMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryDelegatorWithdrawAddress;
  type QueryDelegatorWithdrawAddressData = Awaited<ReturnType<QueryDelegatorWithdrawAddressMethod>>["data"];
  const QueryDelegatorWithdrawAddress = (delegator_address: string,  options: Partial<UseQueryOptions<QueryDelegatorWithdrawAddressData>>) => {
    const key = { type: 'QueryDelegatorWithdrawAddress',  delegator_address };    
    return useQuery<QueryDelegatorWithdrawAddressData>({ queryKey: [key], queryFn: async () => {
      const { delegator_address } = key
      const res = await client.CosmosDistributionV_1Beta_1.query.queryDelegatorWithdrawAddress(delegator_address);
        return res.data;
    }, ...options});
  }
  

  type QueryCommunityPoolMethod = typeof client.CosmosDistributionV_1Beta_1.query.queryCommunityPool;
  type QueryCommunityPoolData = Awaited<ReturnType<QueryCommunityPoolMethod>>["data"];
  const QueryCommunityPool = ( options: Partial<UseQueryOptions<QueryCommunityPoolData>>) => {
    const key = { type: 'QueryCommunityPool',  };    
    return useQuery<QueryCommunityPoolData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosDistributionV_1Beta_1.query.queryCommunityPool();
        return res.data;
    }, ...options});
  }
  
  return {QueryParams,QueryValidatorDistributionInfo,QueryValidatorOutstandingRewards,QueryValidatorCommission,QueryValidatorSlashes,QueryDelegationRewards,QueryDelegationTotalRewards,QueryDelegatorValidators,QueryDelegatorWithdrawAddress,QueryCommunityPool,
  }
}
