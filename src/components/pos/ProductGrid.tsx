import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductStore, type Product } from "@/stores/productStore";

const categories = ["All", "Coffee", "Pastry", "Beverages", "Food"];

const productPhotos: Record<string, string> = {
  Espresso: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=85",
  Cappuccino: "https://images.unsplash.com/photo-1570968915860-54d5c301fa9f?auto=format&fit=crop&w=600&q=85",
  Latte: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=85",
  Americano: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=85",
  Croissant: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=85",
  "Blueberry Muffin": "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=85",
  "Chocolate Cake": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=85",
  Bagel: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=85",
  "Orange Juice": "https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=600&q=85",
  "Iced Tea": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=85",
  Smoothie: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=85",
  Sandwich: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=85",
};

interface ProductGridProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductGrid({ selectedCategory, onCategoryChange, onAddToCart }: ProductGridProps) {
  const { products } = useProductStore();

  const sellableProducts = products.filter(p => p.category !== "Utensils");
  const filteredProducts = selectedCategory === "All"
    ? sellableProducts
    : sellableProducts.filter(p => p.category === selectedCategory);

  return (
    <div className="flex-1 flex flex-col">
      {/* Category Tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
              selectedCategory === category
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <button
            key={product.id}
            onClick={() => product.stock > 0 && onAddToCart(product)}
            disabled={product.stock === 0}
            className={cn(
              "group bg-pos-product-card rounded-xl p-3 text-left pos-card-hover border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              product.stock === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            {/* Product Photo */}
            <div className="relative aspect-[4/3] rounded-lg bg-gradient-to-br from-muted to-secondary mb-3 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-4xl">
                {getCategoryEmoji(product.category)}
              </div>
              <img
                src={product.image || productPhotos[product.name] || getCategoryPhoto(product.category)}
                alt={product.name}
                loading="lazy"
                className="relative z-10 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                }}
              />
            </div>

            {/* Product Info */}
            <h3 className="font-semibold text-foreground truncate mb-1">{product.name}</h3>
            <p className="text-xs text-muted-foreground mb-2">{product.category}</p>

            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-primary">₱{product.price.toFixed(2)}</span>
              {product.stock > 0 && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
                  <Plus className="w-4 h-4 text-primary group-hover:text-primary-foreground" />
                </div>
              )}
            </div>

            {/* Stock indicator */}
            <div className="mt-2 flex items-center gap-1">
              <div className={cn(
                "w-1.5 h-1.5 rounded-full",
                product.stock > 20 ? "bg-success" : product.stock > 5 ? "bg-warning" : product.stock > 0 ? "bg-destructive" : "bg-muted"
              )} />
              <span className="text-xs text-muted-foreground">
                {product.stock === 0 ? "Out of stock" : `${product.stock} in stock`}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function getCategoryPhoto(category: string): string {
  const photos: Record<string, string> = {
    Coffee: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=85",
    Pastry: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=85",
    Beverages: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?auto=format&fit=crop&w=600&q=85",
    Food: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=600&q=85",
  };
  return photos[category] || "";
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    Coffee: "☕",
    Pastry: "🥐",
    Beverages: "🧃",
    Food: "🥪",
  };
  return emojis[category] || "📦";
}

export type { Product };
