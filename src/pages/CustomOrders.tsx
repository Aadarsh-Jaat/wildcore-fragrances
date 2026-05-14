
import { addB2BInquiry } from '../services/b2bService';
import { motion } from 'framer-motion';
import { Shirt, Car } from 'lucide-react';

export default function CustomOrders() {
  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* HERO */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">
            B2B Custom Manufacturing
          </p>

          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[var(--text)] mb-6">
            Custom Fragrance Solutions
          </h1>

          <p className="text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Wildcore creates private-label perfumes, fragrance cards,
            and branded car hanging perfumes for businesses.
          </p>
        </motion.div>

        {/* SERVICES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Clothing */}
          <motion.div
            className="glass glass-hover rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mb-6">
              <Shirt className="text-gold" size={28} />
            </div>

            <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">
              Clothing Shops
            </h2>

            <p className="text-[var(--text-muted)] leading-relaxed mb-5">
              Custom fragrance cards and branded perfumes for fashion stores.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>• Shop branding on cards</li>
              <li>• Customer giveaway perfumes</li>
              <li>• Bulk manufacturing</li>
              <li>• Luxury fragrance experience</li>
            </ul>
          </motion.div>

          {/* Car */}
          <motion.div
            className="glass glass-hover rounded-3xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-14 h-14 rounded-2xl bg-gold/15 flex items-center justify-center mb-6">
              <Car className="text-gold" size={28} />
            </div>

            <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">
              Car Detailing Showrooms
            </h2>

            <p className="text-[var(--text-muted)] leading-relaxed mb-5">
              Premium car hanging fragrance cards with your showroom branding.
            </p>

            <ul className="space-y-2 text-sm text-[var(--text-muted)]">
              <li>• Car hanging perfumes</li>
              <li>• Showroom branding</li>
              <li>• Bulk supply</li>
              <li>• Long-lasting fragrance</li>
            </ul>
          </motion.div>

        </div>
<div className="mt-16 glass rounded-3xl p-8">
  <h2 className="font-serif text-3xl font-bold text-[var(--text)] mb-4">
    Request Custom Branding
  </h2>

  <p className="text-[var(--text-muted)] mb-6">
    Fill your requirement and send it directly to Wildcore on WhatsApp.
  </p>

  <form
onSubmit={async (e) => {
  e.preventDefault();

  const formData = new FormData(e.currentTarget);

  const inquiry = {
    businessName: String(formData.get('businessName') || ''),
    businessType: String(formData.get('businessType') || ''),
    phone: String(formData.get('phone') || ''),
    city: String(formData.get('city') || ''),
    quantity: String(formData.get('quantity') || ''),
    brandName: String(formData.get('brandName') || ''),
    message: String(formData.get('message') || ''),
  };

  await addB2BInquiry(inquiry);

  const msg = `Hi Wildcore Fragrances,

I want custom B2B fragrance manufacturing.

Business Name: ${inquiry.businessName}
Business Type: ${inquiry.businessType}
Phone: ${inquiry.phone}
City: ${inquiry.city}
Quantity Required: ${inquiry.quantity}
Brand Name to Print: ${inquiry.brandName}

Requirement:
${inquiry.message}`;

  window.open(
    `https://wa.me/917056713252?text=${encodeURIComponent(msg)}`,
    '_blank'
  );

  e.currentTarget.reset();
}}
    className="space-y-5"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <input name="businessName" required placeholder="Business Name" className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]" />

      <select name="businessType" className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]">
        <option>Clothing Shop</option>
        <option>Car Detailing Showroom</option>
        <option>Car Accessories Shop</option>
        <option>Other Business</option>
      </select>

      <input name="phone" required placeholder="Phone Number" className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]" />

      <input name="city" placeholder="City" className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]" />

      <input name="quantity" placeholder="Required Quantity" className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]" />

      <input name="brandName" placeholder="Brand / Shop Name to Print" className="bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]" />
    </div>

    <textarea
      name="message"
      rows={5}
      placeholder="Tell us your requirement..."
      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] resize-none"
    />

    <button
      type="submit"
      className="w-full bg-gold hover:bg-gold-light text-black font-semibold py-4 rounded-xl transition-all"
    >
      Send Inquiry on WhatsApp
    </button>
  </form>
</div>
      </div>
    </div>
  );
}