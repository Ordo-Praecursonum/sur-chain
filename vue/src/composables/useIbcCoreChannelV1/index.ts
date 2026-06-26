/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcCoreChannelV_1() {
  const client = useClient();

  type QueryChannelMethod = typeof client.IbcCoreChannelV_1.query.queryChannel;
  type QueryChannelData = Awaited<ReturnType<QueryChannelMethod>>["data"];
  const QueryChannel = (channel_id: string, port_id: string,  options: Partial<UseQueryOptions<QueryChannelData>>) => {
    const key = { type: 'QueryChannel',  channel_id,  port_id };    
    return useQuery<QueryChannelData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id } = key
      const res = await client.IbcCoreChannelV_1.query.queryChannel(channel_id, port_id);
        return res.data;
    }, ...options});
  }
  
  type QueryChannelsMethod = typeof client.IbcCoreChannelV_1.query.queryChannels;
  type QueryChannelsData = Awaited<ReturnType<QueryChannelsMethod>>["data"] & { pageParam: number };
  const QueryChannels = (query:  NonNullable<Parameters<QueryChannelsMethod>[0]>, options:  Partial<UseInfiniteQueryOptions<QueryChannelsData, unknown, InfiniteData<QueryChannelsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryChannels', query };    
    return useInfiniteQuery<QueryChannelsData, unknown, InfiniteData<QueryChannelsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const {query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreChannelV_1.query.queryChannels(query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  
  type QueryConnectionChannelsMethod = typeof client.IbcCoreChannelV_1.query.queryConnectionChannels;
  type QueryConnectionChannelsData = Awaited<ReturnType<QueryConnectionChannelsMethod>>["data"] & { pageParam: number };
  const QueryConnectionChannels = (connection: string, query:  NonNullable<Parameters<QueryConnectionChannelsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryConnectionChannelsData, unknown, InfiniteData<QueryConnectionChannelsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryConnectionChannels',  connection, query };    
    return useInfiniteQuery<QueryConnectionChannelsData, unknown, InfiniteData<QueryConnectionChannelsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { connection,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreChannelV_1.query.queryConnectionChannels(connection, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryChannelClientStateMethod = typeof client.IbcCoreChannelV_1.query.queryChannelClientState;
  type QueryChannelClientStateData = Awaited<ReturnType<QueryChannelClientStateMethod>>["data"];
  const QueryChannelClientState = (channel_id: string, port_id: string,  options: Partial<UseQueryOptions<QueryChannelClientStateData>>) => {
    const key = { type: 'QueryChannelClientState',  channel_id,  port_id };    
    return useQuery<QueryChannelClientStateData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id } = key
      const res = await client.IbcCoreChannelV_1.query.queryChannelClientState(channel_id, port_id);
        return res.data;
    }, ...options});
  }
  

  type QueryChannelConsensusStateMethod = typeof client.IbcCoreChannelV_1.query.queryChannelConsensusState;
  type QueryChannelConsensusStateData = Awaited<ReturnType<QueryChannelConsensusStateMethod>>["data"];
  const QueryChannelConsensusState = (channel_id: string, port_id: string, revision_number: string, revision_height: string,  options: Partial<UseQueryOptions<QueryChannelConsensusStateData>>) => {
    const key = { type: 'QueryChannelConsensusState',  channel_id,  port_id,  revision_number,  revision_height };    
    return useQuery<QueryChannelConsensusStateData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id,  revision_number,  revision_height } = key
      const res = await client.IbcCoreChannelV_1.query.queryChannelConsensusState(channel_id, port_id, revision_number, revision_height);
        return res.data;
    }, ...options});
  }
  

  type QueryPacketCommitmentMethod = typeof client.IbcCoreChannelV_1.query.queryPacketCommitment;
  type QueryPacketCommitmentData = Awaited<ReturnType<QueryPacketCommitmentMethod>>["data"];
  const QueryPacketCommitment = (channel_id: string, port_id: string, sequence: string,  options: Partial<UseQueryOptions<QueryPacketCommitmentData>>) => {
    const key = { type: 'QueryPacketCommitment',  channel_id,  port_id,  sequence };    
    return useQuery<QueryPacketCommitmentData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id,  sequence } = key
      const res = await client.IbcCoreChannelV_1.query.queryPacketCommitment(channel_id, port_id, sequence);
        return res.data;
    }, ...options});
  }
  
  type QueryPacketCommitmentsMethod = typeof client.IbcCoreChannelV_1.query.queryPacketCommitments;
  type QueryPacketCommitmentsData = Awaited<ReturnType<QueryPacketCommitmentsMethod>>["data"] & { pageParam: number };
  const QueryPacketCommitments = (channel_id: string, port_id: string, query:  NonNullable<Parameters<QueryPacketCommitmentsMethod>[2]>, options:  Partial<UseInfiniteQueryOptions<QueryPacketCommitmentsData, unknown, InfiniteData<QueryPacketCommitmentsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryPacketCommitments',  channel_id,  port_id, query };    
    return useInfiniteQuery<QueryPacketCommitmentsData, unknown, InfiniteData<QueryPacketCommitmentsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { channel_id,  port_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreChannelV_1.query.queryPacketCommitments(channel_id, port_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryPacketReceiptMethod = typeof client.IbcCoreChannelV_1.query.queryPacketReceipt;
  type QueryPacketReceiptData = Awaited<ReturnType<QueryPacketReceiptMethod>>["data"];
  const QueryPacketReceipt = (channel_id: string, port_id: string, sequence: string,  options: Partial<UseQueryOptions<QueryPacketReceiptData>>) => {
    const key = { type: 'QueryPacketReceipt',  channel_id,  port_id,  sequence };    
    return useQuery<QueryPacketReceiptData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id,  sequence } = key
      const res = await client.IbcCoreChannelV_1.query.queryPacketReceipt(channel_id, port_id, sequence);
        return res.data;
    }, ...options});
  }
  

  type QueryPacketAcknowledgementMethod = typeof client.IbcCoreChannelV_1.query.queryPacketAcknowledgement;
  type QueryPacketAcknowledgementData = Awaited<ReturnType<QueryPacketAcknowledgementMethod>>["data"];
  const QueryPacketAcknowledgement = (channel_id: string, port_id: string, sequence: string,  options: Partial<UseQueryOptions<QueryPacketAcknowledgementData>>) => {
    const key = { type: 'QueryPacketAcknowledgement',  channel_id,  port_id,  sequence };    
    return useQuery<QueryPacketAcknowledgementData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id,  sequence } = key
      const res = await client.IbcCoreChannelV_1.query.queryPacketAcknowledgement(channel_id, port_id, sequence);
        return res.data;
    }, ...options});
  }
  
  type QueryPacketAcknowledgementsMethod = typeof client.IbcCoreChannelV_1.query.queryPacketAcknowledgements;
  type QueryPacketAcknowledgementsData = Awaited<ReturnType<QueryPacketAcknowledgementsMethod>>["data"] & { pageParam: number };
  const QueryPacketAcknowledgements = (channel_id: string, port_id: string, query:  NonNullable<Parameters<QueryPacketAcknowledgementsMethod>[2]>, options:  Partial<UseInfiniteQueryOptions<QueryPacketAcknowledgementsData, unknown, InfiniteData<QueryPacketAcknowledgementsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryPacketAcknowledgements',  channel_id,  port_id, query };    
    return useInfiniteQuery<QueryPacketAcknowledgementsData, unknown, InfiniteData<QueryPacketAcknowledgementsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { channel_id,  port_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreChannelV_1.query.queryPacketAcknowledgements(channel_id, port_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryUnreceivedPacketsMethod = typeof client.IbcCoreChannelV_1.query.queryUnreceivedPackets;
  type QueryUnreceivedPacketsData = Awaited<ReturnType<QueryUnreceivedPacketsMethod>>["data"];
  const QueryUnreceivedPackets = (channel_id: string, port_id: string, packet_commitment_sequences: string,  options: Partial<UseQueryOptions<QueryUnreceivedPacketsData>>) => {
    const key = { type: 'QueryUnreceivedPackets',  channel_id,  port_id,  packet_commitment_sequences };    
    return useQuery<QueryUnreceivedPacketsData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id,  packet_commitment_sequences } = key
      const res = await client.IbcCoreChannelV_1.query.queryUnreceivedPackets(channel_id, port_id, packet_commitment_sequences);
        return res.data;
    }, ...options});
  }
  

  type QueryUnreceivedAcksMethod = typeof client.IbcCoreChannelV_1.query.queryUnreceivedAcks;
  type QueryUnreceivedAcksData = Awaited<ReturnType<QueryUnreceivedAcksMethod>>["data"];
  const QueryUnreceivedAcks = (channel_id: string, port_id: string, packet_ack_sequences: string,  options: Partial<UseQueryOptions<QueryUnreceivedAcksData>>) => {
    const key = { type: 'QueryUnreceivedAcks',  channel_id,  port_id,  packet_ack_sequences };    
    return useQuery<QueryUnreceivedAcksData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id,  packet_ack_sequences } = key
      const res = await client.IbcCoreChannelV_1.query.queryUnreceivedAcks(channel_id, port_id, packet_ack_sequences);
        return res.data;
    }, ...options});
  }
  

  type QueryNextSequenceReceiveMethod = typeof client.IbcCoreChannelV_1.query.queryNextSequenceReceive;
  type QueryNextSequenceReceiveData = Awaited<ReturnType<QueryNextSequenceReceiveMethod>>["data"];
  const QueryNextSequenceReceive = (channel_id: string, port_id: string,  options: Partial<UseQueryOptions<QueryNextSequenceReceiveData>>) => {
    const key = { type: 'QueryNextSequenceReceive',  channel_id,  port_id };    
    return useQuery<QueryNextSequenceReceiveData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id } = key
      const res = await client.IbcCoreChannelV_1.query.queryNextSequenceReceive(channel_id, port_id);
        return res.data;
    }, ...options});
  }
  

  type QueryNextSequenceSendMethod = typeof client.IbcCoreChannelV_1.query.queryNextSequenceSend;
  type QueryNextSequenceSendData = Awaited<ReturnType<QueryNextSequenceSendMethod>>["data"];
  const QueryNextSequenceSend = (channel_id: string, port_id: string,  options: Partial<UseQueryOptions<QueryNextSequenceSendData>>) => {
    const key = { type: 'QueryNextSequenceSend',  channel_id,  port_id };    
    return useQuery<QueryNextSequenceSendData>({ queryKey: [key], queryFn: async () => {
      const { channel_id,  port_id } = key
      const res = await client.IbcCoreChannelV_1.query.queryNextSequenceSend(channel_id, port_id);
        return res.data;
    }, ...options});
  }
  
  return {QueryChannel,QueryChannels,QueryConnectionChannels,QueryChannelClientState,QueryChannelConsensusState,QueryPacketCommitment,QueryPacketCommitments,QueryPacketReceipt,QueryPacketAcknowledgement,QueryPacketAcknowledgements,QueryUnreceivedPackets,QueryUnreceivedAcks,QueryNextSequenceReceive,QueryNextSequenceSend,
  }
}
