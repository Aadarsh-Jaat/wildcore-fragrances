
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

function ParallaxImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <div ref={ref} className={`overflow-hidden rounded-3xl ${className}`}>
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover scale-110"
        style={{ y }}
      />
    </div>
  );
}

const values = [
  { number: '01', title: 'Rare Ingredients', desc: 'We source only the finest raw materials from their native origins — Laotian oud, Moroccan rose, Madagascan vanilla.' },
  { number: '02', title: 'Master Craftsmanship', desc: 'Each fragrance is composed by master perfumers with decades of experience in the art of fine perfumery.' },
  { number: '03', title: 'Sustainable Ethics', desc: 'Wild doesn\'t mean reckless. We partner with fair-trade suppliers and invest in regenerative harvesting practices.' },
  { number: '04', title: 'No Compromise', desc: 'We never dilute, never cut corners, and never sacrifice quality for cost. Every bottle is 100% our standard or nothing.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[70vh] flex items-center">
        <div className="absolute inset-0">
  <img
    src="/images/AboutBan.png"
    alt="About hero"
    loading="eager"
    className="w-full h-full object-cover brightness-125 contrast-110 saturate-110"
  />

  <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-black/40" />
</div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-xl"
          >
            <p className="text-xs tracking-[0.5em] text-gold uppercase mb-5">Est. 2017</p>
            <h1 className="font-serif text-6xl md:text-8xl font-black text-white leading-none mb-6">
              Born<br />
              <span className="gold-gradient italic">Wild.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed">
              We didn't start a perfume brand. We started a movement. A declaration that scent can be art, rebellion, and identity all at once.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-[0.4em] text-gold uppercase mb-5">OUR JOURNEY</p>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] mb-6 leading-tight">
                From experiments to experiences.
              </h2>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                Wildcore Fragrances started with a simple idea — to create scents that feel personal, bold, and memorable.

What began as small experiments with solid perfumes slowly grew into a fragrance brand built around identity, creativity, and trust.

Today, Wildcore creates luxury-inspired perfumes, fragrance cards, and custom branded scent experiences for individuals, clothing stores, car detailing studios, and modern lifestyle businesses.

Every product is made with attention to scent, presentation, and the feeling it leaves behind — because fragrance is not just something you wear, it is something people remember you by.
              </p>
              
            </motion.div>

            <ParallaxImage
              src="/images/About2.jpeg"
              alt="Brand story"
              className="aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 sm:px-6 bg-[var(--bg2)]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">What We Stand For</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">Our Principles</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.number}
                className="glass glass-hover rounded-2xl p-8"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <p className="font-serif text-5xl font-black text-gold/20 mb-4">{v.number}</p>
                <h3 className="font-serif text-xl font-bold text-[var(--text)] mb-3">{v.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Note */}
      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <ParallaxImage
              src="/images/rebelian.jpg"
              alt="Founder"
              className="aspect-[3/4]"
            />

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs tracking-[0.4em] text-gold uppercase mb-5">A Note From the Foundes</p>
              <blockquote className="font-serif text-2xl md:text-3xl italic text-[var(--text)] leading-relaxed mb-8">
                "We didn't start Wildcore to build a brand. We started it because we couldn't find a fragrance that felt like us."
              </blockquote>
              <p className="text-[var(--text-muted)] leading-relaxed mb-4">
                — Aadarsh & Mohit , Co-Founder & Chief Perfumer
              </p>
              <p className="text-[var(--text-muted)] leading-relaxed text-sm">
                We're two guys who started with solid perfumes, zero experience, and one rule — never make something we wouldn't wear ourselves. A year later, we're still those same two people. Just with better scents.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-4 sm:px-6 bg-[var(--bg2)]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { num: '1+', label: 'Years of Craft' },
              { num: '20+', label: 'Cities Served' },
              { num: '900+', label: 'Five-Star Reviews' },
              { num: '12', label: 'Signature Scents' },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-serif text-5xl font-black gold-gradient mb-2">{s.num}</p>
                <p className="text-xs tracking-[0.2em] text-[var(--text-muted)] uppercase">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Ready to wear the wild?
          </h2>
          <p className="text-[var(--text-muted)] mb-8">
            Explore our full collection and find your signature scent.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-black font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.35)]"
          >
            Shop Now <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
