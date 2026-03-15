import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Diamond Factory',
  description:
    'Get in touch with Diamond Factory. We\'re here to help with diamonds, orders, and anything else.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Contact Us</h1>
        <p className="text-charcoal-300 text-lg">
          Our gemology team is available Monday–Saturday, 10 AM–7 PM IST.
        </p>
      </div>

      <div className="container mx-auto py-20">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Contact info */}
          <div>
            <h2 className="font-display text-charcoal-900 mb-8 text-2xl font-bold">
              Get in Touch
            </h2>
            <div className="space-y-6">
              {[
                { label: 'Email', value: 'hello@diamondfactory.in', href: 'mailto:hello@diamondfactory.in' },
                { label: 'Phone', value: '+91 261 234 5678', href: 'tel:+912612345678' },
                { label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
                { label: 'Address', value: 'Dhanlaxmi Estate, 3/2 Vasta Devdi Rd, Surat, Gujarat 395004, India', href: null },
              ].map((item) => (
                <div key={item.label}>
                  <p className="text-charcoal-400 mb-1 text-xs font-semibold uppercase tracking-wider">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-charcoal-800 hover:text-gold-600 font-medium transition-colors"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-charcoal-800 font-medium">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-charcoal-50 rounded-2xl p-8">
            <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
              Send a Message
            </h2>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-charcoal-700 mb-1 block text-sm font-medium">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-charcoal-700 mb-1 block text-sm font-medium">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-charcoal-700 mb-1 block text-sm font-medium">Email</label>
                <input
                  type="email"
                  className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <div>
                <label className="text-charcoal-700 mb-1 block text-sm font-medium">Subject</label>
                <select className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none">
                  <option>General Enquiry</option>
                  <option>Diamond Sourcing</option>
                  <option>Custom Ring</option>
                  <option>Order Support</option>
                  <option>Returns &amp; Exchanges</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="text-charcoal-700 mb-1 block text-sm font-medium">Message</label>
                <textarea
                  rows={5}
                  className="border-charcoal-300 focus:border-gold-500 w-full rounded-lg border bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-gold-500 hover:bg-gold-600 w-full rounded-full py-3 font-semibold text-white transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
