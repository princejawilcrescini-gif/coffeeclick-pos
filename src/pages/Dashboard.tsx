import { useState } from "react";
import { POSSidebar } from "@/components/pos/POSSidebar";
import { StatsHeader } from "@/components/pos/StatsHeader";
import { TrendingUp, ShoppingBag, Users, Package, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Dashboard = () => {
  const recentTransactions = [
    { id: "TXN001", customer: "Walk-in Customer", amount: 245.50, items: 3, time: "2 mins ago", status: "completed" },
    { id: "TXN002", customer: "Maria Santos", amount: 189.00, items: 2, time: "15 mins ago", status: "completed" },
    { id: "TXN003", customer: "Juan Cruz", amount: 567.25, items: 5, time: "32 mins ago", status: "completed" },
    { id: "TXN004", customer: "Walk-in Customer", amount: 78.00, items: 1, time: "1 hour ago", status: "refunded" },
    { id: "TXN005", customer: "Ana Reyes", amount: 432.75, items: 4, time: "2 hours ago", status: "completed" },
  ];

  const topProducts = [
    { name: "Cappuccino", sales: 45, revenue: 202.50 },
    { name: "Latte", sales: 38, revenue: 190.00 },
    { name: "Croissant", sales: 32, revenue: 104.00 },
    { name: "Espresso", sales: 28, revenue: 98.00 },
    { name: "Blueberry Muffin", sales: 24, revenue: 84.00 },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <POSSidebar />
      <main className="flex-1 ml-64 p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store performance</p>
        </div>

        <StatsHeader />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Recent Transactions</h2>
            <div className="space-y-3">
              {recentTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{txn.customer}</p>
                    <p className="text-sm text-muted-foreground">{txn.id} • {txn.items} items • {txn.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground">₱{txn.amount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      txn.status === "completed" 
                        ? "bg-success/10 text-success" 
                        : "bg-destructive/10 text-destructive"
                    }`}>
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">Top Selling Products</h2>
            <div className="space-y-3">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-foreground">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} sold</p>
                    </div>
                  </div>
                  <p className="font-semibold text-primary">₱{product.revenue.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
