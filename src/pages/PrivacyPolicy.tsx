export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] pt-32 pb-20 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-5xl font-bold mb-8">Privacy Policy</h1>

        <div className="space-y-6 text-[var(--text-muted)] leading-relaxed">
          <p>
            At Wildcore Fragrances, we value your privacy and are committed to protecting your personal information.
          </p>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Information We Collect</h2>
            <p>
              We may collect your name, phone number, delivery address, email address, and order details when you place an order.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">How We Use Your Information</h2>
            <p>
              Your information is used only for order processing, customer support, and improving our services.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Data Protection</h2>
            <p>
              We do not sell or share your personal information with third parties except when required for delivery or legal compliance.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-2">Contact</h2>
            <p>
              For privacy-related questions, contact us through our Contact page or WhatsApp support.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}