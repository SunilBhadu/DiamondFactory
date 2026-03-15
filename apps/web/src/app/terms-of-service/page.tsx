import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'The terms and conditions governing your use of the Diamond Factory website and services.',
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen py-16">
      <div className="container mx-auto max-w-3xl">
        <h1 className="font-display text-charcoal-900 mb-2 text-4xl font-bold">Terms of Service</h1>
        <p className="text-charcoal-400 mb-12 text-sm">Last updated: January 1, 2025</p>

        <div className="space-y-10 text-charcoal-700">
          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or purchasing from{' '}
              <a href="https://diamondfactory.in" className="text-gold-600 hover:text-gold-700">
                diamondfactory.in
              </a>
              , you agree to be bound by these Terms of Service and our Privacy Policy. If you do
              not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              2. Eligibility
            </h2>
            <p>
              You must be at least 18 years old and legally capable of entering into a binding
              contract under Indian law to purchase from Diamond Factory. By placing an order, you
              confirm you meet this requirement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              3. Products and Pricing
            </h2>
            <p>
              All prices are displayed in Indian Rupees (INR) inclusive of applicable GST (3% on
              diamonds and jewellery). We reserve the right to correct pricing errors before
              shipment. In the event of a pricing error, we will contact you and offer to honour
              the corrected price or cancel the order with a full refund.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">4. Orders</h2>
            <p>
              An order confirmation email does not constitute acceptance of your order. Acceptance
              occurs only when we dispatch the item. We reserve the right to cancel orders due to
              stock availability, pricing errors, or suspected fraud.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              5. Payment
            </h2>
            <p>
              We accept Visa, Mastercard, RuPay, UPI, and EMI options through Stripe and Razorpay.
              All payments are processed over encrypted connections. We do not store your card
              details on our servers.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              6. Returns and Refunds
            </h2>
            <p>
              We offer a 30-day return policy for unworn items in original condition with the
              original certificate. Custom-engraved or bespoke items are non-returnable. Refunds
              are processed to the original payment method within 7–10 business days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              7. Diamond Reservations
            </h2>
            <p>
              Adding a diamond to your cart places a 30-minute reservation on that stone. The
              reservation does not constitute a purchase. If checkout is not completed within 30
              minutes, the diamond returns to available inventory.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              8. Intellectual Property
            </h2>
            <p>
              All content on this website — including photography, copy, logos, and software — is
              the intellectual property of Diamond Factory Pvt Ltd or its licensors. You may not
              reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              9. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by Indian law, Diamond Factory shall not be liable
              for indirect, incidental, or consequential damages. Our total liability to you for any
              claim shall not exceed the amount you paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              10. Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of India. Any dispute shall be subject to the
              exclusive jurisdiction of the courts in Surat, Gujarat.
            </p>
          </section>

          <section>
            <h2 className="font-display text-charcoal-900 mb-4 text-2xl font-bold">
              11. Contact
            </h2>
            <p>
              Diamond Factory Pvt Ltd
              <br />
              Dhanlaxmi Estate, 3/2 Vasta Devdi Rd, Surat, Gujarat 395004
              <br />
              Email:{' '}
              <a
                href="mailto:legal@diamondfactory.in"
                className="text-gold-600 hover:text-gold-700"
              >
                legal@diamondfactory.in
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
