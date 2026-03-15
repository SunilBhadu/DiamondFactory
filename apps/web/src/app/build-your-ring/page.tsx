'use client';

import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ChevronRight, ArrowLeft, Info } from 'lucide-react';
import type { MetalType } from '@diamond-factory/types';
import { useRingBuilderStore } from '@/stores/ring-builder.store';
import { formatPrice } from '@/lib/utils';

const steps = ['Choose Diamond', 'Choose Setting', 'Customize', 'Preview'];

const ringSettings = [
  {
    id: 'rs-001',
    name: 'The Aria Solitaire',
    style: 'Solitaire',
    metalType: '18k-white-gold' as MetalType,
    basePrice: 45000,
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=400&q=80',
  },
  {
    id: 'rs-002',
    name: 'The Celestial Halo',
    style: 'Halo',
    metalType: '18k-white-gold' as MetalType,
    basePrice: 65000,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80',
  },
  {
    id: 'rs-003',
    name: 'The Eternity Three-Stone',
    style: 'Three-Stone',
    metalType: 'platinum' as MetalType,
    basePrice: 85000,
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?w=400&q=80',
  },
  {
    id: 'rs-004',
    name: 'The Vintage Milgrain',
    style: 'Vintage',
    metalType: '18k-yellow-gold' as MetalType,
    basePrice: 72000,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&q=80',
  },
  {
    id: 'rs-005',
    name: 'The Pavé Crown',
    style: 'Pavé',
    metalType: '18k-rose-gold' as MetalType,
    basePrice: 58000,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&q=80',
  },
  {
    id: 'rs-006',
    name: 'The Bezel Modern',
    style: 'Bezel',
    metalType: 'platinum' as MetalType,
    basePrice: 52000,
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94816b5?w=400&q=80',
  },
];

const metalOptions: { label: string; value: MetalType; color: string }[] = [
  { label: 'Platinum', value: 'platinum', color: '#E8E8E8' },
  { label: '18K White Gold', value: '18k-white-gold', color: '#D4D4D4' },
  { label: '18K Yellow Gold', value: '18k-yellow-gold', color: '#D4AF37' },
  { label: '18K Rose Gold', value: '18k-rose-gold', color: '#E8A598' },
];

const ringSizes = [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12];

const engravingFonts = [
  { label: 'Classic Script', value: 'classic-script' },
  { label: 'Modern Sans', value: 'modern-sans' },
  { label: 'Elegant Serif', value: 'elegant-serif' },
  { label: 'Block Letters', value: 'block-letters' },
];

function RingBuilderContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const diamondId = searchParams.get('diamond');

  const {
    selectedDiamond,
    selectedSetting,
    metalType,
    ringSizeUS,
    engravingText,
    engravingFont,
    currentStep,
    setDiamond,
    setSetting,
    setMetal,
    setSize,
    setEngraving,
    nextStep,
    prevStep,
    totalPrice,
  } = useRingBuilderStore();

  const handleAddToCart = () => {
    router.push('/cart');
  };

  return (
    <div className="bg-charcoal-50 min-h-screen">
      {/* Header */}
      <div className="border-charcoal-200 sticky top-0 z-40 border-b bg-white">
        <div className="container mx-auto py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/diamonds"
              className="text-charcoal-500 hover:text-charcoal-900 flex items-center gap-2 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Diamonds
            </Link>
            <h1 className="font-display text-charcoal-900 text-xl font-bold">Build Your Ring</h1>
            <div className="w-32" />
          </div>

          {/* Step Indicator */}
          <div className="mt-4 flex items-center justify-center gap-0">
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
                    className={`mt-1 hidden text-xs font-medium sm:block ${
                      idx === currentStep ? 'text-charcoal-900' : 'text-charcoal-400'
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={`mx-1 mb-4 h-0.5 w-16 sm:w-24 ${
                      idx < currentStep ? 'bg-gold-500' : 'bg-charcoal-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="shadow-card rounded-2xl bg-white p-8">
              {/* Step 1: Choose Diamond */}
              {currentStep === 0 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-2 text-2xl font-bold">
                    Step 1: Choose Your Diamond
                  </h2>
                  <p className="text-charcoal-500 mb-8">
                    Select a diamond to set the foundation of your ring.
                  </p>

                  {selectedDiamond ? (
                    <div className="border-gold-500 bg-gold-50 rounded-xl border-2 p-6">
                      <div className="flex items-center gap-4">
                        <div className="bg-charcoal-100 flex h-20 w-20 items-center justify-center rounded-lg">
                          <div className="clip-diamond via-diamond-200 to-diamond-400 h-10 w-10 bg-gradient-to-br from-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-charcoal-900 font-semibold">
                            {selectedDiamond.carat.toFixed(2)}ct {selectedDiamond.shape}
                          </p>
                          <p className="text-charcoal-500 text-sm">
                            {selectedDiamond.color} / {selectedDiamond.clarity} /{' '}
                            {selectedDiamond.cut || 'N/A'} · {selectedDiamond.certificateLab}
                          </p>
                          <p className="text-gold-600 mt-1 font-bold">
                            {formatPrice(selectedDiamond.retailPrice)}
                          </p>
                        </div>
                        <Link
                          href="/diamonds"
                          className="text-charcoal-500 hover:text-gold-600 text-sm underline transition-colors"
                        >
                          Change
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="border-charcoal-300 rounded-xl border-2 border-dashed p-12 text-center">
                      <div className="clip-diamond bg-charcoal-100 mx-auto mb-4 h-16 w-16" />
                      <h3 className="text-charcoal-900 mb-2 font-semibold">No diamond selected</h3>
                      <p className="text-charcoal-500 mb-6 text-sm">
                        Browse our collection of 50,000+ certified diamonds
                      </p>
                      <Link
                        href="/diamonds"
                        className="bg-gold-500 hover:bg-gold-600 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-colors"
                      >
                        Browse Diamonds <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  )}

                  <button
                    onClick={nextStep}
                    disabled={!selectedDiamond}
                    className="bg-charcoal-900 hover:bg-charcoal-800 mt-8 w-full rounded-full py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Continue to Settings
                  </button>
                </div>
              )}

              {/* Step 2: Choose Setting */}
              {currentStep === 1 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-2 text-2xl font-bold">
                    Step 2: Choose Your Setting
                  </h2>
                  <p className="text-charcoal-500 mb-8">
                    Select the perfect ring setting for your diamond.
                  </p>

                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                    {ringSettings.map((setting) => (
                      <button
                        key={setting.id}
                        onClick={() => setSetting(setting as any)}
                        className={`group overflow-hidden rounded-xl border-2 text-left transition-all ${
                          selectedSetting?.id === setting.id
                            ? 'border-gold-500 shadow-luxury'
                            : 'border-charcoal-200 hover:border-gold-300'
                        }`}
                      >
                        <div className="bg-charcoal-50 relative aspect-square overflow-hidden">
                          <Image
                            src={setting.image}
                            alt={setting.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                          {selectedSetting?.id === setting.id && (
                            <div className="bg-gold-500 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-charcoal-900 text-sm font-semibold">{setting.name}</p>
                          <p className="text-charcoal-400 mb-1 text-xs">{setting.style}</p>
                          <p className="text-gold-600 text-sm font-bold">
                            + {formatPrice(setting.basePrice)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={prevStep}
                      className="border-charcoal-300 hover:border-charcoal-500 text-charcoal-700 flex-1 rounded-full border-2 py-4 font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!selectedSetting}
                      className="bg-charcoal-900 hover:bg-charcoal-800 flex-1 rounded-full py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continue to Customize
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Customize */}
              {currentStep === 2 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-2 text-2xl font-bold">
                    Step 3: Customize
                  </h2>
                  <p className="text-charcoal-500 mb-8">Personalize your ring to perfection.</p>

                  {/* Metal Type */}
                  <div className="mb-8">
                    <h3 className="text-charcoal-900 mb-4 font-semibold">Metal Type</h3>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                      {metalOptions.map((metal) => (
                        <button
                          key={metal.value}
                          onClick={() => setMetal(metal.value)}
                          className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                            metalType === metal.value
                              ? 'border-gold-500 bg-gold-50'
                              : 'border-charcoal-200 hover:border-charcoal-400'
                          }`}
                        >
                          <div
                            className="border-charcoal-300 h-8 w-8 rounded-full border shadow-sm"
                            style={{ backgroundColor: metal.color }}
                          />
                          <span className="text-charcoal-700 text-center text-xs font-medium">
                            {metal.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Ring Size */}
                  <div className="mb-8">
                    <h3 className="text-charcoal-900 mb-1 font-semibold">Ring Size (US)</h3>
                    <p className="text-charcoal-400 mb-4 text-sm">
                      Not sure of your size?{' '}
                      <Link href="/ring-size-guide" className="text-gold-600 underline">
                        Use our size guide
                      </Link>
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {ringSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSize(size)}
                          className={`h-12 w-12 rounded-lg border-2 text-sm font-medium transition-all ${
                            ringSizeUS === size
                              ? 'border-gold-500 bg-gold-500 text-white'
                              : 'border-charcoal-200 hover:border-charcoal-400 text-charcoal-700'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Engraving */}
                  <div className="mb-8">
                    <h3 className="text-charcoal-900 mb-4 font-semibold">
                      Engraving{' '}
                      <span className="text-charcoal-400 text-sm font-normal">(Optional)</span>
                    </h3>
                    <input
                      type="text"
                      maxLength={20}
                      value={engravingText || ''}
                      onChange={(e) =>
                        setEngraving(e.target.value, engravingFont || 'classic-script')
                      }
                      placeholder="e.g. Forever & Always"
                      className="border-charcoal-300 focus:border-gold-500 mb-4 w-full rounded-xl border px-4 py-3 transition-colors focus:outline-none"
                    />
                    {engravingText && (
                      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                        {engravingFonts.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => setEngraving(engravingText || '', font.value)}
                            className={`rounded-lg border-2 p-3 text-center transition-all ${
                              engravingFont === font.value
                                ? 'border-gold-500 bg-gold-50'
                                : 'border-charcoal-200 hover:border-charcoal-400'
                            }`}
                          >
                            <p className="text-charcoal-500 mb-1 text-xs">{font.label}</p>
                            <p className="text-sm font-medium">{engravingText || 'Preview'}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-charcoal-400 mt-2 flex items-center gap-1 text-xs">
                      <Info className="h-3 w-3" />
                      Max 20 characters · Engraving adds ₹2,500
                    </p>
                  </div>

                  <div className="mt-8 flex gap-3">
                    <button
                      onClick={prevStep}
                      className="border-charcoal-300 hover:border-charcoal-500 text-charcoal-700 flex-1 rounded-full border-2 py-4 font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={nextStep}
                      disabled={!ringSizeUS || !metalType}
                      className="bg-charcoal-900 hover:bg-charcoal-800 flex-1 rounded-full py-4 font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Preview Ring
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Preview */}
              {currentStep === 3 && (
                <div>
                  <h2 className="font-display text-charcoal-900 mb-2 text-2xl font-bold">
                    Step 4: Review Your Ring
                  </h2>
                  <p className="text-charcoal-500 mb-8">
                    Your custom ring is ready. Review and add to cart.
                  </p>

                  <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Diamond Summary */}
                    {selectedDiamond && (
                      <div className="border-charcoal-200 rounded-xl border p-4">
                        <p className="text-charcoal-400 mb-3 text-xs font-medium tracking-wide uppercase">
                          Diamond
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="bg-charcoal-100 flex h-12 w-12 items-center justify-center rounded-lg">
                            <div className="clip-diamond via-diamond-200 to-diamond-400 h-6 w-6 bg-gradient-to-br from-white" />
                          </div>
                          <div>
                            <p className="text-charcoal-900 text-sm font-semibold">
                              {selectedDiamond.carat.toFixed(2)}ct {selectedDiamond.shape}
                            </p>
                            <p className="text-charcoal-500 text-xs">
                              {selectedDiamond.color}/{selectedDiamond.clarity} ·{' '}
                              {selectedDiamond.certificateLab}
                            </p>
                          </div>
                        </div>
                        <div className="border-charcoal-100 mt-3 flex justify-between border-t pt-3">
                          <span className="text-charcoal-500 text-sm">Diamond price</span>
                          <span className="text-sm font-semibold">
                            {formatPrice(selectedDiamond.retailPrice)}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Setting Summary */}
                    {selectedSetting && (
                      <div className="border-charcoal-200 rounded-xl border p-4">
                        <p className="text-charcoal-400 mb-3 text-xs font-medium tracking-wide uppercase">
                          Setting
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="bg-charcoal-100 relative h-12 w-12 overflow-hidden rounded-lg">
                            <Image
                              src={(selectedSetting as any).image || '/placeholder.jpg'}
                              alt={selectedSetting.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <p className="text-charcoal-900 text-sm font-semibold">
                              {selectedSetting.name}
                            </p>
                            <p className="text-charcoal-500 text-xs">
                              {metalType} · Size {ringSizeUS}
                            </p>
                          </div>
                        </div>
                        <div className="border-charcoal-100 mt-3 flex justify-between border-t pt-3">
                          <span className="text-charcoal-500 text-sm">Setting price</span>
                          <span className="text-sm font-semibold">
                            {formatPrice(selectedSetting.basePrice)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price Breakdown */}
                  <div className="bg-charcoal-50 mb-8 rounded-xl p-6">
                    <h3 className="text-charcoal-900 mb-4 font-semibold">Price Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-500">Diamond</span>
                        <span>{formatPrice(selectedDiamond?.retailPrice || 0)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-500">Setting</span>
                        <span>{formatPrice(selectedSetting?.basePrice || 0)}</span>
                      </div>
                      {engravingText && (
                        <div className="flex justify-between text-sm">
                          <span className="text-charcoal-500">Engraving</span>
                          <span>{formatPrice(2500)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-500">GST (3%)</span>
                        <span>{formatPrice(totalPrice * 0.03)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-charcoal-500">Shipping</span>
                        <span className="text-emerald-600">Free</span>
                      </div>
                      <div className="border-charcoal-200 flex justify-between border-t pt-3 text-lg font-bold">
                        <span>Total</span>
                        <span className="text-gold-600">{formatPrice(totalPrice * 1.03)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={prevStep}
                      className="border-charcoal-300 hover:border-charcoal-500 text-charcoal-700 flex-1 rounded-full border-2 py-4 font-semibold transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="bg-gold-500 hover:bg-gold-600 flex-1 rounded-full py-4 font-semibold text-white transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Summary Panel */}
          <div className="lg:col-span-1">
            <div className="shadow-card sticky top-32 rounded-2xl bg-white p-6">
              <h3 className="font-display text-charcoal-900 mb-6 text-lg font-bold">
                Ring Summary
              </h3>

              <div className="space-y-4">
                <div className="border-charcoal-100 flex justify-between border-b pb-4 text-sm">
                  <span className="text-charcoal-500">Diamond</span>
                  <span className="text-right font-medium">
                    {selectedDiamond
                      ? `${selectedDiamond.carat.toFixed(2)}ct ${selectedDiamond.shape}`
                      : 'Not selected'}
                  </span>
                </div>
                <div className="border-charcoal-100 flex justify-between border-b pb-4 text-sm">
                  <span className="text-charcoal-500">Setting</span>
                  <span className="text-right font-medium">
                    {selectedSetting ? selectedSetting.name : 'Not selected'}
                  </span>
                </div>
                <div className="border-charcoal-100 flex justify-between border-b pb-4 text-sm">
                  <span className="text-charcoal-500">Metal</span>
                  <span className="font-medium">
                    {metalType
                      ? metalOptions.find((m) => m.value === metalType)?.label || metalType
                      : '—'}
                  </span>
                </div>
                <div className="border-charcoal-100 flex justify-between border-b pb-4 text-sm">
                  <span className="text-charcoal-500">Ring Size</span>
                  <span className="font-medium">{ringSizeUS ? `US ${ringSizeUS}` : '—'}</span>
                </div>
                {engravingText && (
                  <div className="border-charcoal-100 flex justify-between border-b pb-4 text-sm">
                    <span className="text-charcoal-500">Engraving</span>
                    <span className="font-medium italic">"{engravingText}"</span>
                  </div>
                )}
              </div>

              <div className="border-charcoal-200 mt-6 border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-charcoal-900 font-semibold">Estimated Total</span>
                  <span className="font-display text-gold-600 text-xl font-bold">
                    {totalPrice > 0 ? formatPrice(totalPrice * 1.03) : '—'}
                  </span>
                </div>
                <p className="text-charcoal-400 mt-1 text-xs">Includes GST</p>
              </div>

              <div className="text-charcoal-400 mt-4 space-y-1 text-xs">
                <p>✓ Free insured delivery in 7-10 business days</p>
                <p>✓ 30-day hassle-free returns</p>
                <p>✓ Lifetime warranty on craftsmanship</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BuildYourRingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">Loading ring builder...</div>
      }
    >
      <RingBuilderContent />
    </Suspense>
  );
}
