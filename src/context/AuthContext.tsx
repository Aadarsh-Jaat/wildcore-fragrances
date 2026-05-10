import { createContext, useContext, useState, ReactNode } from 'react';
export interface User {
  id: string;
  name: string;
  email: string;
  address?: string;
  orders: Order[];
}
export interface Order {
  id: string;
  date: string;
  items: { name: string; volume: number; qty: number; price: number }[];
  total: number;
  status: 'delivered' | 'shipped' | 'processing';
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  error: string | null;
  loading: boolean;
}
const AuthContext = createContext<AuthContextType | null>(null);
const MOCK_ORDERS: Order[] = [
  {
    id: 'WC-2024-001',
    date: '2024-11-15',
    items: [{ name: 'Obsidian Noir', volume: 50, qty: 1, price: 89 }],
    total: 89,
    status: 'delivered',
  },
  {
    id: 'WC-2024-002',
    date: '2024-12-03',
    items: [
      { name: 'Velvet Rose', volume: 30, qty: 1, price: 49 },
      { name: 'Arctic Pulse', volume: 50, qty: 2, price: 69 },
    ],
    total: 187,
    status: 'shipped',
  },
];
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const login = async (email: string, _password: string) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 800));
    if (!email.includes('@')) {
      setError('Invalid email address.');
      setLoading(false);
      return;
    }
    setUser({
      id: 'user-1',
      name: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
      email,
      address: '123 Wild St, Fragrance City',
      orders: MOCK_ORDERS,
    });
    setLoading(false);
  };
  const signup = async (name: string, email: string, _password: string) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 800));
    if (!email.includes('@')) {
      setError('Invalid email address.');
      setLoading(false);
      return;
    }
    setUser({ id: 'user-new', name, email, orders: [] });
    setLoading(false);
  };
  const logout = () => setUser(null);
  const updateProfile = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile, error, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
