import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Car,
  Sparkles,
  Package,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const WHATSAPP = "918295713252";

const detailingProjects = [
  {
    brand: "Crystal Auto Studio",
    type: "Car Detailing Studio",
    location: "Industrial Area, Panipat",
    images: [
      "/images/crystalautostudio.png",
      "/images/crystalautostudio2.png",
    ],
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
    images: [
      "/images/sahilautoaccessories.png",
      "/images/sahilautoaccessories2.png",
    ],
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
    images: [
      "/images/detailingkorner.png",
      "/images/detailingkorner2.png",
    ],
    description:
      "Premium showroom fragrance branding made for customer giveaway and car delivery experience.",
    work: [
      "Showroom branding",
      "Custom scent selection",
      "Premium hanging cards",
      "Customer giveaway perfumes",
    ],
  },

  {
    brand: "Magic Car Wash",
    type: "Car Wash & Detailing Studio",
    location: "Sonipat, Haryana",
    images: [
      "/images/magiccarwash2copy.jpg",
      "/images/magiccarwash1.png",
    ],
    description:
      "Custom fragrance branding for a premium car wash studio to enhance customer experience.",
    work: [
      "Custom car hanging perfumes",
      "Studio branding with scent",
      "Customer giveaway fragrance cards",
      "Bulk supply for car wash customers",
    ],
  },
];

/* =========================================================
   IMAGE CAROUSEL
   Same style/size as the Clothing Brands project cards
   ========================================================= */

const ImageCarousel = ({
  images,
  brand,
}: {
  images: string[];
  brand: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  const timerRef = useRef<number | null>(null);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + images.length) % images.length
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  /* Auto slide */
  useEffect(() => {
    if (images.length <= 1) return;

    if (isHovering) {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }

      return;
    }

    timerRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current);
      }
    };
  }, [isHovering, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-80 bg-[var(--bg3)] flex items-center justify-center text-[var(--text-muted)]">
        No image
      </div>
    );
  }

  return (
    <div
      className="relative w-full h-80 overflow-hidden bg-[var(--bg3)] rounded-t-3xl group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={`${brand} - ${currentIndex + 1}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{
            opacity: 0,
            scale: 1.03,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 0.99,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />
      </AnimatePresence>

      {/* Dark gradient for controls */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/30 via-transparent to-black/20" />

      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        </div>
      )}

      {/* LEFT ARROW */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Previous image"
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            z-20
            w-9
            h-9
            rounded-full
            bg-black/55
            backdrop-blur-md
            border
            border-white/15
            text-white
            flex
            items-center
            justify-center
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
            hover:bg-black/75
            hover:scale-105
          "
        >
          <ChevronLeft size={17} />
        </button>
      )}

      {/* RIGHT ARROW */}
      {images.length > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Next image"
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            z-20
            w-9
            h-9
            rounded-full
            bg-black/55
            backdrop-blur-md
            border
            border-white/15
            text-white
            flex
            items-center
            justify-center
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
            hover:bg-black/75
            hover:scale-105
          "
        >
          <ChevronRight size={17} />
        </button>
      )}

      {/* DOTS */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                goToSlide(index);
              }}
              aria-label={`Go to image ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  index === currentIndex
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/60 hover:bg-white/90"
                }
              `}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function CarDetailing() {
  const msg =
    "Hi Wildcore Fragrances! I want custom car hanging perfumes for my detailing studio / accessories shop.";

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-28 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">

        {/* Back */}
        <Link
          to="/custom-orders"
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            text-[var(--text-muted)]
            hover:text-gold
            transition-colors
            mb-10
          "
        >
          <ArrowLeft size={15} />
          Back to B2B
        </Link>

        {/* PAGE HEADER */}
        <motion.section
          className="text-center mb-10"
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
          }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">
            Our Work
          </p>

          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)]">
            Car Business Projects
          </h1>

          <p className="text-[var(--text-muted)] mt-4 max-w-2xl mx-auto">
            A showcase of custom fragrance branding created by Wildcore for
            car detailing studios, accessories shops, car washes, and
            automotive businesses.
          </p>
        </motion.section>

        {/* =================================================
            PROJECT CARDS
            2 COLUMNS — SAME FEEL AS CLOTHING PAGE
           ================================================= */}

        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {detailingProjects.map((project, i) => (
              <motion.div
                key={project.brand}
                className="
                  glass
                  glass-hover
                  rounded-3xl
                  overflow-hidden
                  flex
                  flex-col
                "
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.5,
                }}
                viewport={{
                  once: true,
                }}
              >
                {/* SLIDING IMAGE */}
                <ImageCarousel
                  images={project.images}
                  brand={project.brand}
                />

                {/* CONTENT */}
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
                      <li
                        key={item}
                        className="flex items-start gap-2"
                      >
                        <span className="text-gold">
                          •
                        </span>

                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* =================================================
            WHAT WE OFFER
           ================================================= */}

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
              className="
                glass
                glass-hover
                rounded-3xl
                p-8
                text-center
              "
              initial={{
                opacity: 0,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: i * 0.1,
              }}
              viewport={{
                once: true,
              }}
            >
              <div
                className="
                  h-14
                  w-14
                  rounded-xl
                  bg-gold/10
                  text-gold
                  flex
                  items-center
                  justify-center
                  mx-auto
                  mb-5
                "
              >
                <item.icon size={26} />
              </div>

              <h3 className="font-serif text-xl font-bold text-[var(--text)] mb-3">
                {item.title}
              </h3>

              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>

        {/* =================================================
            CTA
           ================================================= */}

        <motion.div
          className="text-center"
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">
            Custom Work For Automotive Businesses
          </p>

          <h2 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Want Custom Car Perfumes?
          </h2>

          <p className="text-[var(--text-muted)] max-w-2xl mx-auto mb-8">
            Tell us your business name, quantity, logo idea, and preferred
            fragrance. We'll create a custom fragrance solution for your
            customers.
          </p>

          <a
            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              px-8
              py-4
              bg-green-500
              text-white
              font-semibold
              rounded-xl
              hover:bg-green-400
              transition-all
              shadow-lg
              shadow-green-500/20
            "
          >
            <MessageCircle size={18} />
            Enquire on WhatsApp
          </a>
        </motion.div>

      </div>
    </div>
  );
}