import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Instagram, 
  Mail, 
  MapPin, 
  Phone, 
  Send, 
  CheckCircle,
  User,
  Edit3
} from 'lucide-react';

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
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs tracking-[0.4em] text-gold uppercase mb-3">Let's Talk</p>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-[var(--text)] mb-4">
            Get in Touch
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto text-sm md:text-base">
            Questions, wholesale inquiries, or just want to talk fragrance? We're here.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT: Contact Info - 2 columns out of 5 */}
          <motion.div
            className="lg:col-span-2 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP}`}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] block overflow-hidden"
            >
              <div className="w-11 h-11 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-muted)]">Chat on</p>
                <p className="font-semibold text-[var(--text)] text-sm truncate">WhatsApp</p>
                <p className="text-xs text-green-400 truncate">Quick replies, usually within an hour</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/wild_core_fragrances"
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] block overflow-hidden"
            >
              <div className="w-11 h-11 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center flex-shrink-0">
                <Instagram size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-muted)]">Follow Us</p>
                <p className="font-semibold text-[var(--text)] text-sm truncate">@wildcorefragrances</p>
                <p className="text-xs text-[var(--text-muted)] truncate">Follow for drops and inspiration</p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:hello@wildcorefragrances.com"
              className="glass glass-hover rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] block overflow-hidden"
            >
              <div className="w-11 h-11 rounded-xl bg-gold/10 text-gold flex items-center justify-center flex-shrink-0">
                <Mail size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-muted)]">Email Us</p>
                <p className="font-semibold text-[var(--text)] text-sm truncate">hello@wildcorefragrances.com</p>
                <p className="text-xs text-[var(--text-muted)] truncate">We respond within 24 hours</p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+918295713252"
              className="glass glass-hover rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 hover:scale-[1.02] block overflow-hidden"
            >
              <div className="w-11 h-11 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
                <Phone size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-muted)]">Call Us</p>
                <p className="font-semibold text-[var(--text)] text-sm truncate">+91 8295713252</p>
                <p className="text-xs text-[var(--text-muted)] truncate">Sun-Thu, 9am-6pm GST</p>
              </div>
            </a>

            {/* Location */}
            <div className="glass rounded-2xl p-4 flex items-center gap-4 overflow-hidden">
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0">
                <MapPin size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-[var(--text-muted)]">Visit Us</p>
                <p className="font-semibold text-[var(--text)] text-sm truncate">Panipat, India</p>
                <p className="text-xs text-[var(--text-muted)] truncate">Worldwide shipping available</p>
              </div>
            </div>

            {/* WhatsApp CTA Button */}
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Wildcore! I'd like to know more about your fragrances.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#25D366] hover:bg-[#1fc255] text-white font-semibold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] text-sm"
            >
              <MessageCircle size={18} />
              Start WhatsApp Chat
            </a>
          </motion.div>

          {/* RIGHT: Contact Form - 3 columns out of 5 */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass rounded-3xl p-6 md:p-8">
              <h2 className="font-serif text-2xl font-bold text-[var(--text)] mb-6">
                Send a Message
              </h2>

              {sent ? (
                <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-8 text-center">
                  <CheckCircle size={48} className="text-green-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-[var(--text)]">Message Sent!</h3>
                  <p className="text-[var(--text-muted)] text-sm mt-1">
                    We'll get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-4 text-gold text-sm hover:underline transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs tracking-widest uppercase text-[var(--text-muted)] block mb-1.5">
                        <User size={14} className="inline mr-1.5" /> Name
                      </label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Your name"
                        required
                        className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs tracking-widest uppercase text-[var(--text-muted)] block mb-1.5">
                        <Mail size={14} className="inline mr-1.5" /> Email
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="your@email.com"
                        required
                        className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs tracking-widest uppercase text-[var(--text-muted)] block mb-1.5">
                      <Edit3 size={14} className="inline mr-1.5" /> Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      placeholder="How can we help?"
                      required
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-xs tracking-widest uppercase text-[var(--text-muted)] block mb-1.5">
                      Message
                    </label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us more..."
                      rows={5}
                      required
                      className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)] placeholder-[var(--text-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-4 rounded-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-60"
                  >
                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                    {sending ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}