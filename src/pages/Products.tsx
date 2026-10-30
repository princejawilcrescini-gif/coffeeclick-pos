import { useMemo, useState } from "react";
import { POSSidebar } from "@/components/pos/POSSidebar";
import { Plus, Search, Edit, Trash2, Package, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useProductStore } from "@/stores/productStore";

const Products = () => {
  const { products, addProduct, updateProduct, deleteProduct } = useProductStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<typeof products[number] | null>(null);
  const [newProduct, setNewProduct] = useState({ name: "", price: 0, category: "Coffee", stock: 0 });

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalUnits = useMemo(() => products.reduce((sum, product) => sum + product.stock, 0), [products]);
  const lowStock = products.filter((product) => product.stock <= 5).length;

  const handleAddProduct = () => {
    if (!newProduct.name.trim() || (newProduct.category !== "Utensils" && newProduct.price <= 0) || newProduct.stock < 0) {
      toast({ title: "Check item details", description: "Enter an item name, a valid price for sellable items, and a valid starting quantity.", variant: "destructive" });
      return;
    }
    addProduct({ id: Date.now().toString(), ...newProduct, name: newProduct.name.trim() });
    toast({ title: "Item added to inventory", description: `${newProduct.name} is now listed in your inventory.` });
    setIsAddDialogOpen(false);
    setNewProduct({ name: "", price: 0, category: "Coffee", stock: 0 });
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;
    updateProduct(selectedProduct.id, selectedProduct);
    toast({ title: "Item updated", description: `${selectedProduct.name} details have been saved.` });
    setIsEditDialogOpen(false);
  };

  const handleDeleteProduct = (product: typeof products[number]) => {
    deleteProduct(product.id);
    toast({ title: "Item removed", description: `${product.name} has been removed from inventory.`, variant: "destructive" });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <POSSidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inventory of Items</h1>
            <p className="text-muted-foreground">View and manage the items available in your store.</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2"><Plus className="w-4 h-4" />Add Inventory Item</Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Different Items</p><p className="text-2xl font-bold">{products.length}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Total Units in Inventory</p><p className="text-2xl font-bold">{totalUnits}</p></div>
          <div className="rounded-xl border border-border bg-card p-4"><p className="text-sm text-muted-foreground">Low Stock Items (5 or fewer)</p><p className="text-2xl font-bold">{lowStock}</p></div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input type="text" placeholder="Search items or categories..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 p-4 border-b border-border"><Boxes className="w-5 h-5 text-primary" /><h2 className="font-semibold">Inventory List</h2></div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50"><tr>
                <th className="text-left p-4 font-medium">Item</th><th className="text-left p-4 font-medium">Category</th><th className="text-left p-4 font-medium">Selling Price</th><th className="text-left p-4 font-medium">Quantity Available</th><th className="text-left p-4 font-medium">Actions</th>
              </tr></thead>
              <tbody>
                {filteredProducts.map((product) => <tr key={product.id} className="border-t border-border hover:bg-secondary/20">
                  <td className="p-4"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center"><Package className="w-5 h-5 text-primary" /></div><span className="font-medium">{product.name}</span></div></td>
                  <td className="p-4 text-muted-foreground">{product.category}</td><td className="p-4 font-semibold">{product.category === "Utensils" ? "Not for sale" : `₱${product.price.toFixed(2)}`}</td>
                  <td className="p-4"><span className={`px-2 py-1 rounded-full text-sm font-medium ${product.stock > 20 ? "bg-success/10 text-success" : product.stock > 5 ? "bg-warning/10 text-warning" : "bg-destructive/10 text-destructive"}`}>{product.stock} units</span></td>
                  <td className="p-4"><div className="flex items-center gap-2"><Button size="sm" variant="ghost" aria-label={`Edit ${product.name}`} onClick={() => { setSelectedProduct({ ...product }); setIsEditDialogOpen(true); }}><Edit className="w-4 h-4" /></Button><Button size="sm" variant="ghost" className="text-destructive hover:text-destructive" aria-label={`Delete ${product.name}`} onClick={() => handleDeleteProduct(product)}><Trash2 className="w-4 h-4" /></Button></div></td>
                </tr>)}
                {filteredProducts.length === 0 && <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No inventory items found.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}><DialogContent><DialogHeader><DialogTitle>Add Inventory Item</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Item Name</Label><Input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="Enter item name" /></div>
            <div className="space-y-2"><Label>Category</Label><select value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background"><option>Coffee</option><option>Pastry</option><option>Beverages</option><option>Food</option><option>Utensils</option></select></div>
            <div className="space-y-2"><Label>{newProduct.category === "Utensils" ? "Selling Price (not applicable)" : "Selling Price (₱)"}</Label><Input type="number" min="0" step="0.01" disabled={newProduct.category === "Utensils"} value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) || 0 })} placeholder="0.00" /></div>
            <div className="space-y-2"><Label>Starting Quantity</Label><Input type="number" min="0" step="1" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Math.max(0, Number.parseInt(e.target.value, 10) || 0) })} placeholder="0" /></div>
          </div><DialogFooter><Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button><Button onClick={handleAddProduct}>Add Item</Button></DialogFooter>
        </DialogContent></Dialog>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}><DialogContent><DialogHeader><DialogTitle>Edit Inventory Item</DialogTitle></DialogHeader>
          {selectedProduct && <div className="space-y-4 py-4">
            <div className="space-y-2"><Label>Item Name</Label><Input value={selectedProduct.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Category</Label><select value={selectedProduct.category} onChange={(e) => setSelectedProduct({ ...selectedProduct, category: e.target.value })} className="w-full h-10 px-3 rounded-md border border-input bg-background"><option>Coffee</option><option>Pastry</option><option>Beverages</option><option>Food</option><option>Utensils</option></select></div>
            <div className="space-y-2"><Label>{selectedProduct.category === "Utensils" ? "Selling Price (not applicable)" : "Selling Price (₱)"}</Label><Input type="number" min="0" step="0.01" disabled={selectedProduct.category === "Utensils"} value={selectedProduct.price} onChange={(e) => setSelectedProduct({ ...selectedProduct, price: Number(e.target.value) || 0 })} /></div>
          </div>}
          <DialogFooter><Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button><Button onClick={handleEditProduct}>Save Changes</Button></DialogFooter>
        </DialogContent></Dialog>
      </main>
    </div>
  );
};

export default Products;
