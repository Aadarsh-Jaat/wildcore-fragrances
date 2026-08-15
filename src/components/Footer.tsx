import { Link } from 'react-router-dom';
import { Instagram, MessageCircle, Mail, ArrowRight } from 'lucide-react';
import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useToast } from '../context/ToastContext';


const WHATSAPP = '918295713252';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { addToast } = useToast();
const handleSubscribe = async (e: React.FormEvent) => {
  e.preventDefault();

  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) return;

  try {
    const q = query(
      collection(db, "newsletterSubscribers"),
      where("email", "==", cleanEmail)
    );

    const existing = await getDocs(q);

    if (!existing.empty) {
      addToast("You are already subscribed ✨");
      setEmail("");
      return;
    }

    await addDoc(collection(db, "newsletterSubscribers"), {
      email: cleanEmail,
      source: "footer_newsletter",
      createdAt: serverTimestamp(),
    });

    setSubscribed(true);
    setEmail("");
    addToast("Subscribed successfully ✨");
  } catch (error) {
    console.error("Footer newsletter error:", error);
    addToast("Something went wrong. Please try again.");
  }
};

  return (
    <footer className="bg-[var(--bg2)] border-t border-[var(--border)] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold gold-gradient tracking-wider uppercase">
                Wildcore
              </span>
              <p className="text-[9px] tracking-[0.45em] text-[var(--text-muted)] uppercase mt-0.5">
                Fragrances
              </p>
            </Link>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-3">
              Wear the wild. Fragrances crafted for those who refuse to be ordinary.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="https://instagram.com/wild_core_fragrances"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass glass-hover rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-gold transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 glass glass-hover rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-gold transition-colors"
              >
                <MessageCircle size={16} />
              </a>
              <a
                href="mailto:wildcoreessentials@gmail.com"
                className="w-9 h-9 glass glass-hover rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-gold transition-colors"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Explore</h4>
            <ul className="space-y-3">
              {[
                { label: 'Shop All', to: '/shop' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
                { label: 'My Account', to: '/profile' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Collections</h4>
            <ul className="space-y-3">
              {['Woody', 'Floral', 'Oud', 'Fresh', 'Oriental', 'Unisex'].map(cat => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${cat}`}
                    className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.3em] uppercase text-[var(--text-muted)] mb-4">Stay Wild</h4>
            <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
              New drops, exclusive offers, and wild stories — straight to your inbox.
            </p>
            {subscribed ? (
              <p className="text-sm text-gold font-medium">You're in. Welcome to the wildcore.</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="flex-1 bg-[var(--bg3)] border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-2.5 bg-gold text-black rounded-lg hover:bg-gold-light transition-colors"
                >
                  <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-[var(--border)] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © 2025 Wildcore Fragrances. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-[var(--text-muted)]">
  <Link
    to="/privacy-policy"
    className="hover:text-gold transition-colors"
  >
    Privacy Policy
  </Link>

  <Link
    to="/terms"
    className="hover:text-gold transition-colors"
  >
    Terms of Service
  </Link>

  <Link
    to="/shipping-policy"
    className="hover:text-gold transition-colors"
  >
    Shipping Policy
  </Link>
</div>
        </div>
      </div>
    </footer>
  );
}
