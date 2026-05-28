// src/pages/Home.tsx
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Star, ChevronRight } from 'lucide-react';
import { collections } from '../data/products';
import { getProducts } from '../services/productService';
import type { Product } from '../services/productService';
import { testimonials } from '../data/testimonials';
import ProductCard from '../components/ProductCard';
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";


// Particle background canvas
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; opacity: number; pulse: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.3,
        opacity: Math.random() * 0.6 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    function draw() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${alpha})`;
        ctx.fill();
      });

      // Draw connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(201,168,76,${0.05 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

// Marquee Banner
function MarqueeBanner() {
  const text = 'SMELL EXPENSIVE. STAY WILD.  •  BUY 2 GET 10% OFF  •  FREE SHIPPING PAN INDIA  •  ';
  return (
    <div className="bg-gold py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span key={i} className="text-black text-xs font-bold tracking-[0.35em] uppercase mx-4">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

// Testimonials Carousel
function TestimonialsSection() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">Real Stories</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
            Voices of the Wild
          </h2>
        </motion.div>

        <div className="relative">
          {/* Large featured testimonial */}
          <motion.div
            key={active}
            className="glass rounded-3xl p-8 md:p-12 max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex justify-center mb-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={20} fill="#C9A84C" className="text-gold mx-0.5" />
              ))}
            </div>
            <p className="text-lg md:text-xl text-[var(--text)] font-serif italic leading-relaxed mb-8">
              "{testimonials[active].text}"
            </p>
            <div className="flex items-center justify-center gap-3">
              <img
                src={testimonials[active].photo}
                alt={testimonials[active].name}
                loading="lazy"
                className="w-12 h-12 rounded-full object-cover border-2 border-gold/30"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-[var(--text)]">{testimonials[active].name}</p>
                <p className="text-xs text-[var(--text-muted)]">{testimonials[active].location} — {testimonials[active].product}</p>
              </div>
            </div>
          </motion.div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === active ? 'w-6 h-2 bg-gold' : 'w-2 h-2 bg-[var(--text-muted)]'
                }`}
              />
            ))}
          </div>

          {/* Thumbnail row */}
          <div className="flex justify-center gap-3 mt-6 overflow-x-auto scrollbar-hide py-2">
            {testimonials.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActive(i)}
                className={`flex-shrink-0 transition-all duration-300 rounded-xl overflow-hidden ${
                  i === active ? 'ring-2 ring-gold scale-105' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={t.photo} alt={t.name} loading="lazy" className="w-12 h-12 object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Instagram Reels Section
function ReelsSection() {
  const reels = [
    {
      id: '1',
      link: 'https://www.instagram.com/reel/DTkujoeAmlT/',
      thumbnail:
        '/images/1reel.png',
      title: 'Wildcore Signature Reel',
    },
    {
      id: '2',
      link: 'https://www.instagram.com/reel/DP5oP8fguKm/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      thumbnail:
        '/images/2reel.png',
      title: 'Winter Wear',
    },
    {
      id: '3',
      link: 'https://www.instagram.com/reel/DR_hcQoiVU7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      thumbnail:
        '/images/3reel.png',
      title: 'For Her',
    },
    {
      id: '4',
      link: 'https://www.instagram.com/reel/DMSlaqpPRYE/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
      thumbnail:
        '/images/4reel.png',
      title: 'Compact Perfumes',
    },
  ];

  return (
    <section className="py-24 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <motion.div
          className="flex items-end justify-between mb-12"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-2">
              @wild_core_fragrances
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
              Follow The Wild
            </h2>
          </div>

          <a
            href="https://instagram.com/wild_core_fragrances"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors group"
          >
            Visit Instagram

            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </a>
        </motion.div>

        {/* Reels */}
        <div className="flex gap-5 overflow-x-auto scrollbar-hide pb-4">

          {reels.map((reel, i) => (
            <motion.a
              key={reel.id}
              href={reel.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 w-[220px] group"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[9/16] bg-[var(--bg3)] border border-white/5">

                {/* Image */}
                <img
                  src={reel.thumbnail}
                  alt={reel.title}
                  loading="eager"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-white/25">

                    <Play
                      size={20}
                      fill="white"
                      className="text-white ml-1"
                    />
                  </div>
                </div>

                {/* Bottom Text */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-sm text-white font-semibold leading-snug">
                    {reel.title}
                  </p>
                </div>

              </div>
            </motion.a>
          ))}

        </div>
      </div>
    </section>
  );
}

// Newsletter section
function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!email.trim()) return;

  try {
    await addDoc(collection(db, "newsletterSubscribers"), {
      email: email.trim().toLowerCase(),
      source: "home_newsletter",
      createdAt: serverTimestamp(),
    });

    setSubscribed(true);
    setEmail("");
  } catch (error) {
    console.error("Newsletter subscribe error:", error);
    alert("Something went wrong. Please try again.");
  }
};

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">Join the Tribe</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Stay Wild
          </h2>
          <p className="text-[var(--text-muted)] mb-8 leading-relaxed">
            Be first to know about new drops, exclusive offers, and scent stories that move you.
          </p>

          {subscribed ? (
            <motion.div
              className="glass rounded-2xl px-8 py-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <p className="text-gold font-serif text-xl">You're in the wild now.</p>
              <p className="text-[var(--text-muted)] text-sm mt-1">Check your inbox for a welcome gift.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3.5 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-gold hover:bg-gold-light text-black font-semibold text-sm rounded-xl transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
              >
                Subscribe
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts() {
      const data = await getProducts();
      setProducts(data);
    }

    loadProducts();
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const newArrivals = products.filter(p => p.newArrival).slice(0, 4);
  const bestsellers = products.filter(p => p.bestseller).slice(0, 4);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
  

{/* HERO SECTION - WITHOUT IMAGE */}
<section
  ref={heroRef}
  className="relative min-h-screen pt-32 md:pt-28 pb-20 flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-[#0d0d0d] to-[var(--bg)]"
>
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.12),transparent_55%)]" />

  <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto w-full">
    
    <p className="text-[8px] xs:text-[9px] sm:text-xs tracking-[0.2em] xs:tracking-[0.25em] sm:tracking-[0.45em] uppercase text-gold mb-4 sm:mb-5">
      Luxury Fragrances Crafted For The Untamed
    </p>

    {/* REMOVED THE hero.png IMAGE - No more OUD MIRAG photo */}
    
    <h1 className="font-serif leading-[1.1] tracking-tight mb-5 sm:mb-6">
      <span className="block text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-white">
        Wear
      </span>
      <span className="block text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-gold">
        The
      </span>
      <span className="block italic text-5xl xs:text-6xl sm:text-7xl md:text-8xl text-white">
        Wild
      </span>
    </h1>

    <p className="max-w-xl text-xs xs:text-sm sm:text-base md:text-lg text-white/60 leading-relaxed mb-8 sm:mb-10">
      Premium niche fragrances inspired by royalty,
      rebellion, ocean storms, and wild instinct.
    </p>

    <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center">
      <button
        onClick={() => navigate('/shop')}
        className="bg-gold hover:bg-[#d6b45c] text-black font-semibold px-6 xs:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 text-sm sm:text-base"
      >
        Shop Collection
      </button>
      <button
        onClick={() => {
          setTimeout(() => {
            document.getElementById('new-arrivals')?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            });
          }, 100);
        }}
        className="border border-gold/20 hover:border-gold/50 text-white px-6 xs:px-8 py-3 sm:py-4 rounded-2xl backdrop-blur-sm transition-all duration-300 text-sm sm:text-base"
      >
        New Arrivals
      </button>
    </div>

    <div className="mt-12 sm:mt-16 flex flex-col items-center gap-3 opacity-60">
      <div className="h-10 sm:h-12 w-[1px] bg-gold/40" />
      <span className="text-[8px] sm:text-[10px] tracking-[0.3em] sm:tracking-[0.4em] uppercase text-gold">
        Scroll
      </span>
    </div>
  </div>
</section>
      {/* Marquee */}
      <MarqueeBanner />

      {/* New Arrivals Section - First */}
      <section
        id="new-arrivals"
        className="py-24 px-4 sm:px-6 scroll-mt-28"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-xs tracking-[0.4em] text-gold uppercase mb-2">Fresh Drops</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
                New Arrivals
              </h2>
            </div>
            <Link
              to="/shop?sort=new"
              className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors group"
            >
              Shop All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers Section - Second */}
      <section className="py-24 px-4 sm:px-6 bg-[var(--bg2)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="flex items-end justify-between mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <p className="text-xs tracking-[0.4em] text-gold uppercase mb-2">Our Icons</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
                Bestsellers
              </h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:flex items-center gap-2 text-sm text-gold hover:text-gold-light transition-colors group"
            >
              Shop All <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {bestsellers.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Reels Section - Third */}
      <ReelsSection />

      {/* Collections Section - Fourth */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">Curated for You</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
              Collections
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {collections.map((col, i) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?collection=${col.id}`}
                  className="block group relative overflow-hidden rounded-3xl aspect-[4/5] bg-[var(--bg3)]"
                >
                  <img
                    src={col.image}
                    alt={col.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-xs tracking-[0.3em] text-gold uppercase mb-2">{col.count} Fragrances</p>
                    <h3 className="font-serif text-2xl font-bold text-white mb-2">{col.name}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{col.description}</p>
                    <div className="flex items-center gap-2 mt-4 text-gold text-sm font-medium group-hover:gap-3 transition-all">
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Fifth */}
      <div className="bg-[var(--bg2)]">
        <TestimonialsSection />
      </div>

      {/* B2B Section - Sixth */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass rounded-[2rem] p-8 md:p-14 overflow-hidden relative">
            <div className="absolute inset-0 opacity-10 bg-gradient-to-r from-gold to-transparent pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">
                  Wildcore B2B
                </p>

                <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] leading-tight mb-5">
                  Custom Fragrance Manufacturing
                </h2>

                <p className="text-[var(--text-muted)] leading-relaxed mb-8 max-w-xl">
                  Private-label perfumes, branded fragrance cards, and car hanging perfumes for clothing shops, detailing studios, and businesses.
                </p>

                <a
                  href="/custom-orders"
                  className="inline-flex items-center justify-center bg-gold text-black font-semibold px-6 py-3 rounded-xl hover:bg-gold-light transition-all"
                >
                  Explore B2B Services
                </a>
              </div>

<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
  <Link
    to="/b2b/clothing-shops"
    className="block rounded-2xl border border-gold/30 bg-black/20 p-6 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_25px_rgba(201,168,76,0.18)] transition-all duration-300 cursor-pointer group"
  >
    <h3 className="font-serif text-2xl text-[var(--text)] mb-4">
      Clothing Stores
    </h3>

    <ul className="space-y-2 text-sm text-[var(--text-muted)]">
      <li>• Branded fragrance cards</li>
      <li>• Customer giveaway perfumes</li>
      <li>• Luxury shop branding</li>
    </ul>

    <p className="mt-5 text-gold font-semibold text-sm">
      View Work <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
    </p>
  </Link>

  <Link
    to="/b2b/car-detailing"
    className="block rounded-2xl border border-gold/30 bg-black/20 p-6 hover:border-gold hover:bg-gold/10 hover:shadow-[0_0_25px_rgba(201,168,76,0.18)] transition-all duration-300 cursor-pointer group"
  >
    <h3 className="font-serif text-2xl text-[var(--text)] mb-4">
      Car Showrooms
    </h3>

    <ul className="space-y-2 text-sm text-[var(--text-muted)]">
      <li>• Car hanging perfumes</li>
      <li>• Showroom branding</li>
      <li>• Bulk fragrance supply</li>
    </ul>

    <p className="mt-5 text-gold font-semibold text-sm">
      View Work <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
    </p>
  </Link>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Story Section - Seventh */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">Our Story</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] mb-6 leading-tight">
  Built From
  <span className="gold-gradient block">Real Work.</span>
</h2>

<p className="text-[var(--text-muted)] leading-relaxed mb-4">
  We started with nothing but raw ingredients and curiosity.
</p>

<div className="space-y-2 mb-6">
  <p className="text-[var(--text-muted)] leading-relaxed flex items-start gap-2">
    <span className="text-amber-500 mt-1">✦</span>
    Handmade perfume experiments in a small studio
  </p>
  <p className="text-[var(--text-muted)] leading-relaxed flex items-start gap-2">
    <span className="text-amber-500 mt-1">✦</span>
    Custom fragrance cards for local stores and studios
  </p>
  <p className="text-[var(--text-muted)] leading-relaxed flex items-start gap-2">
    <span className="text-amber-500 mt-1">✦</span>
    Trust earned bottle by bottle — no shortcuts
  </p>
</div>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-gold hover:text-gold-light font-medium transition-colors group"
              >
                Read the full Story <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative rounded-3xl overflow-hidden aspect-[4/5]">
                <img
                  src="/images/bstory.png"
                  alt="Brand story"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 glass rounded-2xl p-5 max-w-[180px]">
                <p className="text-3xl font-serif font-bold text-gold">8000+</p>
                <p className="text-xs text-[var(--text-muted)] mt-1 leading-tight">custom fragrance cards shipped</p>
              </div>
              <div className="absolute -top-4 -right-4 glass rounded-2xl p-4">
                <div className="flex gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#C9A84C" className="text-gold" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-[var(--text)]">4.9 / 5.0</p>
                <p className="text-[10px] text-[var(--text-muted)]">900+ reviews</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - Eighth */}
      <div className="bg-[var(--bg2)]">
        <NewsletterSection />
      </div>
    </div>
  );
}