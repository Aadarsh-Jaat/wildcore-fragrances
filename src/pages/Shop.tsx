import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';
import type { Product } from '../services/productService';

const CATEGORIES = ['Woody', 'Floral', 'Oud', 'Fresh', 'Oriental', 'Unisex', 'Luxury'] as const;
type Category = (typeof CATEGORIES)[number];
type SortOption = 'new' | 'price-asc' | 'price-desc' | 'bestseller' | 'rating';

function getLowestPrice(product: Product) {
  return product.volumes?.[0]?.price || 0;
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') as Category | null;
  const initialSort = (searchParams.get('sort') as SortOption) || 'new';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategories, setActiveCategories] = useState<Category[]>(
    initialCat ? [initialCat] : []
  );
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const toggleCategory = (cat: Category) => {
    setActiveCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const filtered = useMemo(() => {
    let list = [...products];

    if (activeCategories.length > 0) {
      list = list.filter(p => activeCategories.includes(p.category as Category));
    }

    switch (sort) {
      case 'new':
        list.sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0));
        break;
      case 'price-asc':
        list.sort((a, b) => getLowestPrice(a) - getLowestPrice(b));
        break;
      case 'price-desc':
        list.sort((a, b) => getLowestPrice(b) - getLowestPrice(a));
        break;
      case 'bestseller':
        list.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
    }

    return list;
  }, [products, activeCategories, sort]);

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">Our Catalogue</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[var(--text)]">
            Shop All
          </h1>
          <p className="text-[var(--text-muted)] mt-3 text-sm">
            {loading ? 'Loading fragrances...' : `${filtered.length} fragrance${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-4 mb-8 sticky top-20 z-20 py-3 bg-[var(--bg)] border-b border-[var(--border)]">
          <div className="hidden md:flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveCategories([])}
              className={`text-xs px-4 py-2 rounded-lg font-medium tracking-wide transition-all ${
                activeCategories.length === 0
                  ? 'bg-gold text-black'
                  : 'glass glass-hover text-[var(--text-muted)] hover:text-[var(--text)]'
              }`}
            >
              All
            </button>

            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`text-xs px-4 py-2 rounded-lg font-medium tracking-wide transition-all ${
                  activeCategories.includes(cat)
                    ? 'bg-gold text-black'
                    : 'glass glass-hover text-[var(--text-muted)] hover:text-[var(--text)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            className="md:hidden flex items-center gap-2 text-sm text-[var(--text)] glass px-4 py-2 rounded-lg"
            onClick={() => setFiltersOpen(o => !o)}
          >
            <SlidersHorizontal size={15} />
            Filters {activeCategories.length > 0 && `(${activeCategories.length})`}
          </button>

          <select
            value={sort}
            onChange={e => setSort(e.target.value as SortOption)}
            className="text-xs bg-[var(--bg3)] border border-[var(--border)] text-[var(--text)] rounded-lg px-3 py-2 focus:outline-none focus:border-gold cursor-pointer"
          >
            <option value="new">New Arrivals</option>
            <option value="bestseller">Bestsellers</option>
            <option value="rating">Top Rated</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {filtersOpen && (
          <motion.div
            className="md:hidden glass rounded-2xl p-4 mb-6"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                Filter by Category
              </p>
              <button onClick={() => setFiltersOpen(false)}>
                <X size={16} className="text-[var(--text-muted)]" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategories([])}
                className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                  activeCategories.length === 0
                    ? 'bg-gold text-black'
                    : 'glass glass-hover text-[var(--text-muted)]'
                }`}
              >
                All
              </button>

              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => toggleCategory(cat)}
                  className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                    activeCategories.includes(cat)
                      ? 'bg-gold text-black'
                      : 'glass glass-hover text-[var(--text-muted)]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {activeCategories.length > 0 && (
          <div className="flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs text-[var(--text-muted)]">Filtering by:</span>

            {activeCategories.map(cat => (
              <span
                key={cat}
                className="flex items-center gap-1.5 text-xs bg-gold/15 text-gold border border-gold/30 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-gold/25 transition-colors"
                onClick={() => toggleCategory(cat)}
              >
                {cat} <X size={11} />
              </span>
            ))}

            <button
              onClick={() => setActiveCategories([])}
              className="text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors underline"
            >
              Clear all
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-24">
            <p className="text-[var(--text-muted)] text-lg font-serif italic">
              Loading fragrances...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[var(--text-muted)] text-lg font-serif italic">
              No fragrances found in this category.
            </p>
            <button
              onClick={() => setActiveCategories([])}
              className="mt-4 text-gold text-sm hover:text-gold-light transition-colors"
            >
              View all fragrances
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 0.05} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}