/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosGroupV_1() {
  const client = useClient();

  type QueryGroupInfoMethod = typeof client.CosmosGroupV_1.query.queryGroupInfo;
  type QueryGroupInfoData = Awaited<ReturnType<QueryGroupInfoMethod>>["data"];
  const QueryGroupInfo = (group_id: string,  options: Partial<UseQueryOptions<QueryGroupInfoData>>) => {
    const key = { type: 'QueryGroupInfo',  group_id };    
    return useQuery<QueryGroupInfoData>({ queryKey: [key], queryFn: async () => {
      const { group_id } = key
      const res = await client.CosmosGroupV_1.query.queryGroupInfo(group_id);
        return res.data;
    }, ...options});
  }
  

  type QueryGroupPolicyInfoMethod = typeof client.CosmosGroupV_1.query.queryGroupPolicyInfo;
  type QueryGroupPolicyInfoData = Awaited<ReturnType<QueryGroupPolicyInfoMethod>>["data"];
  const QueryGroupPolicyInfo = (address: string,  options: Partial<UseQueryOptions<QueryGroupPolicyInfoData>>) => {
    const key = { type: 'QueryGroupPolicyInfo',  address };    
    return useQuery<QueryGroupPolicyInfoData>({ queryKey: [key], queryFn: async () => {
      const { address } = key
      const res = await client.CosmosGroupV_1.query.queryGroupPolicyInfo(address);
        return res.data;
    }, ...options});
  }
  
  type QueryGroupMembersMethod = typeof client.CosmosGroupV_1.query.queryGroupMembers;
  type QueryGroupMembersData = Awaited<ReturnType<QueryGroupMembersMethod>>["data"] & { pageParam: number };
  const QueryGroupMembers = (group_id: string, query:  NonNullable<Parameters<QueryGroupMembersMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryGroupMembersData, unknown, InfiniteData<QueryGroupMembersData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGroupMembers',  group_id, query };    
    return useInfiniteQuery<QueryGroupMembersData, unknown, InfiniteData<QueryGroupMembersData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { group_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryGroupMembers(group_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryGroupsByAdminMethod = typeof client.CosmosGroupV_1.query.queryGroupsByAdmin;
  type QueryGroupsByAdminData = Awaited<ReturnType<QueryGroupsByAdminMethod>>["data"] & { pageParam: number };
  const QueryGroupsByAdmin = (admin: string, query:  NonNullable<Parameters<QueryGroupsByAdminMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryGroupsByAdminData, unknown, InfiniteData<QueryGroupsByAdminData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGroupsByAdmin',  admin, query };    
    return useInfiniteQuery<QueryGroupsByAdminData, unknown, InfiniteData<QueryGroupsByAdminData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { admin,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryGroupsByAdmin(admin, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryGroupPoliciesByGroupMethod = typeof client.CosmosGroupV_1.query.queryGroupPoliciesByGroup;
  type QueryGroupPoliciesByGroupData = Awaited<ReturnType<QueryGroupPoliciesByGroupMethod>>["data"] & { pageParam: number };
  const QueryGroupPoliciesByGroup = (group_id: string, query:  NonNullable<Parameters<QueryGroupPoliciesByGroupMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryGroupPoliciesByGroupData, unknown, InfiniteData<QueryGroupPoliciesByGroupData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGroupPoliciesByGroup',  group_id, query };    
    return useInfiniteQuery<QueryGroupPoliciesByGroupData, unknown, InfiniteData<QueryGroupPoliciesByGroupData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { group_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryGroupPoliciesByGroup(group_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryGroupPoliciesByAdminMethod = typeof client.CosmosGroupV_1.query.queryGroupPoliciesByAdmin;
  type QueryGroupPoliciesByAdminData = Awaited<ReturnType<QueryGroupPoliciesByAdminMethod>>["data"] & { pageParam: number };
  const QueryGroupPoliciesByAdmin = (admin: string, query:  NonNullable<Parameters<QueryGroupPoliciesByAdminMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryGroupPoliciesByAdminData, unknown, InfiniteData<QueryGroupPoliciesByAdminData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGroupPoliciesByAdmin',  admin, query };    
    return useInfiniteQuery<QueryGroupPoliciesByAdminData, unknown, InfiniteData<QueryGroupPoliciesByAdminData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { admin,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryGroupPoliciesByAdmin(admin, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryProposalMethod = typeof client.CosmosGroupV_1.query.queryProposal;
  type QueryProposalData = Awaited<ReturnType<QueryProposalMethod>>["data"];
  const QueryProposal = (proposal_id: string,  options: Partial<UseQueryOptions<QueryProposalData>>) => {
    const key = { type: 'QueryProposal',  proposal_id };    
    return useQuery<QueryProposalData>({ queryKey: [key], queryFn: async () => {
      const { proposal_id } = key
      const res = await client.CosmosGroupV_1.query.queryProposal(proposal_id);
        return res.data;
    }, ...options});
  }
  
  type QueryProposalsByGroupPolicyMethod = typeof client.CosmosGroupV_1.query.queryProposalsByGroupPolicy;
  type QueryProposalsByGroupPolicyData = Awaited<ReturnType<QueryProposalsByGroupPolicyMethod>>["data"] & { pageParam: number };
  const QueryProposalsByGroupPolicy = (address: string, query:  NonNullable<Parameters<QueryProposalsByGroupPolicyMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryProposalsByGroupPolicyData, unknown, InfiniteData<QueryProposalsByGroupPolicyData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryProposalsByGroupPolicy',  address, query };    
    return useInfiniteQuery<QueryProposalsByGroupPolicyData, unknown, InfiniteData<QueryProposalsByGroupPolicyData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { address,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryProposalsByGroupPolicy(address, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryVoteByProposalVoterMethod = typeof client.CosmosGroupV_1.query.queryVoteByProposalVoter;
  type QueryVoteByProposalVoterData = Awaited<ReturnType<QueryVoteByProposalVoterMethod>>["data"];
  const QueryVoteByProposalVoter = (proposal_id: string, voter: string,  options: Partial<UseQueryOptions<QueryVoteByProposalVoterData>>) => {
    const key = { type: 'QueryVoteByProposalVoter',  proposal_id,  voter };    
    return useQuery<QueryVoteByProposalVoterData>({ queryKey: [key], queryFn: async () => {
      const { proposal_id,  voter } = key
      const res = await client.CosmosGroupV_1.query.queryVoteByProposalVoter(proposal_id, voter);
        return res.data;
    }, ...options});
  }
  
  type QueryVotesByProposalMethod = typeof client.CosmosGroupV_1.query.queryVotesByProposal;
  type QueryVotesByProposalData = Awaited<ReturnType<QueryVotesByProposalMethod>>["data"] & { pageParam: number };
  const QueryVotesByProposal = (proposal_id: string, query:  NonNullable<Parameters<QueryVotesByProposalMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryVotesByProposalData, unknown, InfiniteData<QueryVotesByProposalData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryVotesByProposal',  proposal_id, query };    
    return useInfiniteQuery<QueryVotesByProposalData, unknown, InfiniteData<QueryVotesByProposalData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { proposal_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryVotesByProposal(proposal_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryVotesByVoterMethod = typeof client.CosmosGroupV_1.query.queryVotesByVoter;
  type QueryVotesByVoterData = Awaited<ReturnType<QueryVotesByVoterMethod>>["data"] & { pageParam: number };
  const QueryVotesByVoter = (voter: string, query:  NonNullable<Parameters<QueryVotesByVoterMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryVotesByVoterData, unknown, InfiniteData<QueryVotesByVoterData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryVotesByVoter',  voter, query };    
    return useInfiniteQuery<QueryVotesByVoterData, unknown, InfiniteData<QueryVotesByVoterData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { voter,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryVotesByVoter(voter, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryGroupsByMemberMethod = typeof client.CosmosGroupV_1.query.queryGroupsByMember;
  type QueryGroupsByMemberData = Awaited<ReturnType<QueryGroupsByMemberMethod>>["data"] & { pageParam: number };
  const QueryGroupsByMember = (address: string, query:  NonNullable<Parameters<QueryGroupsByMemberMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryGroupsByMemberData, unknown, InfiniteData<QueryGroupsByMemberData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGroupsByMember',  address, query };    
    return useInfiniteQuery<QueryGroupsByMemberData, unknown, InfiniteData<QueryGroupsByMemberData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { address,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryGroupsByMember(address, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryTallyResultMethod = typeof client.CosmosGroupV_1.query.queryTallyResult;
  type QueryTallyResultData = Awaited<ReturnType<QueryTallyResultMethod>>["data"];
  const QueryTallyResult = (proposal_id: string,  options: Partial<UseQueryOptions<QueryTallyResultData>>) => {
    const key = { type: 'QueryTallyResult',  proposal_id };    
    return useQuery<QueryTallyResultData>({ queryKey: [key], queryFn: async () => {
      const { proposal_id } = key
      const res = await client.CosmosGroupV_1.query.queryTallyResult(proposal_id);
        return res.data;
    }, ...options});
  }
  
  type QueryGroupsMethod = typeof client.CosmosGroupV_1.query.queryGroups;
  type QueryGroupsData = Awaited<ReturnType<QueryGroupsMethod>>["data"] & { pageParam: number };
  const QueryGroups = (query:  NonNullable<Parameters<QueryGroupsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryGroupsData, unknown, InfiniteData<QueryGroupsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryGroups', query };    
    return useInfiniteQuery<QueryGroupsData, unknown, InfiniteData<QueryGroupsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.CosmosGroupV_1.query.queryGroups(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  return {QueryGroupInfo,QueryGroupPolicyInfo,QueryGroupMembers,QueryGroupsByAdmin,QueryGroupPoliciesByGroup,QueryGroupPoliciesByAdmin,QueryProposal,QueryProposalsByGroupPolicy,QueryVoteByProposalVoter,QueryVotesByProposal,QueryVotesByVoter,QueryGroupsByMember,QueryTallyResult,QueryGroups,
  }
}
