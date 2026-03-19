'use client';

import { motion, AnimatePresence } from 'framer-motion';

export type AnimatedMomentModalVariant = 'celebrate' | 'gentle' | 'alert';

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  emoji: string;
  variant?: AnimatedMomentModalVariant;
  /** Primary button label */
  confirmLabel?: string;
};

const VARIANT_STYLES: Record<
  AnimatedMomentModalVariant,
  { glow: string; ring: string; cardBorder: string; particle: string[] }
> = {
  celebrate: {
    glow: 'radial-gradient(circle at 50% 45%, rgba(191,162,128,0.45) 0%, rgba(233,220,207,0.2) 35%, transparent 65%)',
    ring: 'rgba(191,162,128,0.55)',
    cardBorder: 'border-[#D3C7BB]',
    particle: ['#2D2926', '#BFA280', '#E9DCCF', '#C4A574'],
  },
  gentle: {
    glow: 'radial-gradient(circle at 50% 45%, rgba(191,162,128,0.35) 0%, rgba(253,249,245,0.15) 40%, transparent 68%)',
    ring: 'rgba(45,41,38,0.22)',
    cardBorder: 'border-[#D3C7BB]',
    particle: ['#BFA280', '#2D2926', '#E9DCCF'],
  },
  alert: {
    glow: 'radial-gradient(circle at 50% 45%, rgba(180,120,90,0.28) 0%, rgba(253,249,245,0.12) 42%, transparent 68%)',
    ring: 'rgba(176,141,87,0.4)',
    cardBorder: 'border-[#D3C7BB]',
    particle: ['#b08d57', '#2D2926', '#E9DCCF', '#C9A227'],
  },
};

/**
 * Full-screen overlay with soft glow + sparkles (firework-adjacent vibe) and a spring-animated card.
 */
export function AnimatedMomentModal({
  open,
  onClose,
  title,
  message,
  emoji,
  variant = 'gentle',
  confirmLabel = 'Okay',
}: Props) {
  const vs = VARIANT_STYLES[variant];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[#2D2926]/40 backdrop-blur-[3px]"
          />

          {/* Ambient glow (like celebration backdrop) */}
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: [0.92, 1.05, 1], opacity: [0, 0.95, 0.75] }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="pointer-events-none absolute inset-0"
            style={{ background: vs.glow }}
          />

          {/* Soft burst rings */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.span
              key={`modal-ring-${i}`}
              initial={{ scale: 0.35, opacity: 0.45 }}
              animate={{ scale: [0.4, 1.6 + i * 0.15], opacity: [0.35, 0.12, 0] }}
              transition={{ duration: 1.1, delay: i * 0.08, ease: 'easeOut' }}
              className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full border-2"
              style={{
                width: 100 + i * 28,
                height: 100 + i * 28,
                borderColor: vs.ring,
              }}
            />
          ))}

          {/* Sparkle particles */}
          {Array.from({ length: 36 }).map((_, i) => {
            const angle = ((i * 137.5) % 360) * (Math.PI / 180);
            const r = 8 + (i % 10) * 2.2;
            const dx = Math.cos(angle) * r;
            const dy = Math.sin(angle) * r;
            const color = vs.particle[i % vs.particle.length];
            return (
              <motion.span
                key={`spark-${i}`}
                initial={{ left: '50%', top: '42%', x: '-50%', y: '-50%', scale: 0.2, opacity: 0 }}
                animate={{
                  left: `calc(50% + ${dx}vw)`,
                  top: `calc(42% + ${dy}vh)`,
                  x: '-50%',
                  y: '-50%',
                  scale: [0.3, 1, 0.6],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 0.75 + (i % 5) * 0.06,
                  delay: (i % 12) * 0.04,
                  ease: 'easeOut',
                }}
                className="pointer-events-none absolute z-[1] rounded-full"
                style={{
                  width: i % 4 === 0 ? 8 : 6,
                  height: i % 4 === 0 ? 8 : 6,
                  background: color,
                  boxShadow: `0 0 12px ${color}88`,
                }}
              />
            );
          })}

          {/* Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="moment-modal-title"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className={`relative z-[2] w-full max-w-md rounded-2xl border-2 ${vs.cardBorder} bg-[#FBF7F2]/98 shadow-[0_24px_64px_rgba(45,41,38,0.18)] overflow-hidden`}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="absolute inset-0 opacity-[0.35] pointer-events-none"
              style={{
                background:
                  'linear-gradient(135deg, rgba(239,232,229,0.9) 0%, rgba(253,249,245,0.4) 50%, rgba(233,220,207,0.25) 100%)',
              }}
            />
            <div className="relative px-6 py-7 sm:px-8 sm:py-8 text-center">
              <motion.div
                animate={
                  variant === 'celebrate'
                    ? { rotate: [0, -6, 6, -4, 4, 0], scale: [1, 1.12, 1.05, 1] }
                    : { rotate: [0, -5, 5, 0], scale: [1, 1.06, 1] }
                }
                transition={{ duration: variant === 'celebrate' ? 0.85 : 0.65, ease: 'easeInOut' }}
                className="text-5xl sm:text-6xl leading-none select-none"
              >
                {emoji}
              </motion.div>
              <h2
                id="moment-modal-title"
                className="mt-4 font-serif text-xl sm:text-2xl text-[#2D2926] tracking-tight"
              >
                {title}
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#2D2926]/78 leading-relaxed">{message}</p>
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="mt-7 w-full sm:w-auto min-w-[160px] px-8 py-3 rounded-full bg-[#2D2926] text-[#FDF9F5] text-sm font-semibold tracking-wide shadow-md hover:bg-[#1E1B18] transition-colors"
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
