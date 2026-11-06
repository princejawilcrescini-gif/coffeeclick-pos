import { Navigate } from "react-router-dom";
import { ShieldCheck, Users as UsersIcon } from "lucide-react";
import { POSSidebar } from "@/components/pos/POSSidebar";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
export default function Users() {
 const {user,users,updateUser}=useAuth();
 if(user?.role!=="Admin")return <Navigate to="/" replace />;
 return <div className="flex min-h-screen bg-background"><POSSidebar/><main className="flex-1 ml-64 p-6"><div className="mb-7"><div className="flex items-center gap-3"><div className="rounded-xl bg-primary/10 p-3"><ShieldCheck className="text-primary"/></div><div><h1 className="text-2xl font-bold">User Access Management</h1><p className="text-muted-foreground">Manage CoffeeClick accounts, roles, and access.</p></div></div></div>
 <div className="rounded-2xl border bg-card overflow-hidden"><div className="p-5 border-b flex items-center gap-2"><UsersIcon className="text-primary"/><h2 className="font-semibold">Registered Users ({users.length})</h2></div>
 {users.length===0?<p className="p-6 text-muted-foreground">No accounts registered yet.</p>:<div className="divide-y">{users.map(account=><div key={account.id} className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"><div><p className="font-semibold">{account.name} {account.id===user.id&&<span className="text-xs text-muted-foreground">(You)</span>}</p><p className="text-sm text-muted-foreground">{account.email}</p><p className="text-xs mt-1 text-muted-foreground">Role: {account.role} · {account.active?"Active":"Inactive"}</p></div><div className="flex flex-wrap gap-2">{account.id!==user.id&&<><Button size="sm" variant="outline" onClick={()=>updateUser(account.id,{role:account.role==="Admin"?"Cashier":"Admin"})}>Make {account.role==="Admin"?"Cashier":"Admin"}</Button><Button size="sm" variant={account.active?"destructive":"default"} onClick={()=>updateUser(account.id,{active:!account.active})}>{account.active?"Deactivate":"Activate"}</Button></>}</div></div>)}</div>}</div>
 <p className="text-xs text-muted-foreground mt-4">Demo mode only: access settings are stored in this browser and are not enforced by a secure server.</p></main></div>;
}
