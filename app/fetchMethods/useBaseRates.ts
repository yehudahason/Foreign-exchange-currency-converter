import { useQuery } from "@tanstack/react-query";
import { getBaseData } from "./getBaseData";

export function useBaseRates(base: string) {
  const today = new Date().toISOString().split("T")[0];
  return useQuery({
    queryKey: ["base-rates", base, today],
    queryFn: () => getBaseData(base),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
