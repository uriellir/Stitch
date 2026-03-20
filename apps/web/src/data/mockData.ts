export interface ClothingItem {
  id: string;
  name: string;
  image: string;
  category: string;
  colors: string[];
  brand?: string;
  favorite?: boolean;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  createdAt: string;
}

export const mockItems: ClothingItem[] = [
  {
    id: "1",
    name: "Blue T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300",
    category: "Tops",
    colors: ["Blue"],
    brand: "Nike",
    favorite: true
  },
  {
    id: "2",
    name: "Black Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=300",
    category: "Bottoms",
    colors: ["Black"],
    brand: "Levi's"
  },
  {
    id: "3",
    name: "White Sneakers",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300",
    category: "Shoes",
    colors: ["White"],
    brand: "Adidas",
    favorite: true
  },
  {
    id: "4",
    name: "Red Dress",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300",
    category: "Dresses",
    colors: ["Red"],
    brand: "Zara"
  },
  {
    id: "5",
    name: "Gray Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=300",
    category: "Tops",
    colors: ["Gray"],
    brand: "H&M"
  },
  {
    id: "6",
    name: "Brown Boots",
    image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300",
    category: "Shoes",
    colors: ["Brown"],
    brand: "Timberland"
  }
];

export const mockOutfits: Outfit[] = [
  {
    id: "1",
    name: "Casual Monday",
    items: [mockItems[0], mockItems[1], mockItems[2]],
    createdAt: "2024-03-18"
  },
  {
    id: "2",
    name: "Evening Out",
    items: [mockItems[3], mockItems[5]],
    createdAt: "2024-03-17"
  }
];