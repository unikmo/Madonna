'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { DeliveryType, Quantity } from '@/lib/code-generator';
import { generateMomentCode, parseMomentCode } from '@/lib/code-generator';

type Template = {
  title: string;
  description: string;
  frontImageUrl: string;
  // QR overlay placement (center point) as % of the rendered image.
  // `sizeXPct` / `sizeYPct` are QR overlay size as % of rendered image width/height.
  qr: {
    leftPct: number;
    topPct: number;
    sizeXPct: number;
    sizeYPct: number;
  };
  qrBgColor: string; // hex without '#', used for qrserver bgcolor param
};

const TEMPLATE_BY_QUANTITY: Record<Quantity, Template> = {
  1: {
    title: 'Single Key Template',
    description: '1 Moment Code template preview (image-based)',
    // As you instructed: use your provided staged image for tier 1 preview
    frontImageUrl: '/cardfrontsite_staged.jpg',
    // Static values from your devtools.
    qr: { leftPct: 48.9191, topPct: 43.1995, sizeXPct: 13.6923, sizeYPct: 23.6923 },
    qrBgColor: 'E7E2DA',
  },
  4: {
    title: '4-Key Bundle Template',
    description: '4 Moment Codes template preview (image-based)',
    // As you instructed: tier 4 uses `cardfrontsite4.png`
    frontImageUrl: '/cardfrontsite4.png',
    // Static values from your devtools.
    qr: { leftPct: 60.0117, topPct: 48.2012, sizeXPct: 16.6923, sizeYPct: 23.6923 },
    qrBgColor: 'F1ECEA',
  },
  7: {
    title: '7-Key Vault Template',
    description: '7 Moment Codes template preview (image-based)',
    frontImageUrl: '/cardfrontsite7.png',
    // Static values from your devtools.
    qr: { leftPct: 59.5326, topPct: 49.5918, sizeXPct: 14.6923, sizeYPct: 21.6923 },
    qrBgColor: 'F1ECE8',
  },
};

function createSampleCodes(quantity: Quantity, deliveryType: DeliveryType): string[] {
  return Array.from({ length: quantity }, () => generateMomentCode(quantity, deliveryType));
}

export default function TemplateViewerPage() {
  const [quantity, setQuantity] = useState<Quantity>(1);
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('digital');
  const [codes, setCodes] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const template = useMemo(() => TEMPLATE_BY_QUANTITY[quantity], [quantity]);

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

  const firstCode = codes[0] || '';
  const qrUrlForFirstCode = useMemo(() => {
    if (!firstCode) return '';
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
    const unlockUrlForFirstCode = `${baseUrl}/unlock?code=${encodeURIComponent(firstCode)}`;
    // Force QR background to match your template background.
    // qrserver supports `bgcolor` + `color` hex values (without '#').
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
      unlockUrlForFirstCode
    )}&bgcolor=${template.qrBgColor}&color=2D2926`;
  }, [firstCode, template.qrBgColor]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="rounded-2xl p-6 border border-[#E3DAD0] bg-white shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#2D2926]">{template.title}</h1>
              <p className="text-sm text-[#2D2926]/60 mt-1">{template.description}</p>
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
                <option value="split">Split</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-[#E3DAD0] bg-white shadow-sm p-4 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={quantity}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm font-semibold text-[#2D2926]">Template preview</p>
                  <p className="text-xs text-[#2D2926]/60 mt-1">
                    {deliveryType === 'digital'
                      ? 'Digital card layout preview'
                      : deliveryType === 'physical'
                        ? 'Physical card layout preview'
                        : 'Split delivery preview'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="rounded-xl overflow-hidden border border-[#E3DAD0] bg-[#FDF9F5]">
                  <div className="p-3 border-b border-[#E3DAD0]">
                    <p className="text-xs font-semibold text-[#2D2926]/70">Front</p>
                  </div>
                  <div className="relative">
                    <img
                      src={template.frontImageUrl}
                      alt={`${quantity}-key front`}
                      className="w-full h-auto block"
                    />
                    {/* Replace the printed QR in the image with a dynamic QR (redirects to /unlock) */}
                    {codes.length > 0 && hasMounted && qrUrlForFirstCode && (
                      <img
                        key={`qr-${quantity}-${codes[0] || ''}`}
                        src={qrUrlForFirstCode}
                        alt="QR to unlock"
                      className="absolute z-10 bg-[#E7E2DA]"
                        data-qr-left={`${template.qr.leftPct}%`}
                        data-qr-top={`${template.qr.topPct}%`}
                        data-qr-width={`${template.qr.sizeXPct}%`}
                        style={{
                          left: `${template.qr.leftPct}%`,
                          top: `${template.qr.topPct}%`,
                          width: `${template.qr.sizeXPct}%`,
                          height: `${template.qr.sizeYPct}%`,
                          transform: 'translate(-50%, -50%)',
                          border: 'none',
                          boxSizing: 'border-box',
                        backgroundColor: '#E7E2DA',
                          // Keep it crisp-ish inside various clients
                          imageRendering: 'auto',
                        }}
                      />
                    )}
                  </div>
                  <div className="mt-3 text-xs text-[#2D2926]/60">
                    QR overlay for tier {quantity}: left {template.qr.leftPct}%, top {template.qr.topPct}%, width {template.qr.sizeXPct}%.
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
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

      {/* Email preview (uses the same tier image + QR redirect overlay) */}
      <div className="rounded-2xl border border-[#E3DAD0] bg-[#E7E2DA] shadow-sm p-4 sm:p-6">
        <p className="text-sm font-semibold text-[#2D2926] mb-3">Email preview</p>
        <div className="max-w-[620px] mx-auto">
          <div className="overflow-hidden rounded-2xl border border-[#E3DAD0] bg-white">
            <div className="px-6 py-5 text-center" style={{ background: '#EFE8E5' }}>
              <div className="text-2xl font-bold text-[#2D2926] font-serif">UNIKMO</div>
              <div className="text-sm text-[#2D2926]/80 mt-1">Your Moment Codes Are Ready! 🎁</div>
            </div>

            <div className="p-4 sm:p-6">
              <div className="relative">
                <img
                  src={template.frontImageUrl}
                  alt={`${quantity}-key email product`}
                  className="w-full h-auto rounded-xl border border-[#E3DAD0] bg-white block"
                />

                {codes.length > 0 && hasMounted && qrUrlForFirstCode && (
                  <img
                    key={`email-qr-${quantity}-${codes[0] || ''}`}
                    src={qrUrlForFirstCode}
                    alt="QR to unlock"
                    className="absolute z-10 bg-[#E7E2DA]"
                    style={{
                      left: `${template.qr.leftPct}%`,
                      top: `${template.qr.topPct}%`,
                      width: `${template.qr.sizeXPct}%`,
                      height: `${template.qr.sizeYPct}%`,
                      transform: 'translate(-50%, -50%)',
                      border: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#E7E2DA',
                      imageRendering: 'auto',
                    }}
                  />
                )}
              </div>

              <div className="mt-4 text-center font-semibold text-[#2D2926]">Your Digital Card</div>

              <div className="mt-3 rounded-xl bg-[#FBF7F2] border border-[#E3DAD0] p-4">
                <div className="text-[#b08d57] text-[11px] uppercase tracking-[0.12em] font-semibold mb-3">
                  Your moment code{codes.length === 1 ? '' : 's'}
                </div>

                {codes.length === 0 ? (
                  <div className="text-sm text-[#2D2926]/60">Generating…</div>
                ) : (
                  <div className="space-y-3">
                    {codes.map((code, index) => (
                      <div key={`${code}-email-${index}`} className="text-center">
                        {codes.length > 1 && (
                          <div className="text-[11px] uppercase tracking-[0.12em] text-[#b08d57] font-semibold mb-2">
                            Card {index + 1}
                          </div>
                        )}
                        <div className="font-mono text-lg text-[#2D2926] break-all">{code}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-3 text-xs text-[#2D2926]/60 leading-relaxed">
                  Click the QR to unlock your moment.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

