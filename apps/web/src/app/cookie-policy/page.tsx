import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: 'How Diamond Factory uses cookies and similar tracking technologies.',
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-display text-charcoal-900 mb-2 text-4xl font-bold">Cookie Policy</h1>
        <p className="text-charcoal-400 mb-12 text-sm">Last updated: January 1, 2025</p>

        <div className="space-y-10 text-charcoal-700">
          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files placed on your device when you visit a website. They
              allow the site to remember your preferences and actions over time. We also use similar
              technologies such as localStorage and session storage for certain features.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              2. Cookies We Use
            </h2>
            <div className="mt-4 space-y-6">
              <div className="rounded-xl bg-charcoal-50 p-6">
                <h3 className="text-charcoal-900 mb-2 font-semibold">Strictly Necessary</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  These cookies are required for the website to function. They include the
                  authentication refresh token cookie (HttpOnly, secure) that keeps you logged in,
                  and CSRF protection tokens. You cannot opt out of these.
                </p>
              </div>
              <div className="rounded-xl bg-charcoal-50 p-6">
                <h3 className="text-charcoal-900 mb-2 font-semibold">Functional</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  These store your preferences such as your cart contents (via localStorage) and
                  wishlist. Without them, you would lose your cart between page visits.
                </p>
              </div>
              <div className="rounded-xl bg-charcoal-50 p-6">
                <h3 className="text-charcoal-900 mb-2 font-semibold">Analytics</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  We use Google Analytics (GA4) to understand how visitors use our site — which
                  pages are most popular, how long people spend, and where they come from. This data
                  is aggregated and anonymised. You can opt out by enabling &quot;Do Not Track&quot;
                  in your browser or by using the GA opt-out browser extension.
                </p>
              </div>
              <div className="rounded-xl bg-charcoal-50 p-6">
                <h3 className="text-charcoal-900 mb-2 font-semibold">Marketing</h3>
                <p className="text-charcoal-600 text-sm leading-relaxed">
                  If you click on one of our advertisements, advertising networks may place a cookie
                  to track conversions. We only activate these cookies if you consent.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              3. Managing Cookies
            </h2>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to
              block or delete cookies. Note that blocking strictly necessary cookies may prevent the
              site from working correctly (for example, you will not be able to stay logged in).
            </p>
            <p className="mt-4">Browser settings guides:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-sm">
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 hover:text-gold-700"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 hover:text-gold-700"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-600 hover:text-gold-700"
                >
                  Safari
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              4. Updates to This Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. We will notify you of significant
              changes by posting a notice on the website. Continued use after changes constitutes
              acceptance.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">5. Contact</h2>
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
