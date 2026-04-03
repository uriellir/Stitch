import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, Check } from "lucide-react";
import { Header } from "../../components/Header";
import { ClothingCard } from "../../components/ClothingCard";
import { Chip } from "../../components/Chip";
import { Collection, ClothingItem } from "../../types/models";

const categories = ["All", "Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];

export function AddItemsToCollection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<Collection | null>(null);
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:3001/collections`).then((res) => res.json()),
      fetch(`http://localhost:3001/clothing-items`).then((res) => res.json()),
    ]).then(([collections, items]) => {
      const found = collections.find((c: Collection) => c.id === Number(id));
      setCollection(found || null);
      setItems(items);
      setSelectedItemIds(found ? found.items.map((item) => item.id) : []);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!collection) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-foreground mb-2">Collection not found</h3>
          <button
            onClick={() => navigate("/collections")}
            className="text-primary hover:underline"
          >
            Go back to collections
          </button>
        </div>
      </div>
    );
  }

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "Tops" && item.category === "top") ||
      (selectedCategory === "Bottoms" && item.category === "bottom") ||
      (selectedCategory === "Accessories" &&
        ["accessory", "bag", "jewelry", "hat", "scarf"].includes(item.category));

    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const toggleItem = (itemId: number) => {
    setSelectedItemIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSave = async () => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:3001/collections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: collection.name,
          description: collection.description,
          color: collection.color,
          itemIds: selectedItemIds,
        }),
      });
      if (!res.ok) throw new Error("Failed to update collection");
      navigate(`/collections/${id}`);
    } catch (err) {
      alert("Failed to save collection items.");
      console.error(err);
    }
  };

  const newlySelectedCount = selectedItemIds.filter(
    (itemId) => !collection.items.some((item) => item.id === itemId)
  ).length;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        <Header
          title="Add Items"
          showBack
          action={
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={selectedItemIds.length === 0}
            >
              Save ({selectedItemIds.length})
            </button>
          }
        />

        {/* Search and Filters */}
        <div className="px-6 pt-6 pb-4 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Chip>
            ))}
          </div>

          {/* Selection Info */}
          {newlySelectedCount > 0 && (
            <div className="bg-primary/10 border border-primary/20 rounded-xl p-3">
              <p className="text-sm text-foreground">
                {newlySelectedCount} new {newlySelectedCount === 1 ? "item" : "items"} will be added
              </p>
            </div>
          )}
        </div>

        {/* Items Grid */}
        <div className="px-6 pb-6">
          <p className="text-sm text-muted-foreground mb-3">
            {filteredItems.length} {filteredItems.length === 1 ? "item" : "items"}
          </p>

          {filteredItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-foreground mb-2">No items found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <div key={item.id} className="relative">
                    <div
                      onClick={() => toggleItem(item.id)}
                      className={`transition-all ${
                        isSelected ? "ring-2 ring-primary rounded-2xl" : ""
                      }`}
                    >
                      <ClothingCard item={item} showFavorite={false} />
                    </div>
                    {isSelected && (
                      <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedItemIds.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border z-50">
          <div className="max-w-md mx-auto px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground">
                {selectedItemIds.length} {selectedItemIds.length === 1 ? "item" : "items"} selected
              </p>
              {newlySelectedCount > 0 && (
                <p className="text-xs text-muted-foreground">
                  {newlySelectedCount} new
                </p>
              )}
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
            >
              Save to Collection
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
