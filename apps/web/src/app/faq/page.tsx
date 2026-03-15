import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Diamond Factory',
  description: 'Find answers to common questions about diamonds, orders, shipping, and returns.',
};

const faqs = [
  {
    category: 'Diamonds',
    questions: [
      {
        q: 'Are your diamonds certified?',
        a: 'Yes. Every diamond we sell carries a grading report from GIA (Gemological Institute of America) or IGI (International Gemological Institute). These are the two most respected independent laboratories in the world.',
      },
      {
        q: 'What is the difference between natural and lab grown diamonds?',
        a: 'Lab grown diamonds are chemically, physically, and optically identical to natural diamonds. The only difference is origin: natural diamonds form over billions of years in the Earth, while lab grown diamonds are created in a laboratory in weeks. Lab grown diamonds typically cost 50–80% less.',
      },
      {
        q: 'Can I customise a diamond ring?',
        a: 'Absolutely. Use our Build Your Ring feature to choose any diamond from our catalog, pair it with your preferred ring setting, and select your metal type and ring size. Our craftsmen in Surat will create your bespoke piece.',
      },
    ],
  },
  {
    category: 'Ordering & Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit/debit cards (Visa, Mastercard, RuPay), UPI, net banking, and EMI options through Razorpay. International customers can pay via Stripe. All transactions are PCI-DSS compliant.',
      },
      {
        q: 'Is it safe to buy diamonds online from Diamond Factory?',
        a: 'Yes. We are a registered Indian company (Diamond Factory Pvt Ltd) based in Surat — the diamond capital of the world. All diamonds are insured during shipping, and every order comes with a certificate of authenticity.',
      },
      {
        q: 'Do you offer EMI?',
        a: 'Yes. EMI is available on credit cards and select debit cards via Razorpay at checkout. No-cost EMI options may be available on select cards.',
      },
    ],
  },
  {
    category: 'Shipping & Returns',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Orders within India are delivered in 5–7 business days via FedEx Priority with full insurance. Custom ring orders may take 10–14 business days.',
      },
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day hassle-free return policy. The diamond or jewelry must be in original condition with its certificate. Contact us and we\'ll arrange a free pickup.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes. We ship internationally to select countries. International orders are subject to local customs duties. Contact us for a shipping quote.',
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-charcoal-950 py-20 text-center text-white">
        <h1 className="font-display mb-4 text-4xl font-bold">Frequently Asked Questions</h1>
        <p className="text-charcoal-300 mx-auto max-w-xl text-lg">
          Have a question? We&apos;ve got answers. Can&apos;t find what you&apos;re looking for?{' '}
          <Link href="/contact" className="text-gold-400 underline">
            Contact us.
          </Link>
        </p>
      </div>

      <div className="container mx-auto py-20">
        <div className="mx-auto max-w-3xl space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
                {section.category}
              </h2>
              <div className="space-y-4">
                {section.questions.map((faq) => (
                  <details
                    key={faq.q}
                    className="border-charcoal-200 group overflow-hidden rounded-xl border"
                  >
                    <summary className="hover:bg-charcoal-50 flex cursor-pointer items-center justify-between p-5 font-medium transition-colors">
                      {faq.q}
                    </summary>
                    <div className="text-charcoal-600 border-charcoal-100 border-t px-5 py-4 text-sm leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
