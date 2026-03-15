'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, GitCompareArrows } from 'lucide-react';
import type { Diamond } from '@diamond-factory/types';
import { formatPrice, formatCarat } from '@/lib/utils';
import { useDiamondComparisonStore } from '@/stores/diamond-comparison.store';
import Link from 'next/link';

const comparisonFields: { key: keyof Diamond | string; label: string }[] = [
  { key: 'shape', label: 'Shape' },
  { key: 'carat', label: 'Carat' },
  { key: 'color', label: 'Color' },
  { key: 'clarity', label: 'Clarity' },
  { key: 'cut', label: 'Cut' },
  { key: 'polish', label: 'Polish' },
  { key: 'symmetry', label: 'Symmetry' },
  { key: 'depthPct', label: 'Depth %' },
  { key: 'tablePct', label: 'Table %' },
  { key: 'lwRatio', label: 'L/W Ratio' },
  { key: 'certificateLab', label: 'Certificate' },
  { key: 'fluorescence', label: 'Fluorescence' },
  { key: 'labGrown', label: 'Type' },
  { key: 'eyeClean', label: 'Eye Clean' },
  { key: 'retailPrice', label: 'Price' },
];

function getDiamondValue(diamond: Diamond, key: string): string {
  const val = (diamond as unknown as Record<string, unknown>)[key];
  if (val === undefined || val === null) return '—';
  if (key === 'carat') return formatCarat(val as number);
  if (key === 'retailPrice') return formatPrice(val as number);
  if (key === 'depthPct' || key === 'tablePct') return `${val}%`;
  if (key === 'lwRatio') return (val as number).toFixed(2);
  if (key === 'labGrown') return val ? 'Lab Grown' : 'Natural';
  if (key === 'eyeClean') return val ? 'Yes' : 'No';
  return String(val);
}

function isValueDifferent(diamonds: Diamond[], key: string): boolean {
  if (diamonds.length < 2) return false;
  const values = diamonds.map((d) => getDiamondValue(d, key));
  return new Set(values).size > 1;
}

export function DiamondComparison() {
  const { diamonds, removeDiamond, clearAll, isOpen, openComparison, closeComparison } =
    useDiamondComparisonStore();

  if (diamonds.length === 0) return null;

  return (
    <>
      {/* Bottom bar */}
      <div className="bg-charcoal-950 fixed right-0 bottom-0 left-0 z-50 px-4 py-3 text-white shadow-2xl">
        <div className="container mx-auto flex items-center gap-4">
          <span className="text-charcoal-300 shrink-0 text-sm font-medium">
            Comparing ({diamonds.length}/4):
          </span>

          <div className="flex flex-1 items-center gap-3 overflow-x-auto pb-1">
            {diamonds.map((diamond) => (
              <div
                key={diamond.id}
                className="bg-charcoal-800 flex shrink-0 items-center gap-2 rounded-lg px-3 py-1.5"
              >
                {diamond.images[0] && (
                  <div className="h-6 w-6 shrink-0 overflow-hidden rounded">
                    <Image
                      src={diamond.images[0].url}
                      alt={diamond.shape}
                      width={24}
                      height={24}
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="text-sm text-white">
                  {formatCarat(diamond.carat)} {diamond.shape}
                </span>
                <button
                  onClick={() => removeDiamond(diamond.id)}
                  className="text-charcoal-400 transition-colors hover:text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}

            {diamonds.length < 4 && (
              <Link
                href="/diamonds"
                className="border-charcoal-600 text-charcoal-400 hover:border-gold-500 hover:text-gold-400 flex h-9 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed text-xs transition-colors"
              >
                + Add
              </Link>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={clearAll}
              className="text-charcoal-400 border-charcoal-700 hover:border-charcoal-500 rounded-lg border px-3 py-1.5 text-xs transition-colors hover:text-white"
            >
              Clear
            </button>
            <button
              onClick={openComparison}
              disabled={diamonds.length < 2}
              className="bg-gold-500 hover:bg-gold-400 flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            >
              <GitCompareArrows className="h-4 w-4" />
              Compare
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto p-4 pt-8">
          <div className="absolute inset-0 bg-black/70" onClick={closeComparison} />
          <div className="relative my-8 w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="border-charcoal-100 flex items-center justify-between border-b p-6">
              <h2 className="font-display text-charcoal-900 text-xl font-bold">
                Diamond Comparison
              </h2>
              <button
                onClick={closeComparison}
                className="text-charcoal-400 hover:text-charcoal-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-charcoal-100 border-b">
                    <th className="text-charcoal-500 bg-charcoal-50 w-36 p-4 text-left text-sm font-semibold">
                      Attribute
                    </th>
                    {diamonds.map((diamond) => (
                      <th key={diamond.id} className="min-w-[200px] p-4 text-center">
                        {/* Diamond image */}
                        <div className="bg-charcoal-50 relative mx-auto mb-2 h-20 w-20 overflow-hidden rounded-lg">
                          {diamond.images[0] ? (
                            <Image
                              src={diamond.images[0].url}
                              alt={diamond.shape}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="clip-diamond via-diamond-200 to-diamond-400 h-10 w-10 bg-gradient-to-br from-white" />
                            </div>
                          )}
                        </div>
                        <p className="text-charcoal-900 text-sm font-semibold">
                          {formatCarat(diamond.carat)} {diamond.shape}
                        </p>
                        <p className="text-gold-600 mt-1 text-sm font-bold">
                          {formatPrice(diamond.retailPrice)}
                        </p>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparisonFields.map((field) => {
                    const isDifferent = isValueDifferent(diamonds, field.key);
                    return (
                      <tr
                        key={field.key}
                        className={`border-charcoal-100 border-b ${
                          isDifferent ? 'bg-yellow-50' : ''
                        }`}
                      >
                        <td className="text-charcoal-500 bg-charcoal-50 p-4 text-sm font-medium">
                          {field.label}
                          {isDifferent && <span className="ml-1 text-xs text-orange-500">↕</span>}
                        </td>
                        {diamonds.map((diamond) => (
                          <td
                            key={diamond.id}
                            className="text-charcoal-900 p-4 text-center text-sm font-medium"
                          >
                            {getDiamondValue(diamond, field.key)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* CTAs */}
            <div className="bg-charcoal-50 border-charcoal-100 border-t p-6">
              <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `144px repeat(${diamonds.length}, 1fr)` }}
              >
                <div />
                {diamonds.map((diamond) => (
                  <div key={diamond.id} className="text-center">
                    <Link
                      href={`/build-your-ring?diamond=${diamond.id}`}
                      onClick={closeComparison}
                      className="bg-gold-500 hover:bg-gold-600 block w-full rounded-full py-2.5 text-sm font-semibold text-white transition-colors"
                    >
                      Choose This
                    </Link>
                  </div>
                ))}
              </div>
              <p className="text-charcoal-400 mt-3 text-center text-xs">
                Differences highlighted in yellow
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
