import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Diamond Factory collects, uses, and protects your personal data.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-display text-charcoal-900 mb-2 text-4xl font-bold">Privacy Policy</h1>
        <p className="text-charcoal-400 mb-12 text-sm">Last updated: January 1, 2025</p>

        <div className="prose prose-charcoal max-w-none space-y-10 text-charcoal-700">
          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              1. Who We Are
            </h2>
            <p>
              Diamond Factory Pvt Ltd (&quot;Diamond Factory&quot;, &quot;we&quot;,
              &quot;our&quot;) is a company registered in India, with its registered office at
              Dhanlaxmi Estate, 3/2 Vasta Devdi Rd, Surat, Gujarat 395004. We operate the website{' '}
              <a href="https://diamondfactory.in" className="text-gold-600 hover:text-gold-700">
                diamondfactory.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              2. Data We Collect
            </h2>
            <p>We collect the following categories of personal data:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Account data:</strong> name, email address, phone number, and password hash
                when you create an account.
              </li>
              <li>
                <strong>Order data:</strong> billing and shipping addresses, order history, and
                payment confirmation identifiers (we never store raw card numbers).
              </li>
              <li>
                <strong>Usage data:</strong> pages viewed, search queries, device type, and IP
                address collected automatically via logs and analytics.
              </li>
              <li>
                <strong>Communications:</strong> messages you send us via email or the contact form.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              3. How We Use Your Data
            </h2>
            <ul className="list-disc space-y-2 pl-6">
              <li>To process and fulfil your orders.</li>
              <li>To manage your account and send order status notifications.</li>
              <li>To improve our website and personalise your browsing experience.</li>
              <li>To send marketing communications — only if you have opted in.</li>
              <li>To comply with legal obligations under Indian law.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              4. Legal Basis for Processing
            </h2>
            <p>
              We process your personal data on the basis of (a) contract performance — necessary to
              complete your purchase; (b) legitimate interests — to improve our services and prevent
              fraud; and (c) consent — for marketing emails, which you may withdraw at any time.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              5. Sharing Your Data
            </h2>
            <p>We share data with the following third parties only as necessary:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>
                <strong>Payment processors</strong> (Stripe, Razorpay) to process transactions. They
                are PCI-DSS Level 1 certified.
              </li>
              <li>
                <strong>Shipping partners</strong> to deliver your order.
              </li>
              <li>
                <strong>Cloud infrastructure providers</strong> (AWS) that host our platform.
              </li>
            </ul>
            <p className="mt-4">We do not sell your personal data to any third party.</p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              6. Data Retention
            </h2>
            <p>
              We retain account data for as long as your account is active. Order records are kept
              for 7 years to comply with Indian accounting regulations. Marketing preferences are
              retained until you withdraw consent.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">7. Your Rights</h2>
            <p>Under applicable law you have the right to:</p>
            <ul className="mt-4 list-disc space-y-2 pl-6">
              <li>Access a copy of your personal data.</li>
              <li>Correct inaccurate data.</li>
              <li>Request deletion of your data (subject to legal retention obligations).</li>
              <li>Withdraw consent for marketing at any time.</li>
            </ul>
            <p className="mt-4">
              To exercise any right, email{' '}
              <a
                href="mailto:privacy@diamondfactory.in"
                className="text-gold-600 hover:text-gold-700"
              >
                privacy@diamondfactory.in
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              8. Security
            </h2>
            <p>
              We use industry-standard security measures including TLS encryption in transit, AES
              encryption at rest for sensitive fields, and access controls limited to staff with a
              need to know. Passwords are hashed using bcrypt and never stored in plain text.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              9. Contact Us
            </h2>
            <p>
              Diamond Factory Pvt Ltd
              <br />
              Dhanlaxmi Estate, 3/2 Vasta Devdi Rd, Surat, Gujarat 395004
              <br />
              Email:{' '}
              <a
                href="mailto:privacy@diamondfactory.in"
                className="text-gold-600 hover:text-gold-700"
              >
                privacy@diamondfactory.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
