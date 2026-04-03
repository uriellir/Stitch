import { Heart, Edit, Trash2 } from "lucide-react";
import { Header } from "../Header";
import { Button } from "../Button";
import { Chip } from "../Chip";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ClothingItem, Collection } from "../../types/models";

export default function ItemDetails() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [item, setItem] = useState<ClothingItem | null>(null);
	const [collections, setCollections] = useState<Collection[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;
		setLoading(true);
		Promise.all([
			fetch("http://localhost:3001/clothing-items").then(res => res.json()),
			fetch("http://localhost:3001/collections").then(res => res.json()),
		])
			.then(([items, collections]) => {
				const found = items.find((i: ClothingItem) => String(i.id) === String(id));
				setItem(found || null);
				setCollections(collections);
				setError(found ? null : "Item not found");
			})
			.catch(() => setError("Failed to fetch data"))
			.finally(() => setLoading(false));
	}, [id]);

	if (loading) return <div className="p-8 text-center">Loading...</div>;
	if (error || !item) return <div className="p-8 text-center text-red-500">{error || "Item not found"}</div>;

	// Find collections that contain this item
	const itemCollections = collections.filter(collection =>
		collection.items && collection.items.some((i: ClothingItem) => String(i.id) === String(item.id))
	);

	return (
		<div className="min-h-screen bg-background">
			<Header
				showBack={true}
				action={
					<button className="p-2 hover:bg-accent rounded-lg">
						<Heart className={`w-6 h-6 ${item.favorite ? 'text-destructive fill-destructive' : 'text-foreground'}`} />
					</button>
				}
			/>
			<div className="max-w-md mx-auto pb-6">
				{/* Image */}
				<div className="aspect-square bg-muted">
					<img src={item.image} alt={item.name} className="w-full h-full object-cover" />
				</div>

				{/* Details */}
				<div className="p-6 space-y-6">
					<div>
						<h1 className="text-2xl text-foreground mb-1">{item.name}</h1>
						<p className="text-muted-foreground capitalize">{item.category}</p>
					</div>

					{/* Colors */}
					<div>
						<label className="block text-sm mb-2 text-foreground">Colors</label>
						<div className="flex flex-wrap gap-2">
							{item.colors.map((color) => (
								<Chip key={color}>{color}</Chip>
							))}
						</div>
					</div>

					{/* Brand */}
					{item.brand && (
						<div>
							<label className="block text-sm mb-2 text-foreground">Brand</label>
							<Chip>{item.brand}</Chip>
						</div>
					)}

					{/* Collections */}
					<div>
						<label className="block text-sm mb-2 text-foreground">Collections</label>
						{itemCollections.length > 0 ? (
							<div className="flex flex-wrap gap-2">
								{itemCollections.map((collection) => (
									<button
										key={collection.id}
										onClick={() => navigate(`/collections/${collection.id}`)}
										className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted hover:bg-muted/80 transition"
									>
										<div
											className="w-3 h-3 rounded-full"
											style={{ backgroundColor: collection.color || '#888' }}
										/>
										<span className="text-sm text-foreground">{collection.name}</span>
									</button>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">Not in any collection</p>
						)}
					</div>

					{/* Actions */}
					<div className="grid grid-cols-2 gap-3 pt-4">
						<Button variant="outline" onClick={() => navigate(`/item/${id}/edit`)}>
							<Edit className="w-4 h-4" />
							Edit
						</Button>
						<Button variant="ghost" onClick={() => navigate("/closet")}> 
							<Trash2 className="w-4 h-4 text-destructive" />
							Delete
						</Button>
					</div>

					{/* Build Outfit Around This */}
					<Button variant="primary" size="lg" fullWidth onClick={() => navigate("/outfit/manual")}>Build Outfit Around This</Button>
				</div>
			</div>
		</div>
	);
}
