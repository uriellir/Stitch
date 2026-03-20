import { Collection, mockItems } from "../data/mockData";
import { ImageWithFallback } from "./ImageWithFallback";

interface CollectionCardProps {
  collection: Collection;
  onClick?: () => void;
}

export function CollectionCard({ collection, onClick }: CollectionCardProps) {
  const items = mockItems.filter(item => collection.itemIds.includes(item.id));
  const previewItems = items.slice(0, 3);
  const remainingCount = Math.max(0, items.length - 3);

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-all duration-200 ${
        onClick ? "cursor-pointer active:scale-95" : ""
      }`}
    >
      {/* Collection Preview Grid */}
      <div className="relative aspect-square bg-muted p-2">
        {previewItems.length === 0 ? (
          <div className="w-full h-full rounded-xl bg-muted flex items-center justify-center">
            <p className="text-muted-foreground text-sm">Empty</p>
          </div>
        ) : previewItems.length === 1 ? (
          <div className="w-full h-full rounded-xl overflow-hidden">
            <ImageWithFallback
              src={previewItems[0].image}
              alt={previewItems[0].name}
              className="w-full h-full object-cover"
            />
          </div>
        ) : previewItems.length === 2 ? (
          <div className="grid grid-cols-2 gap-2 h-full">
            {previewItems.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden bg-muted">
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full">
            {previewItems.slice(0, 3).map((item, idx) => (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden bg-muted ${
                  idx === 0 ? "row-span-2" : ""
                }`}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="rounded-xl bg-foreground/90 flex items-center justify-center">
                <span className="text-background">+{remainingCount}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Color Badge */}
        {collection.color && (
          <div className="absolute top-3 right-3">
            <div
              className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
              style={{ backgroundColor: collection.color }}
            />
          </div>
        )}
      </div>

      {/* Collection Info */}
      <div className="p-4">
        <h3 className="text-foreground truncate mb-1">{collection.name}</h3>
        <p className="text-sm text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>
    </div>
  );
}
