import { Plus, Sparkles, Shuffle, Image as ImageIcon, Cloud } from "lucide-react";
import { useNavigate } from "react-router";
import { ClothingCard } from "../ClothingCard";
import { mockItems, mockOutfits } from "../../data/mockData";
import { motion } from "motion/react";

export function Home() {
  const navigate = useNavigate();
  const todayOutfit = mockOutfits[0];

  return (
    <div className="bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-6 pb-4">
          <h1 className="text-3xl text-foreground mb-1">Good morning</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cloud className="w-4 h-4" />
            <p className="text-sm">72°F, Partly cloudy</p>
          </div>
        </div>

        {/* Today's Suggestion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="px-6 mb-6"
        >
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-3xl p-6 text-primary-foreground">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5" />
              <h2 className="text-lg">Today's Suggestion</h2>
            </div>
            <p className="text-sm opacity-90 mb-4">Based on weather and your Monday rules</p>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {todayOutfit.items.slice(0, 3).map((item) => (
                <div key={item.id} className="flex-shrink-0 w-20">
                  <div className="aspect-square rounded-xl overflow-hidden bg-white/10 border border-white/20">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/outfit/result")}
              className="mt-4 bg-white text-primary px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition w-full"
            >
              View Full Outfit
            </button>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="px-6 mb-6">
          <h3 className="text-lg text-foreground mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate("/outfit")}
              className="bg-white rounded-2xl p-4 border border-border hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">Build an Outfit</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => navigate("/add-item")}
              className="bg-white rounded-2xl p-4 border border-border hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Plus className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">Add Item</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              onClick={() => navigate("/outfit")}
              className="bg-white rounded-2xl p-4 border border-border hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <Shuffle className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">Random Outfit</p>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              onClick={() => navigate("/outfit")}
              className="bg-white rounded-2xl p-4 border border-border hover:shadow-lg transition-all active:scale-95"
            >
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                <ImageIcon className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-foreground">Match Photo</p>
            </motion.button>
          </div>
        </div>

        {/* Recent Items */}
        <div className="px-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg text-foreground">Recent Items</h3>
            <button onClick={() => navigate("/closet")} className="text-sm text-primary">
              View All
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {mockItems.slice(0, 6).map((item) => (
              <ClothingCard
                key={item.id}
                item={item}
                onClick={() => navigate(`/item/${item.id}`)}
                compact
                showFavorite={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}