"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { Variants } from "motion/react";

const cardShadowRest =
  "0px 1px 2px rgba(15, 23, 42, 0.06), 0px 8px 24px rgba(15, 23, 42, 0.08)";
const cardShadowHover =
  "0px 8px 16px rgba(15, 23, 42, 0.10), 0px 24px 48px rgba(79, 70, 229, 0.12)";

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
    boxShadow: cardShadowRest,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    boxShadow: cardShadowRest,
    transition: {
      duration: 0.32,
      ease: [0, 0, 0.2, 1],
    },
  },
  hover: {
    y: -6,
    scale: 1.01,
    boxShadow: cardShadowHover,
    transition: {
      duration: 0.22,
      ease: [0, 0, 0.2, 1],
    },
  },
};

const cardReducedVariants: Variants = {
  hidden: { opacity: 0, boxShadow: cardShadowRest },
  visible: { opacity: 1, boxShadow: cardShadowRest },
  hover: { boxShadow: cardShadowHover },
};

const glowVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 0.2,
    scale: 1,
    transition: { duration: 0.35, ease: [0, 0, 0.2, 1] },
  },
  hover: {
    opacity: 0.6,
    scale: 1.2,
    transition: { duration: 0.25, ease: [0, 0, 0.2, 1] },
  },
};

const glowReducedVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.2 },
  hover: { opacity: 0.4 },
};

const accentVariants: Variants = {
  hidden: { width: 0, opacity: 0 },
  visible: {
    width: 24,
    opacity: 0.4,
    transition: { duration: 0.28, ease: [0, 0, 0.2, 1] },
  },
  hover: {
    width: 52,
    opacity: 0.9,
    transition: { duration: 0.22, ease: [0, 0, 0.2, 1] },
  },
};

const accentReducedVariants: Variants = {
  hidden: { width: 24, opacity: 0.4 },
  visible: { width: 24, opacity: 0.4 },
  hover: { width: 24, opacity: 0.7 },
};

export interface PricingCardProps {
  title?: string;
  body?: string;
  className?: string;
}

export function PricingCard({
  title = "You have full control",
  body = "From design elements to functionality, you have complete control to create a unique and personalized experience.",
  className = "",
}: PricingCardProps) {
  const shouldReduceMotion = useReducedMotion();
  const cardVars = shouldReduceMotion ? cardReducedVariants : cardVariants;
  const glowVars = shouldReduceMotion ? glowReducedVariants : glowVariants;
  const cornerVars = shouldReduceMotion ? accentReducedVariants : accentVariants;

  return (
    <m.div
      initial={shouldReduceMotion ? "visible" : "hidden"}
      animate="visible"
      whileHover="hover"
      variants={cardVars}
      className={`relative z-0 w-full max-w-sm rounded-3xl border border-neutral-200/80 bg-white px-10 py-12 text-center ${className}`}
      style={{ willChange: "transform" }}
    >
      <m.div
        aria-hidden="true"
        variants={glowVars}
        className="pointer-events-none absolute -inset-10 z-[-1] rounded-[36px] bg-linear-to-br from-indigo-500/35 via-purple-500/25 to-sky-500/35 blur-3xl"
      />

      <m.span
        aria-hidden="true"
        variants={cornerVars}
        className="absolute right-6 top-6 h-1 rounded-full bg-linear-to-r from-indigo-400/60 via-violet-400/80 to-sky-400/70"
      />

      <div className="relative z-10 flex flex-col items-center gap-5">
        <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200/70 bg-white shadow-[0_8px_20px_rgba(15,23,42,0.06)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(15,23,42,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(15,23,42,0.08) 1px, transparent 1px)",
              backgroundSize: "14px 14px",
              backgroundPosition: "center",
            }}
          />
          <svg
            className="relative z-10 h-8 w-8 text-neutral-800"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="7" x2="20" y2="7" />
            <circle cx="10" cy="7" r="2" />
            <line x1="4" y1="17" x2="20" y2="17" />
            <circle cx="14" cy="17" r="2" />
          </svg>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-neutral-900">{title}</h3>
          <p className="text-sm leading-relaxed text-neutral-500">{body}</p>
        </div>
      </div>
    </m.div>
  );
}
