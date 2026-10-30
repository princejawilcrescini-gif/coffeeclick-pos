import { POSSidebar } from "@/components/pos/POSSidebar";
import { useState } from "react";
import { Store, User, Bell, CreditCard, Printer, Shield, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const Settings = () => {
  const [storeName, setStoreName] = useState("CoffeeClick");
  const [storeAddress, setStoreAddress] = useState("123 Main Street, Manila, Philippines");
  const [taxRate, setTaxRate] = useState("8");
  const [notifications, setNotifications] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been updated successfully",
    });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <POSSidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your store configuration</p>
        </div>

        <div className="max-w-2xl space-y-6">
          {/* Store Information */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Store className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Store Information</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Store Name</Label>
                <Input value={storeName} onChange={(e) => setStoreName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={storeAddress} onChange={(e) => setStoreAddress(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Tax Settings */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Tax Settings</h2>
            </div>
            <div className="space-y-2">
              <Label>Tax Rate (%)</Label>
              <Input 
                type="number" 
                value={taxRate} 
                onChange={(e) => setTaxRate(e.target.value)}
                className="max-w-[200px]"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Enable Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts for low stock and new orders</p>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </div>

          {/* Printing */}
          <div className="bg-card rounded-xl border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Printer className="w-5 h-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Printing</h2>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Auto-Print Receipts</p>
                <p className="text-sm text-muted-foreground">Automatically print receipt after each sale</p>
              </div>
              <Switch checked={autoPrint} onCheckedChange={setAutoPrint} />
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Save Settings
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Settings;
