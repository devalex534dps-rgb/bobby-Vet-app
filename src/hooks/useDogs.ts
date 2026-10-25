import { useQuery } from "@tanstack/react-query";
import {
  fetchDogBreeds,
  fetchDogsWithImages,
  fetchDogImageByBreed,
  POPULAR_DOG_BREEDS,
} from "@/services/dogs";

export const useDogs = (breeds: string[] = POPULAR_DOG_BREEDS.slice(0, 8)) => {
  const breedsQuery = useQuery({
    queryKey: ["dogs", "breeds"],
    queryFn: fetchDogBreeds,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const dogsWithImagesQuery = useQuery({
    queryKey: ["dogs", "images", breeds],
    queryFn: () => fetchDogsWithImages(breeds),
    staleTime: 1000 * 60 * 15, // 15 mins
  });

  return {
    breeds: breedsQuery.data ?? [],
    dogs: dogsWithImagesQuery.data ?? [],
    isLoadingBreeds: breedsQuery.isLoading,
    isLoadingDogs: dogsWithImagesQuery.isLoading,
    isLoading: breedsQuery.isLoading || dogsWithImagesQuery.isLoading,
    isError: breedsQuery.isError || dogsWithImagesQuery.isError,
    error: breedsQuery.error || dogsWithImagesQuery.error,
    refetchDogs: dogsWithImagesQuery.refetch,
    fetchDogImageByBreed,
  };
};

export default useDogs;
