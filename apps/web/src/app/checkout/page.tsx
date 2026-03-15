'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Check, Shield, ChevronRight, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { useCartStore } from '@/stores/cart.store';
import { useAuth } from '@/lib/hooks/use-auth';
import { formatPrice } from '@/lib/utils';

const steps = ['Contact', 'Shipping', 'Payment', 'Review'];

const addressSchema = z.object({
  email: z.string().email('Valid email required'),
  firstName: z.string().min(2, 'Required'),
  lastName: z.string().min(2, 'Required'),
  phone: z.string().min(10, 'Valid phone required'),
  addressLine1: z.string().min(5, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  postalCode: z.string().min(6, 'PIN code required'),
  country: z.string().default('India'),
  billingIsSameAsShipping: z.boolean().default(true),
});

type AddressFormData = z.infer<typeof addressSchema>;

const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Puducherry',
];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState<'card' | 'upi'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { items, subtotal } = useCartStore();
  const router = useRouter();

  const gst = subtotal * 0.03;
  const shipping = subtotal >= 50000 ? 0 : 999;
  const total = subtotal + gst + shipping;

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      email: user?.email || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      country: 'India',
      billingIsSameAsShipping: true,
    },
  });

  const handleNextStep = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    try {
      // Simulate order placement
      await new Promise((resolve) => setTimeout(resolve, 2000));
      router.push('/order-confirmation?order=DF-2025-002');
    } finally {
      setIsProcessing(false);
    }
  };

  const OrderSummary = () => (
    <div className="shadow-card sticky top-24 rounded-2xl bg-white p-6">
      <h3 className="font-display text-charcoal-900 mb-4 text-lg font-bold">Order Summary</h3>
      <div className="mb-4 space-y-3">
        {items.slice(0, 3).map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span className="text-charcoal-600 mr-2 line-clamp-2 flex-1">
              {item.name} × {item.quantity}
            </span>
            <span className="shrink-0 font-medium">
              {formatPrice(item.unitPrice * item.quantity)}
            </span>
          </div>
        ))}
        {items.length > 3 && (
          <p className="text-charcoal-400 text-xs">+{items.length - 3} more items</p>
        )}
      </div>
      <div className="border-charcoal-100 space-y-2 border-t pt-3 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal-500">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-500">GST (3%)</span>
          <span>{formatPrice(gst)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-500">Shipping</span>
          <span className={shipping === 0 ? 'text-emerald-600' : ''}>
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        <div className="border-charcoal-200 flex justify-between border-t pt-2 text-base font-bold">
          <span>Total</span>
          <span className="text-gold-600">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-charcoal-50 min-h-screen py-12">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link href="/" className="font-display text-charcoal-900 text-2xl font-bold">
            Diamond <span className="text-gold-500">Factory</span>
          </Link>
          <div className="text-charcoal-400 flex items-center gap-1 text-xs">
            <Shield className="h-3 w-3" />
            Secure Checkout
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-10 flex items-center justify-center gap-0">
          {steps.map((step, idx) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    idx < currentStep
                      ? 'bg-gold-500 text-white'
                      : idx === currentStep
                        ? 'bg-charcoal-900 text-white'
                        : 'bg-charcoal-200 text-charcoal-500'
                  }`}
                >
                  {idx < currentStep ? <Check className="h-4 w-4" /> : idx + 1}
                </div>
                <span
                  className={`mt-1 hidden text-xs font-medium sm:block ${idx === currentStep ? 'text-charcoal-900' : 'text-charcoal-400'}`}
                >
                  {step}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div
                  className={`mx-1 mb-4 h-0.5 w-16 sm:w-24 ${idx < currentStep ? 'bg-gold-500' : 'bg-charcoal-200'}`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="shadow-card rounded-2xl bg-white p-8">
              {/* Step 1: Contact */}
              {currentStep === 0 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
                    Contact Information
                  </h2>
                  <div>
                    <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...register('email')}
                      className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.email ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                    )}
                  </div>
                  <p className="text-charcoal-400 mt-3 text-xs">
                    Order confirmation and tracking will be sent to this email.
                  </p>
                  <button
                    onClick={handleNextStep}
                    className="bg-charcoal-900 hover:bg-charcoal-800 mt-8 flex w-full items-center justify-center gap-2 rounded-full py-4 font-semibold text-white transition-colors"
                  >
                    Continue to Shipping <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Step 2: Shipping */}
              {currentStep === 1 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                          First Name
                        </label>
                        <input
                          {...register('firstName')}
                          className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.firstName ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                          Last Name
                        </label>
                        <input
                          {...register('lastName')}
                          className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.lastName ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-xs text-red-500">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.phone ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                        Address Line 1
                      </label>
                      <input
                        {...register('addressLine1')}
                        className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.addressLine1 ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                        placeholder="Flat/House No., Building, Street"
                      />
                      {errors.addressLine1 && (
                        <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        {...register('addressLine2')}
                        className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                        placeholder="Area, Landmark"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                          City
                        </label>
                        <input
                          {...register('city')}
                          className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.city ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                        />
                        {errors.city && (
                          <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                          PIN Code
                        </label>
                        <input
                          {...register('postalCode')}
                          className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.postalCode ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                          placeholder="395001"
                        />
                        {errors.postalCode && (
                          <p className="mt-1 text-xs text-red-500">{errors.postalCode.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                        State
                      </label>
                      <select
                        {...register('state')}
                        className={`w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none ${errors.state ? 'border-red-400' : 'border-charcoal-300 focus:border-gold-500'}`}
                      >
                        <option value="">Select state</option>
                        {indianStates.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>
                      )}
                    </div>
                    <div>
                      <label className="flex cursor-pointer items-center gap-2">
                        <input
                          type="checkbox"
                          {...register('billingIsSameAsShipping')}
                          className="accent-gold-500"
                        />
                        <span className="text-charcoal-700 text-sm">
                          Billing address same as shipping
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="border-charcoal-300 text-charcoal-700 hover:border-charcoal-500 flex-1 rounded-full border-2 py-4 font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="bg-charcoal-900 hover:bg-charcoal-800 flex-1 rounded-full py-4 font-semibold text-white transition-colors"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 2 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
                    Payment Method
                  </h2>

                  <div className="mb-6 space-y-3">
                    <label
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors ${selectedPayment === 'card' ? 'border-gold-500 bg-gold-50' : 'border-charcoal-200'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={selectedPayment === 'card'}
                        onChange={() => setSelectedPayment('card')}
                        className="accent-gold-500"
                      />
                      <CreditCard className="text-charcoal-500 h-5 w-5" />
                      <div>
                        <p className="text-charcoal-900 font-medium">Credit / Debit Card</p>
                        <p className="text-charcoal-400 text-xs">Visa, Mastercard, RuPay, Amex</p>
                      </div>
                    </label>

                    <label
                      className={`flex cursor-pointer items-center gap-4 rounded-xl border-2 p-4 transition-colors ${selectedPayment === 'upi' ? 'border-gold-500 bg-gold-50' : 'border-charcoal-200'}`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value="upi"
                        checked={selectedPayment === 'upi'}
                        onChange={() => setSelectedPayment('upi')}
                        className="accent-gold-500"
                      />
                      <Smartphone className="text-charcoal-500 h-5 w-5" />
                      <div>
                        <p className="text-charcoal-900 font-medium">UPI / Razorpay</p>
                        <p className="text-charcoal-400 text-xs">GPay, PhonePe, Paytm, BHIM</p>
                      </div>
                    </label>
                  </div>

                  {selectedPayment === 'card' && (
                    <div className="bg-charcoal-50 mb-6 space-y-4 rounded-xl p-4">
                      <div>
                        <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                            Expiry
                          </label>
                          <input
                            type="text"
                            placeholder="MM / YY"
                            maxLength={7}
                            className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                            CVV
                          </label>
                          <input
                            type="text"
                            placeholder="•••"
                            maxLength={4}
                            className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          placeholder="As it appears on your card"
                          className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {selectedPayment === 'upi' && (
                    <div className="bg-charcoal-50 mb-6 rounded-xl p-4">
                      <label className="text-charcoal-700 mb-1.5 block text-sm font-medium">
                        UPI ID
                      </label>
                      <input
                        type="text"
                        placeholder="yourname@upi"
                        className="border-charcoal-300 focus:border-gold-500 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                      />
                      <p className="text-charcoal-400 mt-2 text-xs">
                        e.g. yourname@okaxis, yourname@ybl
                      </p>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="border-charcoal-300 text-charcoal-700 hover:border-charcoal-500 flex-1 rounded-full border-2 py-4 font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNextStep}
                      className="bg-charcoal-900 hover:bg-charcoal-800 flex-1 rounded-full py-4 font-semibold text-white transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 3 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-6 text-2xl font-bold">
                    Review Your Order
                  </h2>

                  <div className="mb-8 space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="border-charcoal-100 flex justify-between border-b pb-3 text-sm"
                      >
                        <span className="text-charcoal-700">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-charcoal-50 mb-6 space-y-2 rounded-xl p-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Subtotal</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">GST (3%)</span>
                      <span>{formatPrice(gst)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-charcoal-500">Shipping</span>
                      <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                    </div>
                    <div className="border-charcoal-200 flex justify-between border-t pt-2 text-base font-bold">
                      <span>Total</span>
                      <span className="text-gold-600">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="text-charcoal-500 bg-gold-50 border-gold-200 mb-6 flex items-start gap-2 rounded-lg border p-3 text-xs">
                    <Shield className="text-gold-600 mt-0.5 h-4 w-4 shrink-0" />
                    By placing your order, you agree to Diamond Factory's Terms of Service and
                    Privacy Policy. Your payment is secured by SSL encryption.
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="border-charcoal-300 text-charcoal-700 hover:border-charcoal-500 flex-1 rounded-full border-2 py-4 font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="bg-gold-500 hover:bg-gold-600 flex flex-1 items-center justify-center gap-2 rounded-full py-4 font-semibold text-white transition-colors disabled:opacity-50"
                    >
                      {isProcessing && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isProcessing ? 'Processing...' : `Place Order · ${formatPrice(total)}`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
