import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../Header";
import { mockCollections } from "../../data/mockData";

const colorOptions = [
  { name: "Black", value: "#0a0a0a" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Pink", value: "#ec4899" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Green", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Red", value: "#ef4444" },
  { name: "Teal", value: "#14b8a6" },
];

export function CreateCollection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const existingCollection = isEditing
    ? mockCollections.find((c) => c.id === id)
    : null;

  const [name, setName] = useState(existingCollection?.name || "");
  const [description, setDescription] = useState(
    existingCollection?.description || ""
  );
  const [selectedColor, setSelectedColor] = useState(
    existingCollection?.color || colorOptions[0].value
  );

  const handleSave = () => {
    if (!name.trim()) {
      alert("Please enter a collection name");
      return;
    }

    // In a real app, this would save to the backend
    console.log("Saving collection:", { name, description, color: selectedColor });
    
    if (isEditing) {
      navigate(`/collections/${id}`);
    } else {
      navigate("/collections");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        <Header title={isEditing ? "Edit Collection" : "New Collection"} showBack />

        <div className="px-6 py-6 space-y-6">
          {/* Collection Name */}
          <div>
            <label className="block text-sm text-foreground mb-2">
              Collection Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Work Essentials"
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {name.length}/50 characters
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description for this collection"
              className="w-full px-4 py-3 rounded-xl bg-input-background border border-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition resize-none"
              rows={3}
              maxLength={150}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {description.length}/150 characters
            </p>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm text-foreground mb-3">
              Collection Color
            </label>
            <div className="grid grid-cols-4 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`aspect-square rounded-xl transition-all ${
                    selectedColor === color.value
                      ? "ring-2 ring-foreground ring-offset-2 scale-105"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.name}
                >
                  {selectedColor === color.value && (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="white"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-2xl p-6 border border-border">
            <p className="text-xs text-muted-foreground mb-3">Preview</p>
            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex-shrink-0"
                style={{ backgroundColor: selectedColor }}
              />
              <div className="flex-1">
                <h3 className="text-foreground mb-1">
                  {name || "Collection Name"}
                </h3>
                {description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 px-6 py-3 bg-white border border-border text-foreground rounded-xl hover:bg-accent transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!name.trim()}
            >
              {isEditing ? "Save Changes" : "Create Collection"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
