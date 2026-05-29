import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X, ShoppingBag, MessageCircle, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
const WHATSAPP = '917056713252';

export default function Cart() {
  const { items, removeItem, updateQty, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState('');
const [customerPhone, setCustomerPhone] = useState('');
const [customerAddress, setCustomerAddress] = useState('');

  const handleWhatsAppCheckout = () => {
  if (items.length === 0) return;

  if (!customerName || !customerPhone || !customerAddress) {
    alert('Please fill your details');
    return;
  }

  const lines = items.map(
    i =>
      `• ${i.name} (${i.volume}ml) × ${i.quantity} = ₹${(
        i.price * i.quantity
      ).toFixed(2)}`
  );

  const msg =
`Hi Wildcore Fragrances!

I would like to place an order.

CUSTOMER DETAILS
Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

ORDER DETAILS
${lines.join('\n')}

Total: ₹${total.toFixed(2)}

Please confirm my order.`;

  window.open(
    `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,
    '_blank'
  );
};

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">Your Selection</p>
          <h1 className="font-serif text-5xl font-bold text-[var(--text)] mb-10">Cart</h1>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <ShoppingBag size={60} className="text-[var(--text-muted)] mx-auto mb-6 opacity-30" />
            <p className="text-xl font-serif text-[var(--text-muted)] italic mb-2">Your cart is empty.</p>
            <p className="text-sm text-[var(--text-muted)] mb-8">The wild awaits you.</p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-black font-semibold rounded-xl hover:bg-gold-light transition-all"
            >
              Explore Fragrances <ArrowRight size={16} />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Item list */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map(item => (
                  <motion.div
                    key={`${item.id}-${item.volume}`}
                    className="glass glass-hover rounded-2xl p-4 flex gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, height: 0 }}
                    layout
                  >
                    {/* Image */}
                    <Link to={`/product/${item.id}`} className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        decoding="async"
                        className="w-20 h-20 rounded-xl object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/₹{item.id}`} className="hover:text-gold transition-colors">
                        <h3 className="font-serif font-semibold text-[var(--text)] text-base leading-tight">{item.name}</h3>
                      </Link>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{item.volume}ml</p>
                      <p className="text-sm font-semibold text-gold mt-1">₹{item.price} each</p>

                      <div className="flex items-center justify-between mt-3">
                        {/* Qty controls */}
                        <div className="flex items-center glass rounded-lg overflow-hidden">
                          <button
                            onClick={() => updateQty(item.id, item.volume, item.quantity - 1)}
                            className="px-3 py-2 text-[var(--text-muted)] hover:text-gold transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-[var(--text)]">{item.quantity}</span>
                          <button
                            onClick={() => updateQty(item.id, item.volume, item.quantity + 1)}
                            className="px-3 py-2 text-[var(--text-muted)] hover:text-gold transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <p className="font-bold text-[var(--text)]">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id, item.volume)}
                      className="self-start text-[var(--text-muted)] hover:text-red-400 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex justify-end pt-2">
                <button
                  onClick={clearCart}
                  className="text-xs text-[var(--text-muted)] hover:text-red-400 transition-colors underline"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <motion.div
                className="glass rounded-2xl p-6 sticky top-28"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="font-serif text-xl font-bold text-[var(--text)] mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  {items.map(item => (
                    <div key={`${item.id}-${item.volume}`} className="flex justify-between text-sm">
                      <span className="text-[var(--text-muted)] truncate mr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-[var(--text)] flex-shrink-0">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[var(--border)] pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-[var(--text)]">Subtotal</span>
                    <span className="text-2xl font-serif font-bold text-gold">₹{total.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Shipping calculated at checkout via WhatsApp</p>
                </div>
                <div className="space-y-4 mb-6">

  <input
    type="text"
    placeholder="Full Name"
    value={customerName}
    onChange={(e) => setCustomerName(e.target.value)}
    className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
  />

  <input
    type="tel"
    placeholder="Phone Number"
    value={customerPhone}
    onChange={(e) => setCustomerPhone(e.target.value)}
    className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
  />

  <textarea
    placeholder="Delivery Address"
    value={customerAddress}
    onChange={(e) => setCustomerAddress(e.target.value)}
    rows={3}
    className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] resize-none"
  />

</div>
                <button
                  onClick={handleWhatsAppCheckout}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1fc255] text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] mb-3"
                >
                  <MessageCircle size={18} />
                  Checkout via WhatsApp
                </button>

                <Link
                  to="/shop"
                  className="w-full flex items-center justify-center gap-2 py-3 glass glass-hover text-[var(--text-muted)] text-sm rounded-xl transition-all"
                >
                  Continue Shopping
                </Link>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
