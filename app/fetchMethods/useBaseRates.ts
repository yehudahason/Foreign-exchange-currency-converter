import { useQuery } from "@tanstack/react-query";
import { getBaseData } from "./getBaseData";

export function useBaseRates(base: string) {
  return useQuery({
    queryKey: ["base-rates", base],
    queryFn: () => getBaseData(base),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
