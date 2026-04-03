import { Heart, Shuffle, Save, Share2, Info } from "lucide-react";
import { Header } from "../Header";
import { Button } from "../Button";
import { Chip } from "../Chip";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClothingItem } from "../../types/models";

export default function OutfitResult() {

    type Outfit = {
        id: string | number;
        name: string;
        items: ClothingItem[];
    };
  const navigate = useNavigate();
  const location = useLocation();
  const [outfit, setOutfit] = useState<Outfit| null>(location.state?.outfit || null);

  useEffect(() => {
    if (!outfit) {
      const stored = localStorage.getItem("outfitResult");
      if (stored) {
        try {
          const parsed: Outfit = JSON.parse(stored);
          setOutfit(parsed);
        } catch {}
      }
    }
  }, [outfit]);

  if (!outfit) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        title="Your Outfit"
        showBack={true}
        action={
          <button className="p-2 hover:bg-accent rounded-lg">
            <Heart className="w-6 h-6 text-foreground" />
          </button>
        }
      />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto">
          {/* Outfit Preview */}
          <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 p-8">
            <div className="max-w-sm mx-auto">
              {/* Avatar-style outfit composition */}
              <div className="space-y-4">
                {outfit.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-border shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground mb-1">{item.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{item.category}</p>
                        <div className="flex gap-1 mt-2">
                          {item.colors?.slice(0, 2).map((color, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-muted px-2 py-0.5 rounded-full text-muted-foreground capitalize"
                            >
                              {color}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 space-y-6">
            {/* Why This Outfit */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-foreground mb-1">Why this outfit?</h3>
                  <p className="text-sm text-muted-foreground">
                    Based on your casual style preferences and current weather. Perfect for a comfortable Monday with walking.
                  </p>
                </div>
              </div>
            </div>

            {/* Style Tags */}
            <div>
              <label className="block text-sm mb-2 text-foreground">Style</label>
              <div className="flex flex-wrap gap-2">
                <Chip>Casual</Chip>
                <Chip>Comfortable</Chip>
                <Chip>Minimalist</Chip>
              </div>
            </div>

            {/* Applied Rules */}
            <div>
              <label className="block text-sm mb-2 text-foreground">Applied Rules</label>
              <div className="space-y-2">
                <div className="bg-white rounded-xl p-3 border border-border">
                  <p className="text-sm text-foreground">Monday Comfort Rule</p>
                  <p className="text-xs text-muted-foreground">Prioritized comfortable walking shoes</p>
                </div>
              </div>
            </div>

            {/* Weather Match */}
            <div>
              <label className="block text-sm mb-2 text-foreground">Weather Suitability</label>
              <div className="bg-white rounded-xl p-3 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-foreground">72°F, Partly cloudy</p>
                    <p className="text-xs text-muted-foreground">Perfect for spring weather</p>
                  </div>
                  <div className="text-2xl">☀️</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={() => navigate("/outfit/result") }>
                <Shuffle className="w-4 h-4" />
                Regenerate
              </Button>
              <Button variant="outline" onClick={() => {}}>
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Actions - always visible above nav */}
      <div
        className="fixed left-0 right-0 bottom-0 z-50 bg-white border-t border-border px-4 py-2"
        style={{ boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
      >
        <div className="max-w-md mx-auto">
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => navigate("/saved")}
          >
            <Save className="w-5 h-5" />
            Save Outfit
          </Button>
        </div>
      </div>
    </div>
  );
}
