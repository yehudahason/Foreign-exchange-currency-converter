import { useQuery } from "@tanstack/react-query";
import { getBaseData } from "./getBaseData";
import { useToday } from "../utils/useToday";
export function useBaseRates(base: string) {
  const today = useToday();
  return useQuery({
    queryKey: ["base-rates", base, today],
    queryFn: () => getBaseData(base),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
