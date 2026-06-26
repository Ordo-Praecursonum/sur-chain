/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosGovV_1() {
  const client = useClient();

  type QueryConstitutionMethod = typeof client.CosmosGovV_1.query.queryConstitution;
  type QueryConstitutionData = Awaited<ReturnType<QueryConstitutionMethod>>["data"];
  const QueryConstitution = ( options: Partial<UseQueryOptions<QueryConstitutionData>>) => {
    const key = { type: 'QueryConstitution',  };    
    return useQuery<QueryConstitutionData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosGovV_1.query.queryConstitution();
        return res.data;
    }, ...options});
  }
  

  type QueryProposalMethod = typeof client.CosmosGovV_1.query.queryProposal;
  type QueryProposalData = Awaited<ReturnType<QueryProposalMethod>>["data"];
  const QueryProposal = (proposal_id: string,  options: Partial<UseQueryOptions<QueryProposalData>>) => {
    const key = { type: 'QueryProposal',  proposal_id };    
    return useQuery<QueryProposalData>({ queryKey: [key], queryFn: async () => {
      const { proposal_id } = key
      const res = await client.CosmosGovV_1.query.queryProposal(proposal_id);
        return res.data;
    }, ...options});
  }
  
  type QueryProposalsMethod = typeof client.CosmosGovV_1.query.queryProposals;
  type QueryProposalsData = Awaited<ReturnType<QueryProposalsMethod>>["data"] & { pageParam: number };
  const QueryProposals = (query:  NonNullable<Parameters<QueryProposalsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryProposalsData, unknown, InfiniteData<QueryProposalsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryProposals', query };    
    return useInfiniteQuery<QueryProposalsData, unknown, InfiniteData<QueryProposalsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGovV_1.query.queryProposals(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryVoteMethod = typeof client.CosmosGovV_1.query.queryVote;
  type QueryVoteData = Awaited<ReturnType<QueryVoteMethod>>["data"];
  const QueryVote = (proposal_id: string, voter: string,  options: Partial<UseQueryOptions<QueryVoteData>>) => {
    const key = { type: 'QueryVote',  proposal_id,  voter };    
    return useQuery<QueryVoteData>({ queryKey: [key], queryFn: async () => {
      const { proposal_id,  voter } = key
      const res = await client.CosmosGovV_1.query.queryVote(proposal_id, voter);
        return res.data;
    }, ...options});
  }
  
  type QueryVotesMethod = typeof client.CosmosGovV_1.query.queryVotes;
  type QueryVotesData = Awaited<ReturnType<QueryVotesMethod>>["data"] & { pageParam: number };
  const QueryVotes = (proposal_id: string, query:  NonNullable<Parameters<QueryVotesMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryVotesData, unknown, InfiniteData<QueryVotesData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryVotes',  proposal_id, query };    
    return useInfiniteQuery<QueryVotesData, unknown, InfiniteData<QueryVotesData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { proposal_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGovV_1.query.queryVotes(proposal_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryParamsMethod = typeof client.CosmosGovV_1.query.queryParams;
  type QueryParamsData = Awaited<ReturnType<QueryParamsMethod>>["data"];
  const QueryParams = (params_type: string,  options: Partial<UseQueryOptions<QueryParamsData>>) => {
    const key = { type: 'QueryParams',  params_type };    
    return useQuery<QueryParamsData>({ queryKey: [key], queryFn: async () => {
      const { params_type } = key
      const res = await client.CosmosGovV_1.query.queryParams(params_type);
        return res.data;
    }, ...options});
  }
  

  type QueryDepositMethod = typeof client.CosmosGovV_1.query.queryDeposit;
  type QueryDepositData = Awaited<ReturnType<QueryDepositMethod>>["data"];
  const QueryDeposit = (proposal_id: string, depositor: string,  options: Partial<UseQueryOptions<QueryDepositData>>) => {
    const key = { type: 'QueryDeposit',  proposal_id,  depositor };    
    return useQuery<QueryDepositData>({ queryKey: [key], queryFn: async () => {
      const { proposal_id,  depositor } = key
      const res = await client.CosmosGovV_1.query.queryDeposit(proposal_id, depositor);
        return res.data;
    }, ...options});
  }
  
  type QueryDepositsMethod = typeof client.CosmosGovV_1.query.queryDeposits;
  type QueryDepositsData = Awaited<ReturnType<QueryDepositsMethod>>["data"] & { pageParam: number };
  const QueryDeposits = (proposal_id: string, query:  NonNullable<Parameters<QueryDepositsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryDepositsData, unknown, InfiniteData<QueryDepositsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryDeposits',  proposal_id, query };    
    return useInfiniteQuery<QueryDepositsData, unknown, InfiniteData<QueryDepositsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { proposal_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGovV_1.query.queryDeposits(proposal_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryTallyResultMethod = typeof client.CosmosGovV_1.query.queryTallyResult;
  type QueryTallyResultData = Awaited<ReturnType<QueryTallyResultMethod>>["data"];
  const QueryTallyResult = (proposal_id: string,  options: Partial<UseQueryOptions<QueryTallyResultData>>) => {
    const key = { type: 'QueryTallyResult',  proposal_id };    
    return useQuery<QueryTallyResultData>({ queryKey: [key], queryFn: async () => {
      const { proposal_id } = key
      const res = await client.CosmosGovV_1.query.queryTallyResult(proposal_id);
        return res.data;
    }, ...options});
  }
  
  return {QueryConstitution,QueryProposal,QueryProposals,QueryVote,QueryVotes,QueryParams,QueryDeposit,QueryDeposits,QueryTallyResult,
  }
}
