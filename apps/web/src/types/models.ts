export type NormalizedOutfit = {
  items: ClothingItem[];
  explanation?: string;
};
export type ClothingItem = {
  id: number;
  name: string;
  image: string;
  category: string;
  colors: string[];
  brand: string;
  favorite: boolean;
};

export type Collection = {
  id: number;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  items: ClothingItem[];
};