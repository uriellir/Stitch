import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Plus, Folder, ArrowUp } from "lucide-react";
import { ClothingCard } from "../ClothingCard";
import { mockItems } from "../../data/mockData";
import { useNavigate } from "react-router";

const categories = ["All", "Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];

export function Closet() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredItems = mockItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === "Tops" && item.category === "top") ||
      (selectedCategory === "Bottoms" && item.category === "bottom") ||
      (selectedCategory === "Accessories" && ["accessory", "bag", "jewelry", "hat", "scarf"].includes(item.category));

    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-border sticky top-0 z-40">
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl text-foreground">My Closet</h1>
              <button
                onClick={() => navigate("/add-item")}
                className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center hover:bg-primary/90 transition"
              >
                <Plus className="w-5 h-5 text-primary-foreground" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search your wardrobe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3 rounded-xl bg-input-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2">
                <SlidersHorizontal className="w-5 h-5 text-muted-foreground" /> {/* TODO: Add filter functionality */}
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-6 px-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="px-6 py-4">
          <button
            onClick={() => navigate("/collections")}
            className="w-full bg-white rounded-2xl p-4 border border-border hover:shadow-md transition flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Folder className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm text-foreground">Folders & Collections</p>
              <p className="text-xs text-muted-foreground">Organize your wardrobe</p>
            </div>
          </button>
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
              {filteredItems.map((item) => (
                <ClothingCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate(`/item/${item.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Scroll to Top Button */}
        {showScrollTop && (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="fixed bottom-24 right-6 w-12 h-12 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center z-50"
        >
            <ArrowUp className="w-6 h-6" />
        </button>
        )}

      </div>
    </div>
  );
}