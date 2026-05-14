function ShippingPolicy() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl font-bold mb-8">Shipping Policy</h1>

        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>We aim to deliver every Wildcore order safely and quickly.</p>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">
              Processing Time
            </h2>
            <p>Orders are usually processed within 1–3 business days.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">
              Delivery Time
            </h2>
            <p>Delivery may take 3–7 business days depending on your location.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">
              Shipping Charges
            </h2>
            <p>Shipping charges may vary depending on location and order size.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingPolicy;