/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useIbcCoreChannelV_2() {
  const client = useClient();

  type QueryNextSequenceSendMethod = typeof client.IbcCoreChannelV_2.query.queryNextSequenceSend;
  type QueryNextSequenceSendData = Awaited<ReturnType<QueryNextSequenceSendMethod>>["data"];
  const QueryNextSequenceSend = (client_id: string,  options: Partial<UseQueryOptions<QueryNextSequenceSendData>>) => {
    const key = { type: 'QueryNextSequenceSend',  client_id };    
    return useQuery<QueryNextSequenceSendData>({ queryKey: [key], queryFn: async () => {
      const { client_id } = key
      const res = await client.IbcCoreChannelV_2.query.queryNextSequenceSend(client_id);
        return res.data;
    }, ...options});
  }
  

  type QueryPacketCommitmentMethod = typeof client.IbcCoreChannelV_2.query.queryPacketCommitment;
  type QueryPacketCommitmentData = Awaited<ReturnType<QueryPacketCommitmentMethod>>["data"];
  const QueryPacketCommitment = (client_id: string, sequence: string,  options: Partial<UseQueryOptions<QueryPacketCommitmentData>>) => {
    const key = { type: 'QueryPacketCommitment',  client_id,  sequence };    
    return useQuery<QueryPacketCommitmentData>({ queryKey: [key], queryFn: async () => {
      const { client_id,  sequence } = key
      const res = await client.IbcCoreChannelV_2.query.queryPacketCommitment(client_id, sequence);
        return res.data;
    }, ...options});
  }
  
  type QueryPacketCommitmentsMethod = typeof client.IbcCoreChannelV_2.query.queryPacketCommitments;
  type QueryPacketCommitmentsData = Awaited<ReturnType<QueryPacketCommitmentsMethod>>["data"] & { pageParam: number };
  const QueryPacketCommitments = (client_id: string, query:  NonNullable<Parameters<QueryPacketCommitmentsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryPacketCommitmentsData, unknown, InfiniteData<QueryPacketCommitmentsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryPacketCommitments',  client_id, query };    
    return useInfiniteQuery<QueryPacketCommitmentsData, unknown, InfiniteData<QueryPacketCommitmentsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { client_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreChannelV_2.query.queryPacketCommitments(client_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryPacketAcknowledgementMethod = typeof client.IbcCoreChannelV_2.query.queryPacketAcknowledgement;
  type QueryPacketAcknowledgementData = Awaited<ReturnType<QueryPacketAcknowledgementMethod>>["data"];
  const QueryPacketAcknowledgement = (client_id: string, sequence: string,  options: Partial<UseQueryOptions<QueryPacketAcknowledgementData>>) => {
    const key = { type: 'QueryPacketAcknowledgement',  client_id,  sequence };    
    return useQuery<QueryPacketAcknowledgementData>({ queryKey: [key], queryFn: async () => {
      const { client_id,  sequence } = key
      const res = await client.IbcCoreChannelV_2.query.queryPacketAcknowledgement(client_id, sequence);
        return res.data;
    }, ...options});
  }
  
  type QueryPacketAcknowledgementsMethod = typeof client.IbcCoreChannelV_2.query.queryPacketAcknowledgements;
  type QueryPacketAcknowledgementsData = Awaited<ReturnType<QueryPacketAcknowledgementsMethod>>["data"] & { pageParam: number };
  const QueryPacketAcknowledgements = (client_id: string, query:  NonNullable<Parameters<QueryPacketAcknowledgementsMethod>[1]>, options:  Partial<UseInfiniteQueryOptions<QueryPacketAcknowledgementsData, unknown, InfiniteData<QueryPacketAcknowledgementsData,number>, Array<string | unknown>, number>> , perPage: number) => {
    const key = { type: 'QueryPacketAcknowledgements',  client_id, query };    
    return useInfiniteQuery<QueryPacketAcknowledgementsData, unknown, InfiniteData<QueryPacketAcknowledgementsData,number>, Array<string | unknown>, number>({ queryKey: [key], queryFn: async (context: {pageParam?: number}) => {
      const { pageParam=1 } = context;
      const { client_id,query } = key

      query['pagination.limit']=perPage;
      query['pagination.offset']= (pageParam-1)*perPage;
      query['pagination.count_total']= true;
      const res = await client.IbcCoreChannelV_2.query.queryPacketAcknowledgements(client_id, query ?? undefined);
        return { ...res.data, pageParam }; 
    }, ...options,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => { if ((lastPage.pagination?.total ?? 0) >((lastPage.pageParam ?? 0) * perPage)) {return lastPage.pageParam+1 } else {return undefined}},
      getPreviousPageParam: (firstPage, allPages) => { if (firstPage.pageParam==1) { return undefined } else { return firstPage.pageParam-1}}
    }
    );
  }
  

  type QueryPacketReceiptMethod = typeof client.IbcCoreChannelV_2.query.queryPacketReceipt;
  type QueryPacketReceiptData = Awaited<ReturnType<QueryPacketReceiptMethod>>["data"];
  const QueryPacketReceipt = (client_id: string, sequence: string,  options: Partial<UseQueryOptions<QueryPacketReceiptData>>) => {
    const key = { type: 'QueryPacketReceipt',  client_id,  sequence };    
    return useQuery<QueryPacketReceiptData>({ queryKey: [key], queryFn: async () => {
      const { client_id,  sequence } = key
      const res = await client.IbcCoreChannelV_2.query.queryPacketReceipt(client_id, sequence);
        return res.data;
    }, ...options});
  }
  

  type QueryUnreceivedPacketsMethod = typeof client.IbcCoreChannelV_2.query.queryUnreceivedPackets;
  type QueryUnreceivedPacketsData = Awaited<ReturnType<QueryUnreceivedPacketsMethod>>["data"];
  const QueryUnreceivedPackets = (client_id: string, sequences: string,  options: Partial<UseQueryOptions<QueryUnreceivedPacketsData>>) => {
    const key = { type: 'QueryUnreceivedPackets',  client_id,  sequences };    
    return useQuery<QueryUnreceivedPacketsData>({ queryKey: [key], queryFn: async () => {
      const { client_id,  sequences } = key
      const res = await client.IbcCoreChannelV_2.query.queryUnreceivedPackets(client_id, sequences);
        return res.data;
    }, ...options});
  }
  

  type QueryUnreceivedAcksMethod = typeof client.IbcCoreChannelV_2.query.queryUnreceivedAcks;
  type QueryUnreceivedAcksData = Awaited<ReturnType<QueryUnreceivedAcksMethod>>["data"];
  const QueryUnreceivedAcks = (client_id: string, packet_ack_sequences: string,  options: Partial<UseQueryOptions<QueryUnreceivedAcksData>>) => {
    const key = { type: 'QueryUnreceivedAcks',  client_id,  packet_ack_sequences };    
    return useQuery<QueryUnreceivedAcksData>({ queryKey: [key], queryFn: async () => {
      const { client_id,  packet_ack_sequences } = key
      const res = await client.IbcCoreChannelV_2.query.queryUnreceivedAcks(client_id, packet_ack_sequences);
        return res.data;
    }, ...options});
  }
  
  return {QueryNextSequenceSend,QueryPacketCommitment,QueryPacketCommitments,QueryPacketAcknowledgement,QueryPacketAcknowledgements,QueryPacketReceipt,QueryUnreceivedPackets,QueryUnreceivedAcks,
  }
}
