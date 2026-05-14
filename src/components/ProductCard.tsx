import { Link } from 'react-router-dom';
import Tilt from 'react-parallax-tilt';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Star } from 'lucide-react';
import type { Product } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

interface Props {
  product: Product;
  delay?: number;
}

export default function ProductCard({ product, delay = 0 }: Props) {
  const { addItem } = useCart();
  const { addToast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();const selectedVolume = product.volumes?.[1] || product.volumes?.[0];

if (!selectedVolume) return;

addItem({
  id: product.id,
  name: product.name,
  price: selectedVolume.price,
  image: product.image,
  volume: selectedVolume.ml,
  quantity: 1,
});
    addToast(`${product.name} added to cart`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      <Tilt
        tiltMaxAngleX={8}
        tiltMaxAngleY={8}
        glareEnable
        glareMaxOpacity={0.08}
        glareColor="#C9A84C"
        glarePosition="all"
        glareBorderRadius="16px"
        className="rounded-2xl"
      >
        <Link to={`/product/${product.id}`} className="block group">
          <div className="glass glass-hover rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(201,168,76,0.12)]">
            {/* Image */}
            <div className="relative overflow-hidden aspect-[3/4] bg-[var(--bg3)]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                style={{ transform: 'scale(1)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                {product.bestseller && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase bg-gold text-black px-2 py-0.5 rounded-md">
                    Bestseller
                  </span>
                )}
                {product.newArrival && (
                  <span className="text-[10px] font-semibold tracking-wider uppercase glass text-gold px-2 py-0.5 rounded-md border border-gold/40">
                    New
                  </span>
                )}
              </div>

              {/* Hover actions */}
              <div className="absolute bottom-3 left-3 right-3 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 glass text-[var(--text)] hover:text-gold text-xs font-medium py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors hover:border-gold/50"
                >
                  <ShoppingBag size={13} />
                  Add to Cart
                </button>
                <Link
                  to={`/product/${product.id}`}
                  className="w-10 glass text-[var(--text-muted)] hover:text-gold rounded-xl flex items-center justify-center transition-colors hover:border-gold/50"
                  onClick={e => e.stopPropagation()}
                >
                  <Eye size={15} />
                </Link>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[var(--text-muted)] mb-1">
                {product.category}
              </p>
              <h3 className="font-serif text-base font-semibold text-[var(--text)] group-hover:text-gold transition-colors leading-snug">
                {product.name}
              </h3>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-relaxed line-clamp-1">
                {product.tagline}
              </p>
              <div className="flex items-center justify-between mt-3">
                <span className="font-semibold text-gold text-sm">
                  From ₹{product.volumes?.[0]?.price || 0}
                </span>
                <div className="flex items-center gap-1">
                  <Star size={11} fill="#C9A84C" className="text-gold" />
                  <span className="text-xs text-[var(--text-muted)]">{product.rating}</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </Tilt>
    </motion.div>
  );
}
