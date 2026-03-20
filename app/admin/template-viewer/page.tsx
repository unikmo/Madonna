'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import type { DeliveryType, Quantity } from '@/lib/code-generator';
import { generateMomentCode, parseMomentCode } from '@/lib/code-generator';
import { buildMomentCodesEmailHtml } from '@/lib/moment-code-email-html';

function createSampleCodes(quantity: Quantity, deliveryType: DeliveryType): string[] {
  return Array.from({ length: quantity }, () => generateMomentCode(quantity, deliveryType));
}

export default function TemplateViewerPage() {
  const [quantity, setQuantity] = useState<Quantity>(1);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('digital');
  const [codes, setCodes] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Avoid hydration mismatch: never generate random codes during the initial SSR render.
  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    setCodes(createSampleCodes(quantity, deliveryType));
  }, [hasMounted, quantity, deliveryType]);

  const handleSetTier = (q: Quantity) => setQuantity(q);

  const handleGenerate = () => setCodes(createSampleCodes(quantity, deliveryType));

  const handleCopy = async (code: string, index: number) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for older browsers.
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
      }
      setCopiedIndex(index);
      window.setTimeout(() => setCopiedIndex(null), 1500);
    } catch {
      // Non-blocking: copying is best-effort.
    }
  };

  const emailPreviewHtml = useMemo(() => {
    if (!hasMounted || codes.length === 0) return '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const { html } = buildMomentCodesEmailHtml({
      codes,
      orderId: '1001',
      baseUrl,
      deliveryType,
    });
    return html;
  }, [codes, deliveryType, hasMounted]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#2D2926]">Email Template Preview</h1>
              <p className="text-sm text-[#2D2926]/60 mt-1">This preview uses the exact same HTML used in sent emails.</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerate}
              className="px-4 py-2 rounded-full bg-[#2D2926] text-[#FDF9F5] text-xs font-medium tracking-wide uppercase hover:bg-[#1E1B18] transition-colors"
            >
              Generate random {quantity} code{quantity === 1 ? '' : 's'}
            </motion.button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex rounded-2xl border border-[#D3C7BB] bg-white p-1">
              <button
                type="button"
                onClick={() => handleSetTier(1)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                  quantity === 1 ? 'bg-[#2D2926] text-[#FDF9F5]' : 'text-[#2D2926]/75 hover:bg-[#F5ECE3]'
                }`}
              >
                1 Key
              </button>
              <button
                type="button"
                onClick={() => handleSetTier(4)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                  quantity === 4 ? 'bg-[#2D2926] text-[#FDF9F5]' : 'text-[#2D2926]/75 hover:bg-[#F5ECE3]'
                }`}
              >
                4 Keys
              </button>
              <button
                type="button"
                onClick={() => handleSetTier(7)}
                className={`px-4 py-2 rounded-2xl text-sm font-medium transition-colors ${
                  quantity === 7 ? 'bg-[#2D2926] text-[#FDF9F5]' : 'text-[#2D2926]/75 hover:bg-[#F5ECE3]'
                }`}
              >
                7 Keys
              </button>
            </div>

            <div className="flex-1 min-w-[240px]">
              <label className="block text-xs font-medium text-[#2D2926]/70 mb-2">Delivery type</label>
              <select
                value={deliveryType}
                onChange={(e) => {
                  const next = e.target.value as DeliveryType;
                  setDeliveryType(next);
                }}
                className="w-full px-4 py-2 rounded-xl border border-[#D3C7BB] bg-white text-[#2D2926] text-sm focus:outline-none focus:ring-2 focus:ring-[#2D2926]/20"
              >
                <option value="digital">Digital</option>
                <option value="physical">Physical</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#E3DAD0] bg-white shadow-sm p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-semibold text-[#2D2926]">Exact sent-email preview</p>
              <p className="text-xs text-[#2D2926]/60 mt-1">Same builder as `sendMomentCodesEmail`.</p>
            </div>
          </div>

          {emailPreviewHtml ? (
            <iframe
              title="Email preview"
              srcDoc={emailPreviewHtml}
              className="w-full h-[920px] rounded-xl border border-[#E3DAD0] bg-white"
            />
          ) : (
            <div className="rounded-xl border border-[#E3DAD0] bg-[#FDF9F5] p-8 text-[#2D2926]/60">
              Generating preview...
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-[#E3DAD0] bg-white shadow-sm p-4 sm:p-6">
          <p className="text-sm font-semibold text-[#2D2926] mb-3">Sample Moment Code(s)</p>

          <div className="space-y-3">
            {codes.length === 0 ? (
              <p className="text-sm text-[#2D2926]/60">Generating sample codes…</p>
            ) : (
              codes.map((code, index) => {
                const parsed = parseMomentCode(code);
                return (
                  <motion.div
                    key={`${code}-${index}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-xl border border-[#E3DAD0] bg-[#FDF9F5] p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-[#2D2926]/70">Code {index + 1}</p>
                        <p className="font-mono text-sm text-[#2D2926] break-all">{code}</p>
                        {parsed && (
                          <div className="text-xs text-[#2D2926]/60 mt-1">
                            Qty: {parsed.quantity} · Type: {parsed.deliveryType}
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(code, index)}
                        className="shrink-0 px-3 py-1 rounded-full border border-[#D3C7BB] text-[#2D2926] text-xs hover:bg-[#F5ECE3] transition-colors"
                      >
                        {copiedIndex === index ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

