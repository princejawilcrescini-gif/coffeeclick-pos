import { POSSidebar } from "@/components/pos/POSSidebar";
import { useState } from "react";
import { Plus, Edit, Trash2, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
  productCount: number;
  color: string;
}

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([
    { id: "1", name: "Coffee", productCount: 4, color: "bg-amber-500" },
    { id: "2", name: "Pastry", productCount: 4, color: "bg-pink-500" },
    { id: "3", name: "Beverages", productCount: 3, color: "bg-blue-500" },
    { id: "4", name: "Food", productCount: 1, color: "bg-green-500" },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", color: "bg-primary" });

  const handleAddCategory = () => {
    if (newCategory.name) {
      setCategories([...categories, {
        id: Date.now().toString(),
        name: newCategory.name,
        productCount: 0,
        color: newCategory.color
      }]);
      toast({
        title: "Category Added",
        description: `${newCategory.name} has been created`,
      });
      setIsAddDialogOpen(false);
      setNewCategory({ name: "", color: "bg-primary" });
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setCategories(categories.filter(c => c.id !== category.id));
    toast({
      title: "Category Deleted",
      description: `${category.name} has been removed`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <POSSidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Categories</h1>
            <p className="text-muted-foreground">Organize your products by category</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Category
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${category.color} flex items-center justify-center`}>
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
              <p className="text-sm text-muted-foreground">{category.productCount} products</p>
            </div>
          ))}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category Name</Label>
                <Input 
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  placeholder="Enter category name"
                />
              </div>
              <div className="space-y-2">
                <Label>Color</Label>
                <div className="flex gap-2">
                  {["bg-amber-500", "bg-pink-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-red-500"].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({...newCategory, color})}
                      className={`w-8 h-8 rounded-full ${color} ${newCategory.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCategory}>Add Category</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Categories;
