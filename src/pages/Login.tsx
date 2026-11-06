import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Coffee, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Login() {
  const { user, login } = useAuth(); const navigate = useNavigate();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [visible,setVisible]=useState(false); const [error,setError]=useState("");
  if (user) return <Navigate to="/" replace />;
  const submit=(e:FormEvent)=>{e.preventDefault();const result=login(email,password);if(result.ok)navigate("/");else setError(result.message);};
  return <div className="min-h-screen flex items-center justify-center bg-[#f8f1e7] p-5"><div className="w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl grid md:grid-cols-2">
    <section className="hidden md:flex flex-col justify-between bg-[#4b2e24] p-12 text-[#fff8ed]"><div className="flex items-center gap-3"><Coffee size={32}/><b className="text-2xl">CoffeeClick</b></div><div><p className="uppercase tracking-[.25em] text-sm text-[#d9bd9a]">Your café, simplified</p><h1 className="font-display text-5xl leading-tight mt-4">A warm welcome starts here.</h1><p className="mt-5 text-[#ead9c6]">Sign in to manage your café operations.</p></div><p className="text-sm text-[#d9bd9a]">Point of Sale</p></section>
    <section className="p-8 sm:p-12 flex flex-col justify-center"><div className="md:hidden flex items-center gap-2 text-[#4b2e24] mb-8"><Coffee/><b className="text-xl">CoffeeClick</b></div><p className="text-sm font-semibold tracking-widest text-[#9a765c] uppercase">Welcome back</p><h2 className="font-display text-3xl text-[#4b2e24] mt-2">Sign in to your account</h2><p className="text-sm text-muted-foreground mt-2 mb-8">Enter your account details to continue.</p>
    <form onSubmit={submit} className="space-y-5"><div className="space-y-2"><Label htmlFor="login-email">Email address</Label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input id="login-email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="pl-10 h-11" placeholder="you@example.com"/></div></div>
    <div className="space-y-2"><Label htmlFor="login-password">Password</Label><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input id="login-password" type={visible?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} className="pl-10 pr-10 h-11" placeholder="Enter your password"/><button type="button" onClick={()=>setVisible(!visible)} className="absolute right-3 top-3 text-muted-foreground">{visible?<EyeOff size={17}/>:<Eye size={17}/>}</button></div></div>
    {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}<Button type="submit" className="w-full h-11 bg-[#4b2e24] hover:bg-[#634333]">Sign In</Button></form>
    <p className="text-center text-sm text-muted-foreground mt-7">New to CoffeeClick? <Link className="font-semibold text-[#6b422f] hover:underline" to="/register">Create an account</Link></p><p className="text-xs text-center text-muted-foreground mt-8">Demo mode: accounts are saved in this browser only.</p></section>
  </div></div>;
}
