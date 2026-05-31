import { useQuery } from "@tanstack/react-query";

import { getMonitoringQueryFn } from "./QueryFnsMonitoring";
import { QueryKeysMonitoring } from "./QueryKeysMonitoring";

export const useGetMonitoring = () => {
  return useQuery({
    queryKey: [QueryKeysMonitoring.ROOT, QueryKeysMonitoring.STATS],
    queryFn: getMonitoringQueryFn,
    refetchInterval: 5000, // Fetch system metrics every 5 seconds
    refetchOnWindowFocus: true,
  });
};
