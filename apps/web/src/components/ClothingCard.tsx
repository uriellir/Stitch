import { Heart } from "lucide-react";
import { ClothingItem } from "../data/mockData";
import { ImageWithFallback } from "./ImageWithFallback";

interface ClothingCardProps {
  item: ClothingItem;
  onClick?: () => void;
  compact?: boolean;
  showFavorite?: boolean;
}

export function ClothingCard({ item, onClick, compact = false, showFavorite = true }: ClothingCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-200 ${
        onClick ? "cursor-pointer active:scale-95" : ""
      }`}
    >
      <div className="relative aspect-square bg-gray-100">
        <ImageWithFallback
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {showFavorite && item.favorite && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5">
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
          </div>
        )}
      </div>
      {!compact && (
        <div className="p-3">
          <p className="text-sm text-gray-900 truncate">{item.name}</p>
          <p className="text-xs text-gray-600 capitalize">{item.category}</p>
          <div className="flex gap-1 mt-2 flex-wrap">
            {item.colors.slice(0, 2).map((color, idx) => (
              <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 capitalize">
                {color}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}