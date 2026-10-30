import { useMemo, useState } from "react";
import { X, CreditCard, Banknote, Smartphone, Check, Printer, Receipt, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CartItem } from "./CartSidebar";

interface CheckoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  items: CartItem[];
  onComplete: () => void;
}

type PaymentMethod = "card" | "cash" | "mobile";
const money = (value: number) => `₱${value.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export function CheckoutDialog({ isOpen, onClose, total, items, onComplete }: CheckoutDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("cash");
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [cashTendered, setCashTendered] = useState("");
  const [transactionDate, setTransactionDate] = useState<Date | null>(null);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const tax = subtotal * 0.08;
  const amountPaid = selectedMethod === "cash" ? Number(cashTendered || 0) : total;
  const change = Math.max(0, amountPaid - total);
  const insufficientCash = selectedMethod === "cash" && amountPaid < total;

  if (!isOpen) return null;

  const handlePayment = async () => {
    if (insufficientCash) return;
    setProcessing(true);
    await new Promise(resolve => setTimeout(resolve, 600));
    setTransactionId(`TXN-${Date.now().toString().slice(-8)}`);
    setTransactionDate(new Date());
    setProcessing(false);
    setCompleted(true);
  };

  const handleDone = () => {
    setCompleted(false);
    setCashTendered("");
    setTransactionDate(null);
    onComplete();
  };

  const paymentMethods = [
    { id: "card" as PaymentMethod, icon: CreditCard, label: "Card" },
    { id: "cash" as PaymentMethod, icon: Banknote, label: "Cash" },
    { id: "mobile" as PaymentMethod, icon: Smartphone, label: "Mobile Pay" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={completed ? undefined : onClose} />
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden max-h-[92vh] overflow-y-auto">
        {completed ? (
          <div className="p-5 sm:p-6">
            <div className="text-center mb-5 no-print">
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                <Check className="w-7 h-7 text-success" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
              <p className="text-muted-foreground">Your receipt is ready to print.</p>
            </div>

            <div id="pos-receipt" className="receipt-print mx-auto w-full max-w-[390px] bg-white text-slate-950 border border-slate-200 shadow-sm px-6 py-7 sm:px-8 font-sans">
              <header className="text-center pb-5">
                <Coffee className="w-10 h-10 mx-auto mb-2 text-amber-950" strokeWidth={1.8} />
                <h3 className="text-[25px] leading-tight font-extrabold tracking-tight">CoffeeClick</h3>
                <p className="text-[10px] tracking-[0.25em] font-semibold mt-1">COFFEE • SNACKS • MORE</p>
                <p className="text-xs italic tracking-wider mt-3 text-slate-600">Good Food. Better Moments.</p>
              </header>

              <section className="border-y border-dashed border-slate-400 py-4 text-[12px] space-y-2">
                <div className="grid grid-cols-[104px_10px_1fr] gap-1"><span>Transaction No.</span><span>:</span><span className="font-semibold">{transactionId}</span></div>
                <div className="grid grid-cols-[104px_10px_1fr] gap-1"><span>Date &amp; Time</span><span>:</span><span>{(transactionDate ?? new Date()).toLocaleString("en-PH", { dateStyle: "medium", timeStyle: "short" })}</span></div>
                <div className="grid grid-cols-[104px_10px_1fr] gap-1"><span>Cashier</span><span>:</span><span>Online</span></div>
              </section>

              <section className="pt-4">
                <div className="grid grid-cols-[1fr_34px_72px_76px] gap-2 border-b border-dashed border-slate-400 pb-2 text-[11px] font-bold">
                  <span>Item</span><span className="text-right">Qty</span><span className="text-right">Price</span><span className="text-right">Total</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {items.map(item => (
                    <div key={item.id} className="grid grid-cols-[1fr_34px_72px_76px] gap-2 py-3 text-[11px] items-start">
                      <span className="font-medium leading-snug break-words">{item.name}</span>
                      <span className="text-right">{item.quantity}</span>
                      <span className="text-right whitespace-nowrap">{money(item.price)}</span>
                      <span className="text-right font-medium whitespace-nowrap">{money(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="border-t border-dashed border-slate-400 pt-4 mt-1 space-y-2 text-[12px]">
                <div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div>
                <div className="flex justify-between"><span>Tax (8%)</span><span>{money(tax)}</span></div>
                <div className="flex justify-between items-center border-t border-dashed border-slate-300 pt-3 mt-2 text-base font-extrabold"><span>Total</span><span>{money(total)}</span></div>
              </section>

              <section className="border-t border-dashed border-slate-400 mt-4 pt-4 space-y-2 text-[12px]">
                <div className="grid grid-cols-[116px_10px_1fr] gap-1"><span>Payment Method</span><span>:</span><span>{selectedMethod === "mobile" ? "Mobile Pay" : selectedMethod === "card" ? "Card" : "Cash"}</span></div>
                <div className="grid grid-cols-[116px_10px_1fr] gap-1"><span>Amount Paid</span><span>:</span><span>{money(amountPaid)}</span></div>
                <div className="grid grid-cols-[116px_10px_1fr] gap-1 font-semibold"><span>Change</span><span>:</span><span>{money(change)}</span></div>
              </section>

              <footer className="text-center pt-8 pb-1">
                <p className="text-[27px] italic font-semibold tracking-tight">Thank You!</p>
                <p className="text-[11px] tracking-[0.16em] mt-1">Please come again.</p>
                <div className="flex items-center justify-center gap-3 mt-4 text-amber-950"><span className="w-12 border-t border-slate-500"/><Coffee className="w-5 h-5"/><span className="w-12 border-t border-slate-500"/></div>
              </footer>
            </div>

            <div className="flex gap-3 mt-5 no-print">
              <Button onClick={() => window.print()} variant="outline" className="flex-1"><Printer className="w-4 h-4 mr-2" /> Print Receipt</Button>
              <Button onClick={handleDone} className="flex-1">Done</Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Checkout</h2>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground" aria-label="Close checkout"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="text-center py-4 bg-secondary/50 rounded-xl">
                <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                <p className="text-4xl font-bold text-foreground">{money(total)}</p>
              </div>
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground">Payment Method</p>
                <div className="grid grid-cols-3 gap-3">
                  {paymentMethods.map(method => (
                    <button key={method.id} onClick={() => setSelectedMethod(method.id)} className={cn("p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all", selectedMethod === method.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50")}>
                      <method.icon className={cn("w-6 h-6", selectedMethod === method.id ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm font-medium", selectedMethod === method.id ? "text-primary" : "text-muted-foreground")}>{method.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              {selectedMethod === "cash" && (
                <div className="space-y-2">
                  <label htmlFor="cash-tendered" className="text-sm font-medium text-foreground">Cash Tendered</label>
                  <div className="flex items-center rounded-lg border border-input px-3 focus-within:ring-2 focus-within:ring-ring">
                    <span className="text-muted-foreground">₱</span>
                    <input id="cash-tendered" type="number" min={total} step="0.01" value={cashTendered} onChange={event => setCashTendered(event.target.value)} placeholder={total.toFixed(2)} className="w-full bg-transparent px-2 py-3 outline-none" />
                  </div>
                  {cashTendered !== "" && <p className={cn("text-sm", insufficientCash ? "text-destructive" : "text-success")}>{insufficientCash ? `Short by ${money(total - amountPaid)}` : `Change: ${money(change)}`}</p>}
                </div>
              )}
              <Button onClick={handlePayment} disabled={processing || insufficientCash || (selectedMethod === "cash" && cashTendered === "")} className="w-full h-14 text-lg font-semibold">
                {processing ? "Processing..." : `Pay ${money(total)}`}
              </Button>
            </div>
          </>
        )}
      </div>
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 4mm; }
          body * { visibility: hidden !important; }
          #pos-receipt, #pos-receipt * { visibility: visible !important; }
          #pos-receipt { position: absolute !important; left: 0 !important; top: 0 !important; width: 72mm !important; max-width: 72mm !important; margin: 0 !important; padding: 5mm !important; border: 0 !important; box-shadow: none !important; }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
}
