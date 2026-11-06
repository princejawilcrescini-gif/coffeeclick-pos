import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Coffee, User, Mail, LockKeyhole } from "lucide-react";
import { useAuth } from "@/auth/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function Register() {
 const {user,register}=useAuth();const navigate=useNavigate();const[name,setName]=useState("");const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[confirm,setConfirm]=useState("");const[error,setError]=useState("");
 if(user)return <Navigate to="/" replace />;
 const submit=(e:FormEvent)=>{e.preventDefault();if(password!==confirm){setError("Passwords do not match.");return;}const result=register(name,email,password);if(result.ok)navigate("/");else setError(result.message);};
 return <div className="min-h-screen flex items-center justify-center bg-[#f8f1e7] p-5"><div className="w-full max-w-xl rounded-3xl bg-white shadow-2xl p-8 sm:p-12"><div className="flex items-center gap-3 text-[#4b2e24] mb-8"><div className="rounded-xl bg-[#f1e4d4] p-3"><Coffee/></div><div><b className="text-xl">CoffeeClick</b><p className="text-xs text-muted-foreground">Point of Sale</p></div></div>
 <p className="text-sm font-semibold tracking-widest text-[#9a765c] uppercase">Get started</p><h1 className="font-display text-3xl text-[#4b2e24] mt-2">Create your account</h1><p className="text-sm text-muted-foreground mt-2 mb-7">Register to access your café workspace.</p>
 <form onSubmit={submit} className="space-y-4"><div className="space-y-2"><Label htmlFor="reg-name">Full name</Label><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input id="reg-name" required value={name} onChange={e=>setName(e.target.value)} className="pl-10 h-11" placeholder="Your full name"/></div></div>
 <div className="space-y-2"><Label htmlFor="reg-email">Email address</Label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input id="reg-email" type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="pl-10 h-11" placeholder="you@example.com"/></div></div>
 <div className="space-y-2"><Label htmlFor="reg-password">Password</Label><div className="relative"><LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground"/><Input id="reg-password" type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)} className="pl-10 h-11" placeholder="At least 6 characters"/></div></div>
 <div className="space-y-2"><Label htmlFor="reg-confirm">Confirm password</Label><Input id="reg-confirm" type="password" required value={confirm} onChange={e=>setConfirm(e.target.value)} className="h-11" placeholder="Re-enter your password"/></div>
 {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}<Button type="submit" className="w-full h-11 bg-[#4b2e24] hover:bg-[#634333]">Create Account</Button></form>
 <p className="text-center text-sm text-muted-foreground mt-6">Already have an account? <Link to="/login" className="font-semibold text-[#6b422f] hover:underline">Sign in</Link></p><p className="text-xs text-center text-muted-foreground mt-6">The first account becomes Admin. Later accounts are Cashiers.</p></div></div>;
}
