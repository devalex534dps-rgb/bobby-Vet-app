export interface DogBreedsResponse {
  message: Record<string, string[]>;
  status: string;
}

export interface DogImageResponse {
  message: string;
  status: string;
}

export const POPULAR_DOG_BREEDS = [
  "retriever",
  "germanshepherd",
  "poodle",
  "bulldog",
  "husky",
  "beagle",
  "boxer",
  "dachshund",
  "rottweiler",
  "chihuahua",
  "corgi",
  "dalmatian",
];

export const fetchDogBreeds = async (): Promise<string[]> => {
  const response = await fetch("https://dog.ceo/api/breeds/list/all");
  if (!response.ok) {
    throw new Error(`Error al obtener razas de perros: ${response.statusText}`);
  }
  const data: DogBreedsResponse = await response.json();
  return Object.keys(data.message);
};

export const fetchDogImageByBreed = async (breed: string): Promise<string> => {
  const cleanBreed = breed.toLowerCase().replace(/\s+/g, "");
  const response = await fetch(
    `https://dog.ceo/api/breed/${cleanBreed}/images/random`
  );
  if (!response.ok) {
    // Fallback if breed endpoint doesn't match
    const fallbackResponse = await fetch(
      "https://dog.ceo/api/breeds/image/random"
    );
    const fallbackData: DogImageResponse = await fallbackResponse.json();
    return fallbackData.message;
  }
  const data: DogImageResponse = await response.json();
  return data.message;
};

export const fetchDogsWithImages = async (
  breeds: string[] = POPULAR_DOG_BREEDS.slice(0, 8)
): Promise<{ breed: string; image: string }[]> => {
  const promises = breeds.map(async (breed) => {
    try {
      const image = await fetchDogImageByBreed(breed);
      return { breed, image };
    } catch {
      return {
        breed,
        image: "https://images.dog.ceo/breeds/retriever-golden/n02099601_4651.jpg",
      };
    }
  });

  return Promise.all(promises);
};
