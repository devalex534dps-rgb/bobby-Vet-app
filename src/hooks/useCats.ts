import { useQuery } from "@tanstack/react-query";
import { fetchCats, getCatImageUrl, type CatApiItem } from "@/services/cats";

export const useCats = (limit = 12) => {
  const query = useQuery({
    queryKey: ["cats", limit],
    queryFn: () => fetchCats(limit),
    staleTime: 1000 * 60 * 10, // 10 mins
  });

  return {
    cats: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    getCatImageUrl,
  };
};

export type { CatApiItem };
export default useCats;
