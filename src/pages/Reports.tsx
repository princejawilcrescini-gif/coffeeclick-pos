import { useMemo, useState } from "react";
import { POSSidebar } from "@/components/pos/POSSidebar";
import { useProductStore } from "@/stores/productStore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

type SaleItem = { id: string; name: string; quantity: number; price: number; category?: string };
type SaleRecord = { id: string; date: string; total: number; items: SaleItem[] };
const money = (n: number) => `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const readSales = (): SaleRecord[] => {
  try { return JSON.parse(localStorage.getItem("coffeeclick-sales") || "[]") as SaleRecord[]; }
  catch { return []; }
};

const Reports = () => {
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("weekly");
  const [sales] = useState<SaleRecord[]>(readSales);
  const products = useProductStore((state) => state.products);
  const now = new Date();
  const filteredSales = useMemo(() => sales.filter((sale) => {
    const date = new Date(sale.date);
    if (Number.isNaN(date.getTime())) return false;
    if (period === "daily") return date.toDateString() === now.toDateString();
    if (period === "weekly") { const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0,0,0,0); return date >= start && date <= now; }
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }), [sales, period]);
  const revenue = filteredSales.reduce((sum, sale) => sum + sale.total, 0);
  const transactions = filteredSales.length;
  const itemsSold = filteredSales.reduce((sum, sale) => sum + sale.items.reduce((n, item) => n + item.quantity, 0), 0);
  const bestSellers = Object.values(filteredSales.flatMap(s => s.items).reduce<Record<string, { name: string; quantity: number; revenue: number }>>((acc, item) => {
    const key = item.id || item.name; acc[key] ??= { name: item.name, quantity: 0, revenue: 0 };
    acc[key].quantity += item.quantity; acc[key].revenue += item.price * item.quantity; return acc;
  }, {})).sort((a,b) => b.quantity - a.quantity).slice(0,5);
  const lowStock = products.filter(p => p.category.toLowerCase() !== "utensils" && p.stock <= 10);
  const chartData = period === "daily" ? Array.from({length: 8}, (_,i) => { const h = i * 3; const label = `${String(h).padStart(2,"0")}:00`; const total = filteredSales.filter(s => new Date(s.date).getHours() >= h && new Date(s.date).getHours() < h + 3).reduce((n,s) => n+s.total,0); return { label, sales: total }; }) : period === "weekly" ? Array.from({length:7}, (_,i) => { const d = new Date(now); d.setDate(now.getDate()-6+i); const total = filteredSales.filter(s => new Date(s.date).toDateString() === d.toDateString()).reduce((n,s) => n+s.total,0); return { label: d.toLocaleDateString("en",{weekday:"short"}), sales: total }; }) : Array.from({length: now.getDate()}, (_,i) => { const d = new Date(now.getFullYear(),now.getMonth(),i+1); const total = filteredSales.filter(s => new Date(s.date).toDateString() === d.toDateString()).reduce((n,s) => n+s.total,0); return { label: String(i+1), sales: total }; });

  return <div className="flex min-h-screen bg-background"><POSSidebar /><main className="flex-1 ml-64 p-6">
    <div className="flex flex-wrap items-start justify-between gap-3 mb-6"><div><h1 className="text-2xl font-bold text-foreground">CoffeeClick Reports</h1><p className="text-muted-foreground">Sales performance, best sellers, inventory alerts, and profit tracking</p></div><div className="flex gap-2">{(["daily","weekly","monthly"] as const).map(p => <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-4 py-2 text-sm font-medium capitalize border ${period===p ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border text-foreground"}`}>{p}</button>)}</div></div>
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
      {[{label:"Total Revenue",value:money(revenue),note:`${period} sales`},{label:"Total Transactions",value:String(transactions),note:"Completed orders recorded"},{label:"Average Order Value",value:money(transactions ? revenue/transactions : 0),note:"Revenue ÷ transactions"},{label:"Items Sold",value:String(itemsSold),note:"Quantity of products sold"}].map(card => <div key={card.label} className="bg-card rounded-xl border border-border p-4"><p className="text-sm text-muted-foreground">{card.label}</p><p className="text-2xl font-bold text-foreground mt-1">{card.value}</p><p className="text-xs text-muted-foreground mt-1">{card.note}</p></div>)}
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
      <section className="bg-card rounded-xl border border-border p-5"><h2 className="font-semibold text-foreground mb-1">{period[0].toUpperCase()+period.slice(1)} Sales</h2><p className="text-xs text-muted-foreground mb-4">Based on completed transactions saved in this browser</p><ResponsiveContainer width="100%" height={280}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))"/><XAxis dataKey="label" stroke="hsl(var(--muted-foreground))"/><YAxis stroke="hsl(var(--muted-foreground))"/><Tooltip formatter={(v) => [money(Number(v)),"Sales"]}/><Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4,4,0,0]}/></BarChart></ResponsiveContainer></section>
      <section className="bg-card rounded-xl border border-border p-5"><h2 className="font-semibold text-foreground mb-4">Best-Selling Products</h2>{bestSellers.length ? <div className="space-y-3">{bestSellers.map((item,i)=><div key={item.name} className="flex items-center justify-between border-b border-border pb-3"><div className="flex items-center gap-3"><span className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center text-sm font-semibold">{i+1}</span><div><p className="font-medium text-foreground">{item.name}</p><p className="text-xs text-muted-foreground">{item.quantity} sold</p></div></div><span className="font-semibold text-foreground">{money(item.revenue)}</span></div>)}</div> : <p className="text-sm text-muted-foreground py-10 text-center">No sales recorded for this period yet.</p>}</section>
    </div>
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <section className="bg-card rounded-xl border border-border p-5"><h2 className="font-semibold text-foreground mb-1">Low-Stock Report</h2><p className="text-xs text-muted-foreground mb-4">Sellable products with 10 or fewer items remaining</p>{lowStock.length ? <div className="space-y-3">{lowStock.map(p=><div key={p.id} className="flex justify-between border-b border-border pb-2"><div><p className="font-medium">{p.name}</p><p className="text-xs text-muted-foreground">{p.category}</p></div><span className="font-semibold text-destructive">{p.stock} left</span></div>)}</div> : <p className="text-sm text-muted-foreground">No low-stock products right now.</p>}</section>
      <section className="bg-card rounded-xl border border-border p-5"><h2 className="font-semibold text-foreground mb-1">Profit Summary</h2><p className="text-xs text-muted-foreground mb-4">Financial overview for the selected period</p><div className="space-y-3"><div className="flex justify-between"><span className="text-muted-foreground">Total Revenue</span><strong>{money(revenue)}</strong></div><div className="flex justify-between"><span className="text-muted-foreground">Recorded Expenses</span><strong>Not available</strong></div><div className="flex justify-between border-t border-border pt-3"><span className="font-semibold">Estimated Profit</span><strong>Needs cost and expense records</strong></div></div><p className="text-xs text-muted-foreground mt-4">Profit is not estimated from sales alone. Add product costs and business expenses to calculate a reliable profit figure.</p></section>
    </div>
    {!sales.length && <p className="mt-5 text-xs text-muted-foreground">Reports will populate as new checkout transactions are saved. Historical sample figures are not shown.</p>}
  </main></div>;
};
export default Reports;
