import { useState } from "react";
import { POSSidebar } from "@/components/pos/POSSidebar";
import { ProductGrid, type Product } from "@/components/pos/ProductGrid";
import { CartSidebar, type CartItem } from "@/components/pos/CartSidebar";
import { StatsHeader } from "@/components/pos/StatsHeader";
import { SearchBar } from "@/components/pos/SearchBar";
import { CheckoutDialog } from "@/components/pos/CheckoutDialog";
import { QRScannerDialog } from "@/components/pos/QRScannerDialog";
import { toast } from "@/hooks/use-toast";
import { useProductStore } from "@/stores/productStore";

const Sales = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  
  const { reduceStock, products } = useProductStore();

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is currently out of stock`,
        variant: "destructive",
      });
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Check if we have enough stock
        if (existing.quantity >= product.stock) {
          toast({
            title: "Insufficient Stock",
            description: `Only ${product.stock} units available`,
            variant: "destructive",
          });
          return prev;
        }
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your order`,
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    const product = products.find(p => p.id === id);
    if (product && quantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} units available`,
        variant: "destructive",
      });
      return;
    }
    
    setCartItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsCheckoutOpen(true);
  };

  const handleCompleteCheckout = () => {
    // Save a completed transaction locally so Reports can use real checkout data.
    const savedSales = JSON.parse(localStorage.getItem("coffeeclick-sales") || "[]");
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const saleRecord = {
      id: `SALE-${Date.now()}`,
      date: new Date().toISOString(),
      total: subtotal * 1.08,
      items: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price, category: item.category })),
    };
    localStorage.setItem("coffeeclick-sales", JSON.stringify([...savedSales, saleRecord]));
    // Reduce stock for each item in cart
    cartItems.forEach(item => {
      reduceStock(item.id, item.quantity);
    });
    
    setIsCheckoutOpen(false);
    setCartItems([]);
    toast({
      title: "Order completed! 🎉",
      description: "The transaction has been processed and stock updated",
    });
  };

  const handleScanResult = (code: string) => {
    toast({
      title: "QR Code Scanned",
      description: `Product code: ${code}`,
    });
    // Here you could look up the product by code and add to cart
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Navigation */}
      <POSSidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 mr-96 p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Point of Sale</h1>
          <p className="text-muted-foreground">Manage sales and process transactions</p>
        </div>

        {/* Stats */}
        <StatsHeader />

        {/* Search */}
        <SearchBar 
          value={searchQuery} 
          onChange={setSearchQuery} 
          onScanClick={() => setIsScannerOpen(true)}
        />

        {/* Products */}
        <ProductGrid 
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onAddToCart={handleAddToCart}
        />
      </main>

      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-screen">
        <CartSidebar 
          items={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onCheckout={handleCheckout}
          onClearCart={handleClearCart}
        />
      </div>

      {/* Checkout Dialog */}
      <CheckoutDialog 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        total={total}
        items={cartItems}
        onComplete={handleCompleteCheckout}
      />

      {/* QR Scanner Dialog */}
      <QRScannerDialog
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={handleScanResult}
      />
    </div>
  );
};

export default Sales;
