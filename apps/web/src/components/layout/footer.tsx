import Link from 'next/link';
import { Diamond, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const footerLinks = {
  Shop: [
    { label: 'Diamonds', href: '/diamonds' },
    { label: 'Engagement Rings', href: '/engagement-rings' },
    { label: 'Jewelry', href: '/jewelry' },
    { label: 'Gift Cards', href: '/gift-cards' },
  ],
  Learn: [
    { label: 'Diamond Guide', href: '/education/diamond-guide' },
    { label: 'Understanding the 4Cs', href: '/education/4cs' },
    { label: 'Lab Grown Diamonds', href: '/education/lab-grown' },
    { label: 'FAQs', href: '/faq' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
  ],
  Support: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Returns & Exchanges', href: '/returns' },
    { label: 'Warranty', href: '/warranty' },
  ],
};

const socialLinks = [
  { icon: Instagram, href: 'https://instagram.com/diamondfactoryin', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com/diamondfactoryin', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com/diamondfactory', label: 'Twitter' },
  { icon: Youtube, href: 'https://youtube.com/@diamondfactory', label: 'YouTube' },
];

const paymentMethods = ['Visa', 'Mastercard', 'RuPay', 'UPI', 'PayPal', 'EMI'];

export function Footer() {
  return (
    <footer className="bg-charcoal-950 text-white">
      {/* Main footer content */}
      <div className="container mx-auto py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="mb-4 flex items-center gap-2">
              <Diamond className="text-gold-400 h-6 w-6" />
              <span className="font-display text-xl font-bold">
                Diamond <span className="text-gold-400">Factory</span>
              </span>
            </Link>
            <p className="text-charcoal-400 mb-6 text-sm leading-relaxed">
              India's premier destination for certified lab grown and natural diamonds. Every
              diamond is ethically sourced, GIA or IGI certified, and delivered with our lifetime
              guarantee.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="bg-charcoal-800 hover:bg-gold-500 group flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                >
                  <social.icon className="text-charcoal-400 h-4 w-4 transition-colors group-hover:text-white" />
                </a>
              ))}
            </div>

            {/* Address */}
            <div className="text-charcoal-500 mt-6 text-xs leading-relaxed">
              <p className="text-charcoal-400 mb-1 font-semibold">Diamond Factory Pvt Ltd</p>
              <p>Dhanlaxmi Estate, 3/2 Vasta Devdi Rd</p>
              <p>Surat, Gujarat 395004, India</p>
              <a
                href="mailto:hello@diamondfactory.in"
                className="text-gold-500 hover:text-gold-400 mt-1 block"
              >
                hello@diamondfactory.in
              </a>
              <a href="tel:+912612345678" className="text-gold-500 hover:text-gold-400">
                +91 261 234 5678
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
                {category}
              </h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-charcoal-400 hover:text-gold-400 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-charcoal-800 border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          {/* Copyright */}
          <p className="text-charcoal-500 text-xs">
            © {new Date().getFullYear()} Diamond Factory Pvt Ltd. All rights reserved.
          </p>

          {/* Legal links */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Service', href: '/terms-of-service' },
              { label: 'Cookie Policy', href: '/cookie-policy' },
              { label: 'Sitemap', href: '/sitemap.xml' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-charcoal-500 hover:text-charcoal-300 text-xs transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Payment methods */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="border-charcoal-700 text-charcoal-500 rounded border px-2 py-1 text-xs"
              >
                {method}
              </span>
            ))}
            <span className="rounded border border-green-800 bg-green-900/20 px-2 py-1 text-xs text-green-500">
              🔒 PCI Secure
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
