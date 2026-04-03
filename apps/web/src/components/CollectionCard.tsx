import { Collection } from "../types/models";
import { ImageWithFallback } from "./ImageWithFallback";

interface CollectionCardProps {
  collection: Collection;
  onClick?: () => void;
}

export function CollectionCard({ collection, onClick }: CollectionCardProps) {
  const items = collection.items || [];
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
          <div className="grid grid-cols-2 gap-2 h-full">
            {previewItems.map((item, idx) => (
              <div
                key={item.id}
                className={`rounded-xl overflow-hidden bg-muted ${
                  idx === 2 ? "col-span-2" : ""
                }`}
                style={idx === 2 ? { height: "48px" } : {}}
              >
                <ImageWithFallback
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div className="absolute bottom-2 right-2 bg-white/80 rounded-full px-3 py-1 text-xs text-muted-foreground">
                +{remainingCount} more
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
        <h3 className="text-lg font-semibold text-foreground mb-1 truncate">{collection.name}</h3>
        {collection.description && (
          <p className="text-xs text-muted-foreground mb-2 truncate">{collection.description}</p>
        )}
        <div className="flex items-center gap-2">
          {collection.color && (
            <span
              className="inline-block w-3 h-3 rounded-full border border-border"
              style={{ backgroundColor: collection.color }}
            />
          )}
          <span className="text-xs text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
      </div>
    </div>
  );
}
