import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductStore, type Product } from "@/stores/productStore";

const categories = ["All", "Coffee", "Pastry", "Beverages", "Food"];

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
              "group bg-pos-product-card rounded-xl p-4 text-left pos-card-hover border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              product.stock === 0 && "opacity-50 cursor-not-allowed"
            )}
          >
            {/* Product Image Placeholder */}
            <div className="aspect-square rounded-lg bg-gradient-to-br from-muted to-secondary mb-3 flex items-center justify-center overflow-hidden">
              <span className="text-3xl">{getCategoryEmoji(product.category)}</span>
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
