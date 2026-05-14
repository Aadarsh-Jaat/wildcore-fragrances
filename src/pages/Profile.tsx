import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Package, LogOut, Check, Eye, EyeOff, Phone, MapPin, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

type Tab = 'orders' | 'profile';

function LoginForm() {
  const { login, signup, error, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      await login(email, password);
    } else {
      await signup(name, email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">Welcome</p>
          <h1 className="font-serif text-4xl font-bold text-[var(--text)]">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h1>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex glass rounded-xl p-1 mb-6">
            {(['login', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === m ? 'bg-gold text-black' : 'text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Jane Doe"
                  className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            )}

            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 pr-11 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-400 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gold hover:bg-gold-light disabled:opacity-60 text-black font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
            >
              {loading ? 'Loading...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-[var(--text-muted)] mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
              className="text-gold hover:text-gold-light transition-colors"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

const statusColors = {
  delivered: { text: 'text-green-400', bg: 'bg-green-400/10', label: 'Delivered' },
  shipped: { text: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Shipped' },
  processing: { text: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Processing' },
};

const statusSteps = ['processing', 'shipped', 'delivered'];

export default function Profile() {
  const { user, logout, updateProfile } = useAuth();
  const [tab, setTab] = useState<Tab>('orders');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    address: user?.address || '',
    phone: (user as any)?.phone || '',
  });
  const [saved, setSaved] = useState(false);

  if (!user) return <LoginForm />;

  const isAdmin = user.role === 'admin';

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setEditing(false);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = isAdmin
    ? [{ key: 'profile', label: 'Profile', icon: User }]
    : [
        { key: 'orders', label: 'My Orders', icon: Package },
        { key: 'profile', label: 'Profile', icon: User },
      ];

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-2">
              {isAdmin ? 'Admin Account' : 'My Account'}
            </p>
            <h1 className="font-serif text-4xl font-bold text-[var(--text)]">
              Welcome, {user.name.split(' ')[0]}
            </h1>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-red-400 transition-colors glass px-4 py-2 rounded-xl"
          >
            <LogOut size={15} /> Sign Out
          </button>
        </motion.div>

        {isAdmin && (
          <div className="glass rounded-2xl p-6 mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">Admin Mode</p>
              <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Manage Wildcore</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">
                Orders, users, products, stock, and dashboard are handled from admin panel.
              </p>
            </div>

            <Link
  to="/admin"
  className="inline-flex items-center justify-center gap-2 bg-gold text-black font-semibold px-5 py-3 rounded-xl hover:bg-gold-light transition-all"
>
  <ShieldCheck size={16} /> Open Admin Panel
</Link>
          </div>
        )}

        <div className="flex glass rounded-xl p-1 mb-8 w-fit">
          {(tabs as { key: Tab; label: string; icon: any }[]).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                (isAdmin && key === 'profile') || tab === key
                  ? 'bg-gold text-black'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {!isAdmin && tab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {user.orders.length === 0 ? (
                <div className="text-center py-16">
                  <Package size={48} className="text-[var(--text-muted)] mx-auto mb-4 opacity-30" />
                  <p className="font-serif text-xl text-[var(--text-muted)] italic">No orders yet.</p>
                  <a href="/shop" className="text-gold text-sm mt-2 inline-block hover:underline">
                    Start shopping →
                  </a>
                </div>
              ) : (
                user.orders.map((order: any) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass glass-hover rounded-2xl p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs tracking-wider text-[var(--text-muted)] uppercase">Order #{order.id}</p>
                        <p className="text-sm text-[var(--text)] mt-0.5">
                          {new Date(order.date).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        {order.note && (
                          <p className="text-xs text-[var(--text-muted)] mt-1 italic">{order.note}</p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${statusColors[order.status as keyof typeof statusColors]?.bg} ${statusColors[order.status as keyof typeof statusColors]?.text}`}>
                          {statusColors[order.status as keyof typeof statusColors]?.label}
                        </span>

                        {order.paymentStatus && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            order.paymentStatus === 'paid'
                              ? 'bg-green-400/10 text-green-400'
                              : 'bg-red-400/10 text-red-400'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between relative">
                        <div className="absolute left-0 right-0 top-3 h-0.5 bg-[var(--border)]" />
                        <div
                          className="absolute left-0 top-3 h-0.5 bg-gold transition-all duration-500"
                          style={{
                            width: `${(statusSteps.indexOf(order.status) / (statusSteps.length - 1)) * 100}%`,
                          }}
                        />

                        {statusSteps.map((step, i) => {
                          const isCompleted = statusSteps.indexOf(order.status) >= i;
                          return (
                            <div key={step} className="flex flex-col items-center relative z-10">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCompleted
                                  ? 'bg-gold border-gold'
                                  : 'bg-[var(--bg)] border-[var(--border)]'
                              }`}>
                                {isCompleted && <Check size={12} className="text-black" />}
                              </div>
                              <p className={`text-xs mt-1.5 capitalize ${
                                isCompleted ? 'text-gold' : 'text-[var(--text-muted)]'
                              }`}>
                                {step}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-[var(--border)] pt-4">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-[var(--text-muted)]">
                            {item.name} ({item.volume}ml) × {item.qty}
                          </span>
                          <span className="text-[var(--text)]">₹{(item.price * item.qty).toFixed(2)}</span>
                        </div>
                      ))}

                      <div className="flex justify-between font-semibold text-sm pt-2 border-t border-[var(--border)] mt-2">
                        <span className="text-[var(--text)]">Total</span>
                        <span className="text-gold">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {(tab === 'profile' || isAdmin) && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="glass rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif text-xl font-bold text-[var(--text)]">
                    {isAdmin ? 'Admin Information' : 'Personal Information'}
                  </h2>

                  <button
                    onClick={() => (editing ? handleSave() : setEditing(true))}
                    className={`flex items-center gap-2 text-sm px-4 py-2 rounded-xl transition-all ${
                      editing
                        ? 'bg-gold text-black hover:bg-gold-light'
                        : 'glass glass-hover text-[var(--text-muted)]'
                    }`}
                  >
                    {editing ? <><Check size={14} /> Save</> : <>Edit Profile</>}
                  </button>
                </div>

                {saved && (
                  <p className="text-sm text-green-400 mb-4 flex items-center gap-2">
                    <Check size={14} /> Profile updated successfully.
                  </p>
                )}

                <div className="space-y-4">
                  {[
                    { label: 'Full Name', key: 'name', type: 'text', icon: User },
                    { label: 'Email', key: 'email', type: 'email', icon: User },
                    { label: 'Phone Number', key: 'phone', type: 'tel', icon: Phone },
                    { label: isAdmin ? 'Admin Address / Business Address' : 'Shipping Address', key: 'address', type: 'text', icon: MapPin },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">
                        {field.label}
                      </label>

                      {editing ? (
                        <input
                          type={field.type}
                          value={form[field.key as keyof typeof form]}
                          onChange={e => setForm(f => ({ ...f, [field.key]: e.target.value }))}
                          className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] focus:outline-none focus:border-gold transition-colors"
                        />
                      ) : (
                        <p className="text-sm text-[var(--text)] py-3 px-4 bg-[var(--bg3)] rounded-xl">
                          {(user as any)[field.key] || form[field.key as keyof typeof form] || (
                            <span className="text-[var(--text-muted)] italic">Not set</span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}