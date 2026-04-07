import { Plus, Sparkles, Shuffle, Image as ImageIcon, Cloud } from "lucide-react";
import { fetchWeather } from "../ui/weather";
import { useNavigate } from "react-router-dom";
import { ClothingCard } from "../ClothingCard";
// import { mockItems, mockOutfits } from "../../data/mockData";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

type HomeResponse = {
  todayOutfit: null;
  recentItems: Array<{
    id: number;
    name: string;
    image: string;
    category: string;
    colors: string[];
    brand: string;
    favorite: boolean;
  }>;
  quickStats: {
    totalItems: number;
    favorites: number;
  };
  quickActions: Array<{
    id: string;
    label: string;
  }>;
};

function getGreetingAndMessage(hour: number) {
  if (hour < 5) return { greeting: "Good night", message: "Burning the midnight oil?" };
  if (hour < 12) return { greeting: "Good morning", message: "Ready to start your day?" };
  if (hour < 17) return { greeting: "Good afternoon", message: "Hope your day is going well!" };
  if (hour < 21) return { greeting: "Good evening", message: "Time to wind down." };
  return { greeting: "Good night", message: "Rest up for tomorrow!" };
}

export function Home() {
  const navigate = useNavigate();
  const [data, setData] = useState<HomeResponse | null>(null);
  // const todayOutfit = mockOutfits[0];
  // Outfit suggestion state
  const [suggestedOutfit, setSuggestedOutfit] = useState<any>(null);
  const [suggestionLoading, setSuggestionLoading] = useState(true);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);





  const now = new Date();
  const { greeting, message } = getGreetingAndMessage(now.getHours());

  const [weather, setWeather] = useState<any>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  useEffect(() => {
    fetchWeather()
      .then((data) => {
        setWeather(data);
        setWeatherLoading(false);
      })
      .catch((err) => {
        setWeatherError(`Failed to fetch weather, error: ${err.message}`);
        setWeatherLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:3001/home")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to fetch home data:", err));
  }, []);

  // Toggle this flag to use cached suggestion or real API
  const USE_CACHED_SUGGESTION = true; // Set to false to use real API

  useEffect(() => {
    if (USE_CACHED_SUGGESTION) {
      import("./outfitSuggestionCache.json")
        .then((json) => {
          setSuggestedOutfit(json.default || json);
          setSuggestionLoading(false);
        })
        .catch(() => {
          setSuggestionError("Failed to load cached outfit suggestion");
          setSuggestionLoading(false);
        });
      return;
    }
    if (!weather || weatherLoading || weatherError) return;
    fetch("http://localhost:3001/suggest-outfit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        context: {
          weather: { tempC: Math.round(15) }, // weather.main.temp
          occasion: "casual",
          avoidColors: ["red"]
        }
      })
    })
      .then((res) => res.json())
      .then((json) => {
        setSuggestedOutfit(json);
        setSuggestionLoading(false);
      })
      .catch(() => {
        setSuggestionError("Failed to get outfit suggestion");
        setSuggestionLoading(false);
      });
  }, [weather, weatherLoading, weatherError]);

  return (
    <div className="bg-background pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="p-6 pb-4">
          <h1 className="text-3xl text-foreground mb-1">{greeting}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Cloud className="w-4 h-4" />
            {weatherLoading ? (
              <p className="text-sm">Loading weather...</p>
            ) : weatherError ? (
              <p className="text-sm text-red-500">{weatherError}</p>
            ) : weather ? (
              <p className="text-sm">
                {Math.round(weather.main.temp)}°C, {weather.weather[0].description.replace(/\b\w/g, (c:string) => c.toUpperCase())}
              </p>
            ) : null}
          </div>
          <p className="text-base text-muted-foreground mt-2">{message}</p>
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
            {suggestionLoading ? (
              <p className="text-sm">Loading outfit suggestion...</p>
            ) : suggestionError ? (
              <p className="text-sm text-red-500">{suggestionError}</p>
            ) : suggestedOutfit ? (
              <>
                <p className="text-sm opacity-90 mb-4">{suggestedOutfit.explanation}</p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {suggestedOutfit.outfit?.slice(0, 3).map((item: any) => (
                    <div key={item.id} className="flex-shrink-0 w-20">
                      <div className="aspect-square rounded-xl overflow-hidden bg-white/10 border border-white/20">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    localStorage.setItem("outfitResult", JSON.stringify(suggestedOutfit.outfit));
                    navigate("/outfit/result", { state: { outfit: suggestedOutfit.outfit } });
                  }}
                  className="mt-4 bg-white text-primary px-4 py-2 rounded-xl text-sm hover:bg-white/90 transition w-full"
                >
                  View Full Outfit
                </button>
              </>
            ) : null}
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
            {data?.recentItems.slice(0, 6).map((item) => (
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