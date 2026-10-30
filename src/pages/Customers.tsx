import { POSSidebar } from "@/components/pos/POSSidebar";
import { useState } from "react";
import { Plus, Search, User, Mail, Phone, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
}

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: "1", name: "Maria Santos", email: "maria@email.com", phone: "+63 912 345 6789", totalOrders: 15, totalSpent: 2450.00 },
    { id: "2", name: "Juan Cruz", email: "juan@email.com", phone: "+63 923 456 7890", totalOrders: 8, totalSpent: 1230.50 },
    { id: "3", name: "Ana Reyes", email: "ana@email.com", phone: "+63 934 567 8901", totalOrders: 22, totalSpent: 3890.75 },
    { id: "4", name: "Pedro Garcia", email: "pedro@email.com", phone: "+63 945 678 9012", totalOrders: 5, totalSpent: 675.25 },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({ name: "", email: "", phone: "" });

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      setCustomers([...customers, {
        id: Date.now().toString(),
        ...newCustomer,
        totalOrders: 0,
        totalSpent: 0
      }]);
      toast({
        title: "Customer Added",
        description: `${newCustomer.name} has been added`,
      });
      setIsAddDialogOpen(false);
      setNewCustomer({ name: "", email: "", phone: "" });
    }
  };

  const handleDeleteCustomer = (customer: Customer) => {
    setCustomers(customers.filter(c => c.id !== customer.id));
    toast({
      title: "Customer Deleted",
      description: `${customer.name} has been removed`,
      variant: "destructive",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <POSSidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Customers</h1>
            <p className="text-muted-foreground">Manage your customer database</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Customers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer.id} className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDeleteCustomer(customer)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{customer.name}</h3>
              <div className="space-y-1 text-sm text-muted-foreground mb-4">
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {customer.email}
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  {customer.phone}
                </p>
              </div>
              <div className="flex justify-between pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Orders</p>
                  <p className="font-semibold text-foreground">{customer.totalOrders}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Total Spent</p>
                  <p className="font-semibold text-primary">₱{customer.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input 
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})}
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input 
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({...newCustomer, email: e.target.value})}
                  placeholder="customer@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})}
                  placeholder="+63 XXX XXX XXXX"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer}>Add Customer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Customers;
