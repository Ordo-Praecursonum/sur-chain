/* eslint-disable @typescript-eslint/no-unused-vars */
import { useQuery, type UseQueryOptions, useInfiniteQuery, type UseInfiniteQueryOptions, type InfiniteData  } from "@tanstack/vue-query";
import { useClient } from '../useClient';

export default function useCosmosBaseNodeV_1Beta_1() {
  const client = useClient();

  type ServiceConfigMethod = typeof client.CosmosBaseNodeV_1Beta_1.query.serviceConfig;
  type ServiceConfigData = Awaited<ReturnType<ServiceConfigMethod>>["data"];
  const ServiceConfig = ( options: Partial<UseQueryOptions<ServiceConfigData>>) => {
    const key = { type: 'ServiceConfig',  };    
    return useQuery<ServiceConfigData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosBaseNodeV_1Beta_1.query.serviceConfig();
        return res.data;
    }, ...options});
  }
  

  type ServiceStatusMethod = typeof client.CosmosBaseNodeV_1Beta_1.query.serviceStatus;
  type ServiceStatusData = Awaited<ReturnType<ServiceStatusMethod>>["data"];
  const ServiceStatus = ( options: Partial<UseQueryOptions<ServiceStatusData>>) => {
    const key = { type: 'ServiceStatus',  };    
    return useQuery<ServiceStatusData>({ queryKey: [key], queryFn: async () => {
      const res = await client.CosmosBaseNodeV_1Beta_1.query.serviceStatus();
        return res.data;
    }, ...options});
  }
  
  return {ServiceConfig,ServiceStatus,
  }
}
