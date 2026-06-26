/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosStakingV_1Beta_1() {
  const client = useClient();
  type QueryValidatorsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryValidators;
  type QueryValidatorsData = Awaited<ReturnType<QueryValidatorsMethod>>["data"] & { pageParam: number };
  const QueryValidators = (query:  NonNullable<Parameters<QueryValidatorsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryValidatorsData, unknown, InfiniteData<QueryValidatorsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryValidators', query };    
    return useInfiniteQuery<QueryValidatorsData, unknown, InfiniteData<QueryValidatorsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosStakingV_1Beta_1.query.queryValidators(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryValidatorMethod = typeof client.CosmosStakingV_1Beta_1.query.queryValidator;
  type QueryValidatorData = Awaited<ReturnType<QueryValidatorMethod>>["data"];
  const QueryValidator = (validator_addr: string,  options: Partial<UseQueryOptions<QueryValidatorData>>) => {
    const key = { type: 'QueryValidator',  validator_addr };    
    return useQuery<QueryValidatorData>({ queryKey: [key], queryFn: async () => {
      const { validator_addr } = key
      const res = await client.CosmosStakingV_1Beta_1.query.queryValidator(validator_addr);
        return res.data;
    }, ...options});
  }
  
  type QueryValidatorDelegationsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryValidatorDelegations;
  type QueryValidatorDelegationsData = Awaited<ReturnType<QueryValidatorDelegationsMethod>>["data"] & { pageParam: number };
  const QueryValidatorDelegations = (validator_addr: string, query:  NonNullable<Parameters<QueryValidatorDelegationsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryValidatorDelegationsData, unknown, InfiniteData<QueryValidatorDelegationsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryValidatorDelegations',  validator_addr, query };    
    return useInfiniteQuery<QueryValidatorDelegationsData, unknown, InfiniteData<QueryValidatorDelegationsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { validator_addr,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosStakingV_1Beta_1.query.queryValidatorDelegations(validator_addr, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryValidatorUnbondingDelegationsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryValidatorUnbondingDelegations;
  type QueryValidatorUnbondingDelegationsData = Awaited<ReturnType<QueryValidatorUnbondingDelegationsMethod>>["data"] & { pageParam: number };
  const QueryValidatorUnbondingDelegations = (validator_addr: string, query:  NonNullable<Parameters<QueryValidatorUnbondingDelegationsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryValidatorUnbondingDelegationsData, unknown, InfiniteData<QueryValidatorUnbondingDelegationsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryValidatorUnbondingDelegations',  validator_addr, query };    
    return useInfiniteQuery<QueryValidatorUnbondingDelegationsData, unknown, InfiniteData<QueryValidatorUnbondingDelegationsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { validator_addr,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosStakingV_1Beta_1.query.queryValidatorUnbondingDelegations(validator_addr, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryDelegationMethod = typeof client.CosmosStakingV_1Beta_1.query.queryDelegation;
  type QueryDelegationData = Awaited<ReturnType<QueryDelegationMethod>>["data"];
  const QueryDelegation = (validator_addr: string, delegator_addr: string,  options: Partial<UseQueryOptions<QueryDelegationData>>) => {
    const key = { type: 'QueryDelegation',  validator_addr,  delegator_addr };    
    return useQuery<QueryDelegationData>({ queryKey: [key], queryFn: async () => {
      const { validator_addr,  delegator_addr } = key
      const res = await client.CosmosStakingV_1Beta_1.query.queryDelegation(validator_addr, delegator_addr);
        return res.data;
    }, ...options});
  }
  

  type QueryUnbondingDelegationMethod = typeof client.CosmosStakingV_1Beta_1.query.queryUnbondingDelegation;
  type QueryUnbondingDelegationData = Awaited<ReturnType<QueryUnbondingDelegationMethod>>["data"];
  const QueryUnbondingDelegation = (validator_addr: string, delegator_addr: string,  options: Partial<UseQueryOptions<QueryUnbondingDelegationData>>) => {
    const key = { type: 'QueryUnbondingDelegation',  validator_addr,  delegator_addr };    
    return useQuery<QueryUnbondingDelegationData>({ queryKey: [key], queryFn: async () => {
      const { validator_addr,  delegator_addr } = key
      const res = await client.CosmosStakingV_1Beta_1.query.queryUnbondingDelegation(validator_addr, delegator_addr);
        return res.data;
    }, ...options});
  }
  
  type QueryDelegatorDelegationsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryDelegatorDelegations;
  type QueryDelegatorDelegationsData = Awaited<ReturnType<QueryDelegatorDelegationsMethod>>["data"] & { pageParam: number };
  const QueryDelegatorDelegations = (delegator_addr: string, query:  NonNullable<Parameters<QueryDelegatorDelegationsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryDelegatorDelegationsData, unknown, InfiniteData<QueryDelegatorDelegationsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDelegatorDelegations',  delegator_addr, query };    
    return useInfiniteQuery<QueryDelegatorDelegationsData, unknown, InfiniteData<QueryDelegatorDelegationsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { delegator_addr,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosStakingV_1Beta_1.query.queryDelegatorDelegations(delegator_addr, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryDelegatorUnbondingDelegationsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryDelegatorUnbondingDelegations;
  type QueryDelegatorUnbondingDelegationsData = Awaited<ReturnType<QueryDelegatorUnbondingDelegationsMethod>>["data"] & { pageParam: number };
  const QueryDelegatorUnbondingDelegations = (delegator_addr: string, query:  NonNullable<Parameters<QueryDelegatorUnbondingDelegationsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryDelegatorUnbondingDelegationsData, unknown, InfiniteData<QueryDelegatorUnbondingDelegationsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDelegatorUnbondingDelegations',  delegator_addr, query };    
    return useInfiniteQuery<QueryDelegatorUnbondingDelegationsData, unknown, InfiniteData<QueryDelegatorUnbondingDelegationsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { delegator_addr,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosStakingV_1Beta_1.query.queryDelegatorUnbondingDelegations(delegator_addr, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryRedelegationsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryRedelegations;
  type QueryRedelegationsData = Awaited<ReturnType<QueryRedelegationsMethod>>["data"] & { pageParam: number };
  const QueryRedelegations = (delegator_addr: string, query:  NonNullable<Parameters<QueryRedelegationsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryRedelegationsData, unknown, InfiniteData<QueryRedelegationsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryRedelegations',  delegator_addr, query };    
    return useInfiniteQuery<QueryRedelegationsData, unknown, InfiniteData<QueryRedelegationsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { delegator_addr,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosStakingV_1Beta_1.query.queryRedelegations(delegator_addr, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryDelegatorValidatorsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryDelegatorValidators;
  type QueryDelegatorValidatorsData = Awaited<ReturnType<QueryDelegatorValidatorsMethod>>["data"] & { pageParam: number };
  const QueryDelegatorValidators = (delegator_addr: string, query:  NonNullable<Parameters<QueryDelegatorValidatorsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryDelegatorValidatorsData, unknown, InfiniteData<QueryDelegatorValidatorsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDelegatorValidators',  delegator_addr, query };    
    return useInfiniteQuery<QueryDelegatorValidatorsData, unknown, InfiniteData<QueryDelegatorValidatorsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { delegator_addr,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosStakingV_1Beta_1.query.queryDelegatorValidators(delegator_addr, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryDelegatorValidatorMethod = typeof client.CosmosStakingV_1Beta_1.query.queryDelegatorValidator;
  type QueryDelegatorValidatorData = Awaited<ReturnType<QueryDelegatorValidatorMethod>>["data"];
  const QueryDelegatorValidator = (delegator_addr: string, validator_addr: string,  options: Partial<UseQueryOptions<QueryDelegatorValidatorData>>) => {
    const key = { type: 'QueryDelegatorValidator',  delegator_addr,  validator_addr };    
    return useQuery<QueryDelegatorValidatorData>({ queryKey: [key], queryFn: async () => {
      const { delegator_addr,  validator_addr } = key
      const res = await client.CosmosStakingV_1Beta_1.query.queryDelegatorValidator(delegator_addr, validator_addr);
        return res.data;
    }, ...options});
  }
  

  type QueryHistoricalInfoMethod = typeof client.CosmosStakingV_1Beta_1.query.queryHistoricalInfo;
  type QueryHistoricalInfoData = Awaited<ReturnType<QueryHistoricalInfoMethod>>["data"];
  const QueryHistoricalInfo = (height: string,  options: Partial<UseQueryOptions<QueryHistoricalInfoData>>) => {
    const key = { type: 'QueryHistoricalInfo',  height };    
    return useQuery<QueryHistoricalInfoData>({ queryKey: [key], queryFn: async () => {
      const { height } = key
      const res = await client.CosmosStakingV_1Beta_1.query.queryHistoricalInfo(height);
        return res.data;
    }, ...options});
  }
  

  type QueryPoolMethod = typeof client.CosmosStakingV_1Beta_1.query.queryPool;
  type QueryPoolData = Awaited<ReturnType<QueryPoolMethod>>["data"];
  const QueryPool = ( options: Partial<UseQueryOptions<QueryPoolData>>) => {
    const key = { type: 'QueryPool',  };    
    return useQuery<QueryPoolData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosStakingV_1Beta_1.query.queryPool();
        return res.data;
    }, ...options});
  }
  

  type QueryParamsMethod = typeof client.CosmosStakingV_1Beta_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = ( options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosStakingV_1Beta_1.query.queryParams();
        return res.data;
    }, ...options});
  }
  
  return {QueryValidators,QueryValidator,QueryValidatorDelegations,QueryValidatorUnbondingDelegations,QueryDelegation,QueryUnbondingDelegation,QueryDelegatorDelegations,QueryDelegatorUnbondingDelegations,QueryRedelegations,QueryDelegatorValidators,QueryDelegatorValidator,QueryHistoricalInfo,QueryPool,QueryParams,
  }
}
