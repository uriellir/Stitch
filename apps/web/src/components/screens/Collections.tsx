import { useState, useEffect } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "../Header";
import { BottomNav } from "../BottomNav";
import { CollectionCard } from "../CollectionCard";
import { Collection } from "../../types/models";

export function Collections() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    fetch("http://localhost:3001/collections")
      .then((res) => res.json())
      .then((json) => setCollections(json))
      .catch((err) => console.error("Failed to fetch collections:", err));
  }, []);

  const filteredCollections = collections.filter((collection) =>
    collection.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-md mx-auto">
        <Header
          title="Collections"
          showBack
          action={
            <button
              onClick={() => navigate("/collections/create")}
              className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition"
            >
              <Plus className="w-5 h-5 text-primary-foreground" />
            </button>
          }
        />

        {/* Search Bar */}
        <div className="px-6 pt-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-input-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            />
          </div>
        </div>

        {/* Collections Grid */}
        <div className="px-6 pb-6">
          {filteredCollections.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-foreground mb-2">No collections found</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {searchQuery
                  ? "Try a different search term"
                  : "Create your first collection to organize your wardrobe"}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => navigate("/collections/create")}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition"
                >
                  Create Collection
                </button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {filteredCollections.length}{" "}
                {filteredCollections.length === 1 ? "collection" : "collections"}
              </p>
              <div className="grid grid-cols-2 gap-4">
                {filteredCollections.map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    onClick={() => navigate(`/collections/${collection.id}`)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
