import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Car, Sparkles, Package, MessageCircle } from "lucide-react";

const WHATSAPP = "917056713252";

const detailingProjects = [
  {
    brand: "Crystal Auto Studio",
    type: "Car Detailing Studio",
    location: "Industrial Area, Panipat",
    image: "/images/crystalautostudio.png",
    description:
      "Custom car hanging fragrance cards created for premium car detailing customers.",
    work: [
      "Custom car perfume card design",
      "Studio logo placement",
      "Car hanging fragrance concept",
      "Bulk supply",
    ],
  },
  {
    brand: "Sahil Auto Accessories",
    type: "Car Accessories Store",
    location: "Model Town, Panipat",
    image: "/images/sahilautoaccessories.png",
    description:
      "Custom fragrance cards made for a car accessories shop to improve product experience and branding.",
    work: [
      "Shop branding",
      "Car fragrance cards",
      "Logo and contact printing",
      "Bulk manufacturing",
    ],
  },
  {
    brand: "Detailing Korner",
    type: "Car Detailing Studio",
    location: "Sec 13-17, Panipat",
    image: "/images/detailingkorner.png",
    description:
      "Premium showroom fragrance branding made for customer giveaway and car delivery experience.",
    work: [
      "Showroom branding",
      "Custom scent selection",
      "Premium hanging cards",
      "Customer giveaway perfumes",
    ],
  },
  
];

export default function CarDetailing() {
  const msg =
    "Hi Wildcore Fragrances! I want custom car hanging perfumes for my detailing studio / accessories shop.";

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/custom-orders" className="text-sm text-[var(--text-muted)] hover:text-gold">
          <ArrowLeft size={15} className="inline mr-2" />
          Back to B2B
        </Link>
        <section className="mb-16">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">
              Our Work
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
              Car Business Projects
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {detailingProjects.map((project, i) => (
              <motion.div
                key={project.brand}
                className="glass glass-hover rounded-3xl overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={project.image}
                  alt={project.brand}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-72 object-cover"
                />

                <div className="p-7">
                  <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
                    {project.type}
                  </p>

                  <h3 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">
                    {project.brand}
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] mb-4">
                    {project.location}
                  </p>

                  <p className="text-[var(--text-muted)] leading-relaxed mb-5">
                    {project.description}
                  </p>

                  <ul className="space-y-2 text-sm text-[var(--text-muted)]">
                    {project.work.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <motion.div
          className="text-center mt-10 mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">
            Custom Work For Car Businesses
          </p>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[var(--text)] mb-5">
            Car Fragrance Branding
          </h1>

          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
            Wildcore creates custom hanging perfumes and fragrance cards for
            car detailing studios, showrooms, and accessories shops.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Car,
              title: "Car Hanging Perfumes",
              text: "Premium hanging fragrance cards for cars with your business branding.",
            },
            {
              icon: Sparkles,
              title: "Showroom Experience",
              text: "Make every delivery feel premium with a custom scent experience.",
            },
            {
              icon: Package,
              title: "Bulk Supply",
              text: "Custom printed fragrance cards available for repeated business use.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="glass glass-hover rounded-3xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="h-14 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-6">
                <item.icon size={26} />
              </div>

              <h3 className="font-serif text-2xl font-bold text-[var(--text)] mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        

        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-[var(--text)] mb-4">
            Want custom car perfumes for your business?
          </h2>

          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-400 transition-all"
          >
            <MessageCircle size={18} />
            Enquire on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}