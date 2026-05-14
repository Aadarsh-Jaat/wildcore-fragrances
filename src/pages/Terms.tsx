function Terms() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl font-bold mb-8">Terms of Service</h1>

        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>By using Wildcore Fragrances, you agree to our terms and conditions.</p>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Orders</h2>
            <p>All orders are subject to availability and confirmation.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Pricing</h2>
            <p>Prices may change without prior notice.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Product Usage</h2>
            <p>Wildcore products are intended for external use only. Perform a patch test before use.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Terms;