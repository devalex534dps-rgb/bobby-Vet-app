export interface CatApiItem {
  id: string;
  _id?: string;
  tags?: string[];
  mimetype?: string;
  createdAt?: string;
}

export const fetchCats = async (limit = 12): Promise<CatApiItem[]> => {
  const response = await fetch(`https://cataas.com/api/cats?limit=${limit}`);
  if (!response.ok) {
    throw new Error(`Error al obtener gatos: ${response.statusText}`);
  }
  const data: CatApiItem[] = await response.json();
  return data;
};

export const getCatImageUrl = (id: string): string => {
  return `https://cataas.com/cat/${id}`;
};
