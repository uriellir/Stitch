import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Edit, Trash2, MoreVertical } from "lucide-react";
import { Header } from "../../components/Header";
import { BottomNav } from "../../components/BottomNav";
import { ClothingCard } from "../../components/ClothingCard";
import { Collection } from "../../types/models";

export function CollectionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/collections`)
      .then((res) => res.json())
      .then((collections) => {
        const found = collections.find((c: Collection) => c.id === Number(id));
        setCollection(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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

  const items = collection.items || [];

  const handleDelete = () => {
    // In a real app, this would delete the collection
    navigate("/collections");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        <Header
          showBack
          action={
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 hover:bg-accent rounded-xl flex items-center justify-center transition"
              >
                <MoreVertical className="w-5 h-5 text-foreground" />
              </button>
              
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-12 bg-white rounded-xl border border-border shadow-lg overflow-hidden z-40 min-w-[160px]">
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        navigate(`/collections/${id}/edit`);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition flex items-center gap-3"
                    >
                      <Edit className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">Edit</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        if (confirm(`Delete "${collection.name}"?`)) {
                          handleDelete();
                        }
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-accent transition flex items-center gap-3"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                      <span className="text-sm text-destructive">Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          }
        />

        {/* Collection Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-start gap-4">
            {collection.color && (
              <div
                className="w-16 h-16 rounded-2xl flex-shrink-0"
                style={{ backgroundColor: collection.color }}
              />
            )}
            <div className="flex-1">
              <h1 className="text-2xl text-foreground mb-2">{collection.name}</h1>
              {collection.description && (
                <p className="text-sm text-muted-foreground mb-2">
                  {collection.description}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                {items.length} {items.length === 1 ? "item" : "items"}
              </p>
            </div>
          </div>
        </div>

        {/* Add Items Button */}
        <div className="px-6 pb-4">
          <button
            onClick={() => navigate(`/collections/${id}/add-items`)}
            className="w-full bg-white rounded-xl p-4 border border-dashed border-border hover:border-primary hover:bg-accent/50 transition flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground">Add Items</span>
          </button>
        </div>

        {/* Items Grid */}
        <div className="px-6 pb-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-foreground mb-2">No items yet</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Add items from your closet to this collection
              </p>
              <button
                onClick={() => navigate(`/collections/${id}/add-items`)}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
              >
                Add Items
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {items.map((item) => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate(`/item/${item.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
