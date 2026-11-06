import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type UserRole = "Admin" | "Cashier";
export interface DemoUser { id: string; name: string; email: string; password: string; role: UserRole; active: boolean; }
type SafeUser = Omit<DemoUser, "password">;
interface AuthValue {
  user: SafeUser | null; users: DemoUser[];
  login: (email: string, password: string) => { ok: boolean; message: string };
  register: (name: string, email: string, password: string) => { ok: boolean; message: string };
  logout: () => void;
  updateUser: (id: string, changes: Partial<Pick<DemoUser, "role" | "active">>) => void;
}
const AuthContext = createContext<AuthValue | null>(null);
const USERS_KEY = "coffeeclick-demo-users";
const SESSION_KEY = "coffeeclick-demo-session";
const safe = ({ password: _password, ...rest }: DemoUser): SafeUser => rest;
const readUsers = (): DemoUser[] => { try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; } };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<DemoUser[]>([]);
  const [user, setUser] = useState<SafeUser | null>(null);
  useEffect(() => {
    const saved = readUsers(); setUsers(saved);
    const current = saved.find(u => u.id === localStorage.getItem(SESSION_KEY) && u.active);
    if (current) setUser(safe(current));
  }, []);
  const save = (next: DemoUser[]) => { localStorage.setItem(USERS_KEY, JSON.stringify(next)); setUsers(next); };
  const login = (email: string, password: string) => {
    const found = users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!found || found.password !== password) return { ok: false, message: "Email or password is incorrect." };
    if (!found.active) return { ok: false, message: "This account is inactive. Contact your administrator." };
    localStorage.setItem(SESSION_KEY, found.id); setUser(safe(found)); return { ok: true, message: "Signed in successfully." };
  };
  const register = (name: string, email: string, password: string) => {
    if (!name.trim() || !email.trim() || password.length < 6) return { ok: false, message: "Complete all fields. Password must be at least 6 characters." };
    if (users.some(u => u.email.toLowerCase() === email.trim().toLowerCase())) return { ok: false, message: "This email is already registered." };
    const created: DemoUser = { id: crypto.randomUUID(), name: name.trim(), email: email.trim(), password, role: users.length === 0 ? "Admin" : "Cashier", active: true };
    save([...users, created]); localStorage.setItem(SESSION_KEY, created.id); setUser(safe(created));
    return { ok: true, message: "Account created." };
  };
  const logout = () => { localStorage.removeItem(SESSION_KEY); setUser(null); };
  const updateUser = (id: string, changes: Partial<Pick<DemoUser, "role" | "active">>) => save(users.map(u => u.id === id ? { ...u, ...changes } : u));
  return <AuthContext.Provider value={{ user, users, login, register, logout, updateUser }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const value = useContext(AuthContext); if (!value) throw new Error("useAuth must be inside AuthProvider"); return value; }
