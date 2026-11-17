/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { FlameLogo } from './FlameLogo';

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

interface FrontPageSplashProps {
  onEnter: () => void;
}

export function FrontPageSplash({ onEnter }: FrontPageSplashProps) {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const delayMs = shouldReduceMotion ? 500 : 950;
    const timer = window.setTimeout(() => {
      onEnter();
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [onEnter, shouldReduceMotion]);

  return (
    <motion.main
      key="front-page-splash"
      initial={shouldReduceMotion ? false : { opacity: 1 }}
      exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.18, ease: EASE_OUT_EXPO }}
      className="relative min-h-dvh w-full overflow-hidden bg-[#070406] flex flex-col items-center justify-center px-6 select-none transform-gpu"
    >
      {/* Ambient radial lighting matching the deep obsidian-plum & crimson vignette */}
      <motion.div
        aria-hidden="true"
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.32, ease: EASE_OUT_EXPO }}
        className="pointer-events-none absolute inset-0 transform-gpu"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(168, 22, 66, 0.25) 0%, rgba(92, 12, 38, 0.13) 28%, rgba(28, 8, 16, 0.06) 52%, rgba(7, 4, 6, 0) 74%)',
        }}
      />

      {/* Centered Front Page Lockup */}
      <section
        aria-label="Sanskurti Exclusive Services Welcome"
        className="relative z-10 flex flex-col items-center text-center max-w-xl w-full"
      >
        {/* Step 1: Glowing Flame Logo Appears First */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.78, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.24, ease: EASE_OUT_EXPO }}
          className="relative flex items-center justify-center mb-7 transform-gpu will-change-transform"
        >
          <div
            aria-hidden="true"
            className="absolute h-20 w-20 rounded-full blur-xl opacity-60"
            style={{
              background:
                'radial-gradient(circle, rgba(255, 36, 98, 0.85) 0%, rgba(255, 36, 98, 0) 70%)',
            }}
          />
          <FlameLogo size={46} className="relative" />
        </motion.div>

        {/* Step 2: WELCOME TO */}
        <motion.p
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, delay: 0.1, ease: EASE_OUT_EXPO }}
          className="font-display-serif text-[15px] sm:text-[18px] font-medium uppercase tracking-[0.38em] text-[#9ea3b0] pl-[0.38em] mb-2 transform-gpu"
        >
          WELCOME TO
        </motion.p>

        {/* Step 3: Sanskurti Wordmark */}
        <motion.h1
          initial={shouldReduceMotion ? false : { opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, delay: 0.16, ease: EASE_OUT_EXPO }}
          className="font-display-serif text-[56px] sm:text-[72px] md:text-[80px] font-bold leading-[1.08] tracking-[-0.01em] sanskruti-gradient-text mb-6 transform-gpu"
        >
          Sanskurti
        </motion.h1>

        {/* Step 4: EXCLUSIVE SERVICES Label */}
        <motion.div
          initial={shouldReduceMotion ? false : { opacity: 0, y: 6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.22, delay: 0.22, ease: EASE_OUT_EXPO }}
          className="font-sans-ui inline-flex items-center justify-center rounded-full border border-[#8e5c15] bg-[#1e1206]/75 px-7 py-2.5 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.22em] text-[#eab308] whitespace-nowrap shrink-0 shadow-[0_0_20px_rgba(234,179,8,0.1)] transform-gpu"
        >
          EXCLUSIVE SERVICES
        </motion.div>

        {/* Step 5: Pink-to-Gold Gradient Loading Bar */}
        <motion.div
          aria-hidden="true"
          initial={shouldReduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.16, delay: 0.25 }}
          className="mt-8 w-[196px] sm:w-[224px] h-[3.5px] rounded-full bg-white/[0.08] overflow-hidden"
        >
          <motion.div
            initial={shouldReduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.56, delay: 0.27, ease: EASE_OUT_EXPO }}
            style={{
              transformOrigin: 'left center',
              background:
                'linear-gradient(90deg, #ff2466 0%, #ff5a4e 52%, #f59e0b 100%)',
              boxShadow: '0 0 10px rgba(255, 42, 102, 0.45)',
            }}
            className="h-full w-full rounded-full transform-gpu will-change-transform"
          />
        </motion.div>
      </section>
    </motion.main>
  );
}
