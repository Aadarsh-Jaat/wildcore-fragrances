import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shirt,
  Package,
  Sparkles,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

const WHATSAPP = "918295713252";

const clothingProjects = [
  {
    brand: "Trend Hut",
    type: "Men's Clothing Store",
    location: "Panipat, Haryana",

    images: [
      "/images/trendhut2.png",
      "/images/trendhut3.png",
      "/images/trendhut.png"
      
      
    ],

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

  {
    brand: "Sakhi Style",
    type: "Women's & Girls' Clothing Store",
    location: "Panipat, Haryana",

    images: [
      "/images/sakhistyle2.png",
      "/images/sakhistyle.png"
      
    ],

    description:
      "Custom fragrance gift cards created for Sakhi Style, a women's and girls' clothing store, designed as a stylish fragrance giveaway for their customers.",

    work: [
      "Custom fragrance card design",
      "Sakhi Style brand logo placement",
      "Store address and WhatsApp printing",
      "Feminine and elegant fragrance concept",
      "Multiple fragrance variants",
      "Branded customer giveaway card",
    ],
  },

  {
    brand: "2Brothers Clothing",
    type: "Men's Clothing Store",
    location: "Sonipat, Haryana",

    images: [
      "/images/2brothersclothing2.png",
    ],

    description:
      "Custom fragrance gift cards created for 2Brothers Clothing, combining their men's fashion identity with a premium branded fragrance giveaway.",

    work: [
      "Custom fragrance card design",
      "2Brothers Clothing logo placement",
      "Store contact details and WhatsApp printing",
      "Men's fragrance variants",
      "Fashion-focused branded giveaway concept",
      "Custom customer gifting solution",
    ],
  },

  {
    brand: "HR10 Fashion Shop",
    type: "Men's Clothing Store",
    location: "Sonipat, Haryana",

    images: [
      "/images/hr10fashionshop2.png",
    ],

    description:
      "Custom fragrance gift cards created for HR10 Fashion, designed to complement their men's fashion brand with a premium and memorable customer giveaway.",

    work: [
      "Custom fragrance card design",
      "HR10 Fashion brand logo placement",
      "Store address and WhatsApp printing",
      "Premium men's fragrance variants",
      "Branded customer giveaway card",
      "Fashion and fragrance concept integration",
    ],
  },

  {
    brand: "Balaji Collection",
    type: "Men's Clothing Store",
    location: "Panipat, Haryana",

    images: [
      "/images/balajicollection.png",
    ],

    description:
      "Custom fragrance gift cards created for Balaji Collection, giving their men's clothing customers a premium branded fragrance experience with every purchase.",

    work: [
      "Custom fragrance card design",
      "Balaji Collection logo placement",
      "Store address and WhatsApp printing",
      "Men's fragrance variants",
      "Branded customer giveaway concept",
      "Premium gifting experience for customers",
    ],
  },
];

/* -------------------------------------------------------
   IMAGE SLIDER
------------------------------------------------------- */
function ProjectImageSlider({
  images,
  brand,
}: {
  images: string[];
  brand: string;
}) {
  const [currentImage, setCurrentImage] = useState(0);

  const hasMultipleImages = images.length > 1;

  const nextImage = () => {
    if (!hasMultipleImages) return;

    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-80 overflow-hidden bg-black/20 group">

      {/* IMAGE */}
      <motion.img
        key={currentImage}
        src={images[currentImage]}
        alt={`${brand} fragrance project ${currentImage + 1}`}
        loading="lazy"
        decoding="async"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onClick={nextImage}
        className={`
          w-full h-full object-cover
          ${hasMultipleImages ? "cursor-pointer" : ""}
        `}
      />

      {hasMultipleImages && (
        <>
          {/* IMAGE NUMBER */}

          <div
            className="
              absolute top-3 right-3
              px-2.5 py-1
              rounded-full
              bg-black/55
              backdrop-blur-md
              border border-white/10
              text-white
              text-[11px]
              font-medium
            "
          >
            {currentImage + 1} / {images.length}
          </div>

          {/* SMALL DOT NAVIGATION */}

          <div
            className="
              absolute bottom-3 left-1/2
              -translate-x-1/2
              flex items-center gap-1.5
              px-2.5 py-1.5
              rounded-full
              bg-black/55
              backdrop-blur-md
              border border-white/10
            "
          >
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImage(index);
                }}
                aria-label={`View image ${index + 1}`}
                className={`
                  transition-all duration-300
                  rounded-full
                  ${
                    index === currentImage
                      ? "w-4 h-1.5 bg-white"
                      : "w-1.5 h-1.5 bg-white/45 hover:bg-white/80"
                  }
                `}
              />
            ))}
          </div>

          {/* TINY NEXT BUTTON */}

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            aria-label="Next image"
            className="
              absolute
              bottom-3
              right-3
              w-8
              h-8
              rounded-full
              bg-black/60
              backdrop-blur-md
              border border-white/15
              text-white
              flex
              items-center
              justify-center
              transition-all
              duration-200
              hover:bg-black/80
              hover:scale-105
            "
          >
            <ChevronRight size={16} strokeWidth={2} />
          </button>
        </>
      )}
    </div>
  );
}
/* -------------------------------------------------------
   MAIN PAGE
------------------------------------------------------- */

export default function ClothingShops() {
  const msg =
    "Hi Wildcore Fragrances! I want custom fragrance branding for my clothing store.";

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* BACK BUTTON */}

        <Link
          to="/custom-orders"
          className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors"
        >
          <ArrowLeft size={15} className="inline mr-2" />
          Back to B2B
        </Link>

        {/* ------------------------------------------------
            PROJECTS
        ------------------------------------------------ */}

        <section className="mb-16 mt-8">

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

          {/* PROJECT GRID */}

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

                {/* SLIDER */}

                <ProjectImageSlider
                  images={project.images}
                  brand={project.brand}
                />

                {/* PROJECT DETAILS */}

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

        {/* ------------------------------------------------
            HERO
        ------------------------------------------------ */}

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

        {/* ------------------------------------------------
            FEATURES
        ------------------------------------------------ */}

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

        {/* ------------------------------------------------
            WHAT WE MAKE
        ------------------------------------------------ */}

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

        {/* ------------------------------------------------
            WHATSAPP CTA
        ------------------------------------------------ */}

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