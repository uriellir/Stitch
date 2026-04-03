import { useState } from "react";
import { Camera, Upload, X } from "lucide-react";
import { Header } from "../Header";
import { Button } from "../../components/Button";
import { Chip } from "../../components/Chip";
import { useNavigate } from "react-router-dom";

const categories = ["top", "bottom", "shoes", "outerwear", "accessory", "bag"];
const colors = ["black", "white", "blue", "red", "green", "beige", "brown", "gray"];
const seasons = ["spring", "summer", "fall", "winter"];
const styles = ["casual", "formal", "sporty", "elegant", "streetwear", "minimalist"];

export function AddItem() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [itemName, setItemName] = useState("");
  const [uploadMethod, setUploadMethod] = useState<"camera" | "gallery" | null>(null);

  const toggleSelection = (item: string, list: string[], setter: (list: string[]) => void) => {
    setter(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);
  };

  const handleSave = () => {
    fetch("http://localhost:3001/clothing-items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: itemName,
        image: "Image", // Image upload not implemented yet
        category: selectedCategory,
        colors: selectedColors,
        // seasons: selectedSeasons, // Seasons upload not implemented yet
        // styles: selectedStyles, // Styles upload not implemented yet
        brand: "Unknown", // Brand input not implemented yet;
        // favorite?: boolean; // Favorite input not implemented yet
        // notes: selectedNotes, // Notes input not implemented yet
      }),
    })
      .then((res) => res.json())
          .then((json) => {
          console.log("Posted clothing item:", json);
          //navigate("/closet"); // Moved navigate here to ensure it only happens after successful POST
      })
      .catch((err) => console.error("Failed to add clothing item:", err));
    navigate("/closet");
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header title="Add Item" showBack={true} />
      
      <div className="max-w-md mx-auto px-6 py-6 space-y-6">
        {/* Image Upload */}
        {!uploadMethod ? (
          <div className="space-y-3">
            <label className="block text-sm text-foreground">Add Photo</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUploadMethod("camera")}
                className="aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2"
              >
                <Camera className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Take Photo</span>
              </button>
              <button
                onClick={() => setUploadMethod("gallery")}
                className="aspect-square rounded-2xl border-2 border-dashed border-border bg-muted/30 hover:bg-muted/50 transition flex flex-col items-center justify-center gap-2"
              >
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Upload</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm text-foreground">Photo Preview</label>
            <div className="relative aspect-square rounded-2xl border border-border bg-muted overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-muted-foreground text-sm">Photo placeholder</p>
              </div>
              <button
                onClick={() => setUploadMethod(null)}
                className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Item Name */}
        <div>
          <label className="block text-sm mb-2 text-foreground">Item Name</label>
          <input
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            placeholder="e.g., White T-Shirt"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm mb-2 text-foreground">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onClick={() => setSelectedCategory(category)}
                variant="outline"
              >
                {category}
              </Chip>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div>
          <label className="block text-sm mb-2 text-foreground">Colors</label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <Chip
                key={color}
                selected={selectedColors.includes(color)}
                onClick={() => toggleSelection(color, selectedColors, setSelectedColors)}
                variant="outline"
              >
                {color}
              </Chip>
            ))}
          </div>
        </div>

        {/* Styles */}
        <div>
          <label className="block text-sm mb-2 text-foreground">Styles</label>
          <div className="flex flex-wrap gap-2">
            {styles.map((style) => (
              <Chip
                key={style}
                selected={selectedStyles.includes(style)}
                onClick={() => toggleSelection(style, selectedStyles, setSelectedStyles)}
                variant="outline"
              >
                {style}
              </Chip>
            ))}
          </div>
        </div>

        {/* Seasons */}
        <div>
          <label className="block text-sm mb-2 text-foreground">Seasons</label>
          <div className="flex flex-wrap gap-2">
            {seasons.map((season) => (
              <Chip
                key={season}
                selected={selectedSeasons.includes(season)}
                onClick={() => toggleSelection(season, selectedSeasons, setSelectedSeasons)}
                variant="outline"
              >
                {season}
              </Chip>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm mb-2 text-foreground">Notes (Optional)</label>
          <textarea
            className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
            rows={3}
            placeholder="Add any additional notes..."
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          variant="primary"
          size="lg"
          fullWidth
          disabled={!itemName || !selectedCategory}
        >
          Save Item
        </Button>
      </div>
    </div>
  );
}
