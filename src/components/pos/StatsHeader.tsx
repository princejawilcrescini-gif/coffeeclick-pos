import { DollarSign, ShoppingBag, TrendingUp, Users } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
}

function StatCard({ icon: Icon, label, value, change, positive }: StatCardProps) {
  return (
    <div className="bg-card rounded-xl p-4 border border-border/50">
      <div className="flex items-start justify-between mb-2">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {change && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            positive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
          }`}>
            {change}
          </span>
        )}
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

export function StatsHeader() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard 
        icon={DollarSign} 
        label="Today's Sales" 
        value="₱2,847.50" 
        change="+12.5%" 
        positive 
      />
      <StatCard 
        icon={ShoppingBag} 
        label="Orders" 
        value="156" 
        change="+8.2%" 
        positive 
      />
      <StatCard 
        icon={TrendingUp} 
        label="Avg. Order" 
        value="₱18.25" 
        change="+3.1%"
        positive 
      />
      <StatCard 
        icon={Users} 
        label="Customers" 
        value="89" 
        change="-2.4%" 
        positive={false} 
      />
    </div>
  );
}
