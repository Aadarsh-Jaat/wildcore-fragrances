import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Instagram, Mail, MapPin, Phone, Send, CheckCircle } from 'lucide-react';

const WHATSAPP = '918295713252';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    setSending(true);
    const msg = `Hi Wildcore Fragrances!\n\nName: ${form.name}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`;
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, '_blank');
    setSending(false);
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-4">Let's Talk</p>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-[var(--text)] mb-4">
            Get in Touch
          </h1>
          <p className="text-[var(--text-muted)] max-w-md mx-auto">
            Questions, wholesale inquiries, or just want to talk fragrance? We're here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact form */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="glass rounded-3xl p-8">
              {sent ? (
                <motion.div
                  className="text-center py-12"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={56} className="text-gold mx-auto mb-5" />
                  <h3 className="font-serif text-2xl font-bold text-[var(--text)] mb-2">Message Sent!</h3>
                  <p className="text-[var(--text-muted)] text-sm">We'll get back to you within 24 hours.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-6 text-gold text-sm hover:text-gold-light transition-colors"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        required
                        placeholder="Your name"
                        className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        required
                        placeholder="your@email.com"
                        className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      required
                      placeholder="How can we help?"
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors"
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] mb-1.5 block">Message</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      required
                      rows={5}
                      placeholder="Tell us more..."
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:border-gold transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-gold hover:bg-gold-light disabled:opacity-60 text-black font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(201,168,76,0.3)]"
                  >
                    {sending ? 'Sending...' : <><Send size={16} /> Send Message</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 glass glass-hover rounded-2xl p-5 group transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.12)]"
            >
              <div className="w-10 h-10 bg-[#25D366]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-[#25D366]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[#25D366] transition-colors">Chat on WhatsApp</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Quick replies, usually within an hour</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/wild_core_fragrances"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 glass glass-hover rounded-2xl p-5 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[#f58529]/15 to-[#dd2a7b]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                <Instagram size={20} className="text-[#dd2a7b]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] group-hover:text-gold transition-colors">@wildcorefragrances</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Follow us for drops and inspiration</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@wildcorefragrances.com"
              className="flex items-start gap-4 glass glass-hover rounded-2xl p-5 group"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <Mail size={20} className="text-gold" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)] group-hover:text-gold transition-colors">hello@wildcorefragrances.com</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">We respond within 24 hours</p>
              </div>
            </a>

            {/* Phone */}
            <div className="flex items-start gap-4 glass rounded-2xl p-5">
              <div className="w-10 h-10 bg-[var(--bg3)] rounded-xl flex items-center justify-center flex-shrink-0">
                <Phone size={20} className="text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">+918295713252</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Sun – Thu, 9am – 6pm GST</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-4 glass rounded-2xl p-5">
              <div className="w-10 h-10 bg-[var(--bg3)] rounded-xl flex items-center justify-center flex-shrink-0">
                <MapPin size={20} className="text-[var(--text-muted)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[var(--text)]">Panipat, India</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Worldwide shipping available</p>
              </div>
            </div>

            {/* Direct WhatsApp CTA */}
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Wildcore! I'd like to know more about your fragrances.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-4 bg-[#25D366] hover:bg-[#1fc255] text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] mt-2"
            >
              <MessageCircle size={18} />
              Start WhatsApp Chat
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
