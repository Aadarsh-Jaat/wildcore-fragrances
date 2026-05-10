import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Sun, Moon, Menu, X, Search } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';

const NAV = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const { isDark, toggle } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'py-3 glass border-b border-[var(--border)]'
            : 'py-5 bg-transparent'
        }`}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link to="/" className="flex flex-col leading-none group">
            <span className="font-serif text-xl font-bold gold-gradient tracking-wider uppercase">
              Wildcore
            </span>
            <span className="text-[9px] tracking-[0.45em] text-[var(--text-muted)] uppercase mt-0.5 group-hover:text-gold transition-colors">
              Fragrances
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`text-sm font-medium tracking-wide transition-colors relative group ${
                  location.pathname === path
                    ? 'text-gold'
                    : 'text-[var(--text)] hover:text-gold'
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-gold transition-all duration-300 ${
                    location.pathname === path ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="p-2 text-[var(--text-muted)] hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            <button
              className="p-2 text-[var(--text-muted)] hover:text-gold transition-colors"
              onClick={toggle}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <Link
              to="/profile"
              className="p-2 text-[var(--text-muted)] hover:text-gold transition-colors"
              aria-label="Profile"
            >
              <User size={18} />
            </Link>

            <Link
              to="/cart"
              className="relative p-2 text-[var(--text-muted)] hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} />
              <AnimatePresence>
                {count > 0 && (
                  <motion.span
                    key={count}
                    className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[1.1rem] min-h-[1.1rem] bg-gold text-black text-[10px] font-bold rounded-full flex items-center justify-center leading-none px-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <button
              className="ml-1 p-2 md:hidden text-[var(--text-muted)] hover:text-gold transition-colors"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 glass-light pt-20"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <nav className="flex flex-col items-center justify-center h-full gap-8">
              {NAV.map(({ label, path }, i) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={path}
                    className={`text-3xl font-serif font-bold transition-colors ${
                      location.pathname === path ? 'text-gold' : 'text-[var(--text)] hover:text-gold'
                    }`}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
