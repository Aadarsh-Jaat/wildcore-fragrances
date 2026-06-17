import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  MessageCircle,
  Star,
  ArrowLeft,
  Plus,
  User,
  Phone,
  MapPin,
  Minus,
  ChevronDown,
  ChevronUp,
  Send,
  X,
} from 'lucide-react';
import { getProductById, getProducts } from '../services/productService';
import type { Product, ProductVolume } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import { trackWhatsAppClick } from '../services/whatsappTracker';

const WHATSAPP = '917056713252';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const { addToast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVolume, setSelectedVolume] = useState<ProductVolume | null>(null);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [notesOpen, setNotesOpen] = useState(true);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // WhatsApp Popup State
  const [showWhatsAppPopup, setShowWhatsAppPopup] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);

        if (data) {
          const availableVolumes = (data.volumes || []).filter(v => v.price > 0);

          if (data.type === 'Solid Perfume') {
            setSelectedVolume(availableVolumes[0] || null);
          } else {
            const thirtyMl = availableVolumes.find(v => v.ml === 30);
            setSelectedVolume(thirtyMl || availableVolumes[0] || null);
          }

          const allProducts = await getProducts();
          const relatedProducts = allProducts
            .filter(p => p.id !== data.id && p.category === data.category)
            .slice(0, 4);

          setRelated(relatedProducts);
        }
      } catch (error) {
        console.error('Failed to load product:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVolume || !product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: selectedVolume.price,
      image: product.image,
      volume: selectedVolume.ml,
      quantity: qty,
    });

    addToast(`${product.name} (${selectedVolume.ml}ml) added to cart`);
  };

  const handleWhatsAppClick = async () => {
  // Validate required fields
  if (!product || !selectedVolume) {
    alert('Product not available. Please try again.');
    return;
  }

  if (!customerName.trim() || !customerPhone.trim() || !customerAddress.trim()) {
    alert('Please fill in your Name, Phone, and Address before ordering.');
    return;
  }

  setIsSubmitting(true);

  try {
    const total = (selectedVolume.price * qty).toFixed(2);
    
    const message = `🧾 *Wildcore Fragrances - New Order*

👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
📍 *Address:* ${customerAddress}

🛍️ *Product Details:*
• *Product:* ${product.name}
• *Volume:* ${selectedVolume.ml}ml
• *Quantity:* ${qty}
• *Price:* ₹${selectedVolume.price}/unit
• *Total:* ₹${total}

---
*I would like to place this order. Please confirm.*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappLink = `https://wa.me/${WHATSAPP}?text=${encodedMessage}`;

    // Track the WhatsApp click in Firebase - FIXED: total price
    console.log('📤 Tracking WhatsApp click for product:', product.name);
    console.log('📦 Quantity:', qty, '| Total Price: ₹' + total);
    
    await trackWhatsAppClick({
      productId: product.id,
      productName: product.name,
      productPrice: selectedVolume.price * qty,  // ← FIXED: Now saves total price!
      volume: selectedVolume.ml,
      customerName: customerName.trim(),
      phone: customerPhone.trim(),
      email: '',
      message: message,
      whatsappLink: whatsappLink,
      source: 'product_page',
    });

    console.log('✅ WhatsApp click tracked successfully!');
    
    // Open WhatsApp
    window.open(whatsappLink, '_blank');
    
    // Close popup and reset
    setShowWhatsAppPopup(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerAddress('');
    
    addToast('Order sent via WhatsApp! 📱');
    
  } catch (error) {
    console.error('❌ Error tracking WhatsApp click:', error);
    // Still open WhatsApp even if tracking fails
    const total = (selectedVolume.price * qty).toFixed(2);
    const message = `🧾 *Wildcore Fragrances - New Order*

👤 *Customer:* ${customerName}
📞 *Phone:* ${customerPhone}
📍 *Address:* ${customerAddress}

🛍️ *Product Details:*
• *Product:* ${product.name}
• *Volume:* ${selectedVolume.ml}ml
• *Quantity:* ${qty}
• *Price:* ₹${selectedVolume.price}/unit
• *Total:* ₹${total}

---
*I would like to place this order. Please confirm.*`;
    
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`, '_blank');
    setShowWhatsAppPopup(false);
  } finally {
    setIsSubmitting(false);
  }
};
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-[var(--text-muted)]">Loading fragrance...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-[var(--text-muted)] text-lg font-serif">Fragrance not found.</p>
          <Link to="/shop" className="text-gold mt-4 inline-block hover:text-gold-light transition-colors">
            ← Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const productImages = product.images?.length ? product.images : [product.image];
  const availableVolumes = (product.volumes || []).filter(v => v.price > 0);
  const sizeLabel = product.type === 'Solid Perfume' ? 'Size' : 'Volume';
  const unitLabel = product.type === 'Solid Perfume' ? 'g' : 'ml';

  const sortedVolumes = [...availableVolumes].sort((a, b) => {
    const order: Record<number, number> = { 30: 0, 8: 1, 50: 2, 100: 3 };
    return (order[a.ml] ?? 99) - (order[b.ml] ?? 99);
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={15} /> Back to Shop
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="relative rounded-3xl overflow-hidden aspect-square bg-[var(--bg3)] cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <img
                src={productImages[activeImage]}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-200"
                style={
                  isZoomed
                    ? {
                        transform: 'scale(1.8)',
                        transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                      }
                    : {}
                }
              />

              {product.bestseller && (
                <div className="absolute top-4 left-4 text-xs font-bold tracking-widest uppercase bg-gold text-black px-3 py-1.5 rounded-lg">
                  Bestseller
                </div>
              )}

              {product.newArrival && (
                <div className="absolute top-4 right-4 glass text-xs font-bold tracking-widest uppercase text-gold px-3 py-1.5 rounded-lg border border-gold/40">
                  New
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="flex gap-3">
                {productImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden transition-all ${
                      i === activeImage ? 'ring-2 ring-gold' : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <img src={img} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">
              {product.category}
            </p>

            <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] mb-2">
              {product.name}
            </h1>

            <p className="text-[var(--text-muted)] italic mb-4">{product.tagline}</p>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={15}
                    fill={i < Math.floor(product.rating || 0) ? '#C9A84C' : 'none'}
                    className={i < Math.floor(product.rating || 0) ? 'text-gold' : 'text-[var(--text-muted)]'}
                  />
                ))}
              </div>
              <span className="text-sm text-[var(--text)]">{product.rating || 0}</span>
              <span className="text-sm text-[var(--text-muted)]">({product.reviews || 0} reviews)</span>
            </div>

            <p className="text-[var(--text-muted)] leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="glass rounded-2xl mb-6 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-sm font-semibold text-[var(--text)]"
                onClick={() => setNotesOpen(o => !o)}
              >
                <span className="tracking-wider uppercase text-xs">Fragrance Notes</span>
                {notesOpen ? <ChevronUp size={16} className="text-gold" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
              </button>

              {notesOpen && (
                <motion.div
                  className="px-4 pb-5 grid grid-cols-3 gap-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                >
                  {(['top', 'middle', 'base'] as const).map(layer => (
                    <div key={layer}>
                      <p className="text-[10px] tracking-[0.3em] uppercase text-gold mb-2">
                        {layer}
                      </p>
                      <ul className="space-y-1">
                        {(product.notes?.[layer] || []).map(note => (
                          <li key={note} className="text-xs text-[var(--text-muted)]">
                            {note}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            <div className="mb-6">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-3">
                {sizeLabel}
              </p>

              <div className="flex gap-3 flex-wrap">
                {sortedVolumes.map(v => (
                  <button
                    key={v.ml}
                    onClick={() => setSelectedVolume(v)}
                    className={`flex-1 min-w-[80px] py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      selectedVolume?.ml === v.ml
                        ? 'bg-gold text-black shadow-[0_0_15px_rgba(201,168,76,0.25)]'
                        : 'glass glass-hover text-[var(--text-muted)] hover:text-[var(--text)]'
                    }`}
                  >
                    <span className="block text-lg font-bold">
                      {v.ml}{unitLabel}
                    </span>
                    <span className="text-xs">₹{v.price}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="text-xs tracking-[0.3em] uppercase text-[var(--text-muted)] mb-3">
                Quantity
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center glass rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 text-[var(--text-muted)] hover:text-gold transition-colors"
                  >
                    <Minus size={14} />
                  </button>

                  <span className="w-10 text-center font-semibold text-[var(--text)]">
                    {qty}
                  </span>

                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="px-4 py-3 text-[var(--text-muted)] hover:text-gold transition-colors"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <span className="text-2xl font-serif font-bold text-gold">
                  ₹{selectedVolume ? selectedVolume.price * qty : 0}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              {/* Customer Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-4 text-sm text-[var(--text)]"
                  />
                </div>

                <div className="relative">
                  <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gold" />
                  <input
                    type="tel"
                    placeholder="Phone Number *"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-4 text-sm text-[var(--text)]"
                  />
                </div>
              </div>

              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-4 text-gold" />
                <textarea
                  placeholder="Delivery Address *"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  rows={3}
                  className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl pl-11 pr-4 py-4 text-sm text-[var(--text)] resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || !selectedVolume}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gold hover:bg-gold-light disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all"
                >
                  <ShoppingBag size={18} />
                  {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>

                <button
                  onClick={() => setShowWhatsAppPopup(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#25D366] hover:bg-[#1fc255] text-white font-semibold rounded-xl transition-all"
                >
                  <MessageCircle size={18} />
                  Order on WhatsApp
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {related.length > 0 && (
          <div>
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-xs tracking-[0.4em] text-gold uppercase mb-2">
                You May Also Love
              </p>
              <h2 className="font-serif text-3xl font-bold text-[var(--text)]">
                Related Fragrances
              </h2>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={i * 0.08} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* WhatsApp Confirmation Popup */}
      {showWhatsAppPopup && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass rounded-3xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-[var(--text)]">
                Confirm Order
              </h3>
              <button
                onClick={() => setShowWhatsAppPopup(false)}
                className="text-[var(--text-muted)] hover:text-red-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-[var(--bg3)] rounded-xl p-3">
                <p className="text-[var(--text-muted)] text-xs">Product</p>
                <p className="text-[var(--text)] font-medium">{product.name} ({selectedVolume?.ml}ml)</p>
              </div>

              <div className="bg-[var(--bg3)] rounded-xl p-3">
                <p className="text-[var(--text-muted)] text-xs">Customer</p>
                <p className="text-[var(--text)] font-medium">{customerName}</p>
                <p className="text-[var(--text-muted)] text-xs">{customerPhone}</p>
              </div>

              <div className="bg-[var(--bg3)] rounded-xl p-3">
                <p className="text-[var(--text-muted)] text-xs">Address</p>
                <p className="text-[var(--text)] text-sm">{customerAddress}</p>
              </div>

              <div className="bg-[var(--bg3)] rounded-xl p-3">
                <p className="text-[var(--text-muted)] text-xs">Total</p>
                <p className="text-gold font-bold text-lg">₹{(selectedVolume?.price || 0) * qty}</p>
              </div>

              <button
                onClick={handleWhatsAppClick}
                disabled={isSubmitting}
                className="w-full bg-[#25D366] hover:bg-[#1fc255] text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={18} />
                {isSubmitting ? 'Sending...' : 'Send on WhatsApp'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}