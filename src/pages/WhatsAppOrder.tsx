import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ShoppingBag, Send, Phone, MapPin, User, Mail, CheckCircle, X } from 'lucide-react';
import { trackWhatsAppClick } from '../services/whatsappTracker';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

const WHATSAPP = '918295713252';

export default function WhatsAppOrder() {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState('');
  
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    items: [{ name: '', quantity: 1, price: 0 }] as OrderItem[],
    deliveryCharge: 0,
    discount: 0,
    advanceReceived: 0,
    notes: '',
  });

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, price: 0 }]
    }));
  };

  const removeItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    }));
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + formData.deliveryCharge - formData.discount;
  };

  const calculateBalanceDue = () => {
    return calculateGrandTotal() - formData.advanceReceived;
  };

  const generateWhatsAppMessage = () => {
    const itemsList = formData.items
      .filter(item => item.name.trim())
      .map(item => `• ${item.name} × ${item.quantity} = ₹${(item.price * item.quantity).toFixed(2)}`)
      .join('\n');

    const message = `🧾 *Wildcore Fragrances - New Order*

👤 *Customer:* ${formData.customerName}
📞 *Phone:* ${formData.phone}
${formData.email ? `📧 *Email:* ${formData.email}` : ''}
📍 *Address:* ${formData.address}

🛍️ *Items:*
${itemsList || 'No items listed'}

💰 *Subtotal:* ₹${calculateSubtotal().toFixed(2)}
${formData.deliveryCharge > 0 ? `📦 *Delivery:* ₹${formData.deliveryCharge.toFixed(2)}` : ''}
${formData.discount > 0 ? `💸 *Discount:* -₹${formData.discount.toFixed(2)}` : ''}
*Grand Total:* ₹${calculateGrandTotal().toFixed(2)}
${formData.advanceReceived > 0 ? `
💳 *Advance Paid:* ₹${formData.advanceReceived.toFixed(2)}
📌 *Balance Due:* ₹${calculateBalanceDue().toFixed(2)}` : ''}
${formData.notes ? `📝 *Notes:* ${formData.notes}` : ''}

---
🏢 *Wildcore Fragrances*
📞 +91 ${WHATSAPP}
📍 Panipat, Haryana`;

    return encodeURIComponent(message);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const orderId = `WC-WA-${Date.now().toString().slice(-6)}`;
      const subtotal = calculateSubtotal();
      const grandTotal = calculateGrandTotal();
      const balanceDue = calculateBalanceDue();
      const paymentStatus = formData.advanceReceived === 0 ? 'unpaid' :
                           balanceDue === 0 ? 'paid' : 'partial';

      const message = generateWhatsAppMessage();
      const whatsappLink = `https://wa.me/${WHATSAPP}?text=${message}`;

      // Track in Firebase
      await trackWhatsAppClick({
        productId: 'whatsapp-order',
        productName: 'WhatsApp Order',
        productPrice: grandTotal,
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email || '',
        message: decodeURIComponent(message),
        whatsappLink,
        source: 'custom',
      });

      setOrderId(orderId);
      setStep(2);

      // Open WhatsApp
      window.open(whatsappLink, '_blank');

    } catch (error) {
      console.error('Error saving order:', error);
      alert('Failed to save order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20 flex items-center justify-center">
        <div className="max-w-md w-full glass rounded-3xl p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-[var(--text)]">Order Sent!</h2>
          <p className="text-[var(--text-muted)] mt-2">
            Your order has been sent via WhatsApp.
          </p>
          <p className="text-xs text-gold mt-2">Order ID: {orderId}</p>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full mt-6 bg-gold text-black font-semibold py-3 rounded-xl hover:bg-gold-light transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="font-serif text-4xl font-bold text-[var(--text)]">WhatsApp Order</h1>
          <p className="text-[var(--text-muted)] mt-2">Fill the details and send order via WhatsApp</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 space-y-4">
          {/* Customer Details */}
          <div className="space-y-3">
            <p className="text-xs tracking-widest uppercase text-gold">Customer Details</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1">👤 Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--text-muted)] block mb-1">📞 Phone *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">📧 Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="e.g. rajesh@gmail.com"
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
            </div>

            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">📍 Delivery Address *</label>
              <textarea
                required
                value={formData.address}
                onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Full delivery address"
                rows={2}
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
            </div>
          </div>

          {/* Products */}
          <div className="space-y-3">
            <p className="text-xs tracking-widest uppercase text-gold">Products</p>
            
            <div className="grid grid-cols-12 gap-2 text-xs text-[var(--text-muted)] font-medium uppercase tracking-wider px-1">
              <div className="col-span-6">Product Name</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3 text-center">Price (₹)</div>
              <div className="col-span-1 text-center">Action</div>
            </div>

            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center bg-[var(--bg3)] rounded-xl p-2">
                <input
                  value={item.name}
                  onChange={e => updateItem(index, 'name', e.target.value)}
                  placeholder="Product name"
                  className="col-span-6 bg-transparent border-0 px-2 py-2 text-sm text-[var(--text)] focus:outline-none focus:ring-1 focus:ring-gold rounded"
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                  placeholder="1"
                  className="col-span-2 bg-transparent border-0 px-2 py-2 text-sm text-[var(--text)] text-center focus:outline-none focus:ring-1 focus:ring-gold rounded"
                />
                <input
                  type="number"
                  value={item.price}
                  onChange={e => updateItem(index, 'price', Number(e.target.value))}
                  placeholder="0"
                  className="col-span-3 bg-transparent border-0 px-2 py-2 text-sm text-[var(--text)] text-center focus:outline-none focus:ring-1 focus:ring-gold rounded"
                />
                <div className="col-span-1 flex justify-center">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="px-2 py-1 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={addItem}
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              + Add product
            </button>
          </div>

          {/* Charges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">📦 Delivery (₹)</label>
              <input
                type="number"
                value={formData.deliveryCharge}
                onChange={e => setFormData(prev => ({ ...prev, deliveryCharge: Number(e.target.value) }))}
                placeholder="0"
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">💸 Discount (₹)</label>
              <input
                type="number"
                value={formData.discount}
                onChange={e => setFormData(prev => ({ ...prev, discount: Number(e.target.value) }))}
                placeholder="0"
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">💰 Advance (₹)</label>
              <input
                type="number"
                value={formData.advanceReceived}
                onChange={e => setFormData(prev => ({ ...prev, advanceReceived: Number(e.target.value) }))}
                placeholder="0"
                className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">📝 Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Any special instructions"
              rows={2}
              className="w-full bg-[var(--bg3)] border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-[var(--text)]"
            />
          </div>

          {/* Totals */}
          <div className="glass rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between text-[var(--text-muted)]">
              <span>Subtotal</span>
              <span>₹{calculateSubtotal().toFixed(2)}</span>
            </div>
            {formData.deliveryCharge > 0 && (
              <div className="flex justify-between text-[var(--text-muted)]">
                <span>Delivery</span>
                <span>₹{formData.deliveryCharge.toFixed(2)}</span>
              </div>
            )}
            {formData.discount > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Discount</span>
                <span>-₹{formData.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t border-[var(--border)] pt-2">
              <span>Grand Total</span>
              <span className="text-gold">₹{calculateGrandTotal().toFixed(2)}</span>
            </div>
            {formData.advanceReceived > 0 && (
              <>
                <div className="flex justify-between text-blue-400">
                  <span>Advance Paid</span>
                  <span>₹{formData.advanceReceived.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-[var(--border)] pt-2">
                  <span>Balance Due</span>
                  <span className="text-red-400">₹{calculateBalanceDue().toFixed(2)}</span>
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gold text-black font-semibold py-4 rounded-xl hover:bg-gold-light transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <Send size={18} />
            {submitting ? 'Sending...' : 'Place Order & Send WhatsApp'}
          </button>
        </form>
      </div>
    </div>
  );
}