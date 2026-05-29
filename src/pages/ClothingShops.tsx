import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Shirt, Package, Sparkles, MessageCircle } from "lucide-react";

const WHATSAPP = "917056713252";

const clothingProjects = [
  {
    brand: "Trend Hut",
    type: "Men's Clothing Store",
    location: "Panipat, Haryana",
    image: "/images/trendhut.png",
    description:
      "Custom fragrance gift cards created for Trend Hut Men's Clothing with four scent moods — Titan, Apex, Viron, and Zuno.",
    work: [
      "Custom fragrance card design",
      "Brand logo placement",
      "Store address and WhatsApp printing",
      "Multiple scent variants",
      "Luxury giveaway card concept",
    ],
  },
];

export default function ClothingShops() {
  const msg =
    "Hi Wildcore Fragrances! I want custom fragrance branding for my clothing store.";

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <Link
          to="/custom-orders"
          className="text-sm text-[var(--text-muted)] hover:text-gold"
        >
          <ArrowLeft size={15} className="inline mr-2" />
          Back to B2B
        </Link>

            <section className="mb-16">
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">
              Our Work
            </p>

            <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
              Clothing Brand Projects
            </h2>

            <p className="text-[var(--text-muted)] mt-4 max-w-2xl mx-auto">
              A showcase of custom fragrance branding created by Wildcore for
              clothing stores and fashion brands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clothingProjects.map((project, i) => (
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
                  className="w-full h-80 object-cover"
                />

                <div className="p-8">
                  <p className="text-xs tracking-[0.3em] text-gold uppercase mb-3">
                    {project.type}
                  </p>

                  <h3 className="font-serif text-3xl font-bold text-[var(--text)] mb-2">
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
            Custom Work For Clothing Brands
          </p>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[var(--text)] mb-5">
            Fragrance Branding For Fashion Stores
          </h1>

          <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
            Wildcore creates custom perfume cards, branded giveaways, and
            signature scents for clothing shops, fashion labels, and boutique
            stores.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Shirt,
              title: "Custom Brand Cards",
              text: "Add your clothing store logo, offer, QR code, and signature scent on premium fragrance cards.",
            },
            {
              icon: Package,
              title: "Order Giveaways",
              text: "Give every customer a scented card with their clothing order to increase brand recall.",
            },
            {
              icon: Sparkles,
              title: "Luxury Experience",
              text: "Make your packaging feel premium, memorable, and different from regular clothing stores.",
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

        

        <div className="glass rounded-3xl p-8 md:p-12 mb-16">
          <h2 className="font-serif text-4xl font-bold text-[var(--text)] mb-6">
            What We Can Make For Clothing Stores
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm text-[var(--text-muted)]">
            <p>• Branded perfume sample cards</p>
            <p>• Custom scent names for your store</p>
            <p>• QR code cards linking to Instagram/website</p>
            <p>• Customer giveaway perfume cards</p>
            <p>• Premium packaging inserts</p>
            <p>• Bulk fragrance card manufacturing</p>
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-serif text-4xl font-bold text-[var(--text)] mb-4">
            Want Wildcore for your clothing brand?
          </h2>

          <p className="text-[var(--text-muted)] mb-8">
            Tell us your store name, quantity, logo idea, and scent preference.
          </p>

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