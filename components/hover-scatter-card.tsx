"use client";

import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { Variants, Transition } from "motion/react";

// ── Types ────────────────────────────────────────────────────────────────────

interface FloatingItemHover {
  x?: number;
  y?: number;
  rotate?: number;
  scale?: number;
  opacity?: number;
}

export interface FloatingItem {
  id: string;
  className: string;
  style: React.CSSProperties;
  hover: FloatingItemHover;
}

/** A ghost card in the stacked deck behind the hero */
export interface DeckCard {
  id: string;
  rest: { rotate: number; x?: number; y?: number; opacity?: number; scale?: number };
  hover: { rotate: number; x?: number; y?: number; opacity?: number; scale?: number };
  className?: string;
}

export interface HoverScatterCardProps {
  title: string;
  subtitle: string;
  hero: React.ReactNode;
  items: FloatingItem[];
  deck?: DeckCard[];
  heroHoverScale?: number;
  /** Override the default item scatter transition */
  itemTransition?: Transition;
  /** Override the default deck fan transition */
  deckTransition?: Transition;
  /** Stagger delay (seconds) between child animations */
  staggerChildren?: number;
  className?: string;
}

// ── Default transitions ──────────────────────────────────────────────────────

// [easing-exit-ease-in] Icons scattering out = exit motion → ease-in curve
// [timing-under-300ms] User-initiated hover ≤ 300ms
const defaultItemTransition: Transition = {
  type: "tween",
  duration: 0.28,
  ease: [0.4, 0, 1, 1], // ease-in: build momentum before departure
};

const defaultHeroTransition: Transition = {
  type: "tween",
  duration: 0.25,
  ease: [0, 0, 0.2, 1], // ease-out: arrive fast, settle gently
};

const defaultDeckTransition: Transition = {
  type: "tween",
  duration: 0.3,
  ease: [0, 0, 0.2, 1], // ease-out: deck fans in (entrance)
};

// ── Variant builders ─────────────────────────────────────────────────────────
// rerender-variants-object: all defined outside component for stable refs

function buildCardVariants(stagger?: number, reducedMotion?: boolean): Variants {
  return {
    rest: {
      scale: 1,
      transition: stagger ? { staggerChildren: stagger } : undefined,
    },
    hover: {
      scale: 1,
      transition: stagger ? { staggerChildren: stagger } : undefined,
    },
    // [physics-active-state] pressed state with subtle deformation
    // [polish-reduced-motion] opacity-only feedback when motion is reduced
    tap: reducedMotion ? { opacity: 0.9 } : { scale: 0.98 },
  };
}

function buildItemVariants(
  hover: FloatingItemHover,
  reducedMotion: boolean
): Variants {
  if (reducedMotion) {
    // [polish-reduced-motion] fade-only alternative (no transforms)
    return {
      rest: { opacity: 1 },
      hover: { opacity: hover.opacity ?? 0 },
    };
  }
  return {
    rest: { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 },
    hover: {
      x: hover.x ?? 0,
      y: hover.y ?? 0,
      rotate: hover.rotate ?? 0,
      scale: hover.scale ?? 1,
      opacity: hover.opacity ?? 1,
    },
  };
}

function buildDeckVariants(card: DeckCard, reducedMotion: boolean): Variants {
  if (reducedMotion) {
    // [polish-reduced-motion] fade-only alternative (no transforms)
    return {
      rest: { opacity: card.rest.opacity ?? 0 },
      hover: { opacity: card.hover.opacity ?? 1 },
    };
  }
  return {
    rest: {
      rotate: card.rest.rotate,
      x: card.rest.x ?? 0,
      y: card.rest.y ?? 0,
      opacity: card.rest.opacity ?? 0,
      scale: card.rest.scale ?? 1,
    },
    hover: {
      rotate: card.hover.rotate,
      x: card.hover.x ?? 0,
      y: card.hover.y ?? 0,
      opacity: card.hover.opacity ?? 1,
      scale: card.hover.scale ?? 1,
    },
  };
}

function buildHeroVariants(
  hoverScale: number,
  reducedMotion: boolean
): Variants {
  if (reducedMotion) {
    // [polish-reduced-motion] subtle opacity change instead of scale
    return {
      rest: { opacity: 1 },
      hover: { opacity: 0.95 },
    };
  }
  return {
    rest: { scale: 1 },
    hover: { scale: hoverScale },
  };
}

// ── Module-level caches ──────────────────────────────────────────────────────
// Note: Variants are built per-render based on reducedMotion preference
// (can't cache because reducedMotion is dynamic, so we build fresh each render)

// ── Component ────────────────────────────────────────────────────────────────

export function HoverScatterCard({
  title,
  subtitle,
  hero,
  items,
  deck,
  heroHoverScale = 1,
  itemTransition,
  deckTransition: deckTransitionProp,
  staggerChildren,
  className = "",
}: HoverScatterCardProps) {
  // [polish-reduced-motion] detect user's motion preference
  const shouldReduceMotion = useReducedMotion();

  const resolvedItemTransition = itemTransition ?? defaultItemTransition;
  const resolvedDeckTransition = deckTransitionProp ?? defaultDeckTransition;

  return (
    <m.div
      variants={buildCardVariants(staggerChildren, shouldReduceMotion ?? false)}
      initial="rest"
      whileHover="hover"
      // [physics-active-state] subtle press feedback
      // [polish-reduced-motion] opacity-only when motion is reduced
      // this is the reusable card class
      whileTap="tap"
      className={`
        relative flex flex-col items-center
        w-[260px] rounded-2xl bg-[#f5f5f5] border border-[#E6E6E6]
        cursor-pointer select-none
        shadow-[inset_0_-6px_0_1px_rgba(0,0,0,0.02)]
        ${className}
      `}
    >
      {/* Illustration area — overflow-hidden clips scattered icons at card edge */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-2xl flex items-center justify-center">

        {/* Stacked deck cards behind the hero */}
        {deck?.map((card) => (
          <m.div
            key={card.id}
            variants={buildDeckVariants(card, shouldReduceMotion ?? false)}
            transition={resolvedDeckTransition}
            className={`absolute z-5 bg-white ${card.className ?? ""}`}
            style={{
              width: "66%",
              aspectRatio: "168 / 117",
              borderRadius: "10.8084% / 14.9174%",
              boxShadow:
                "rgba(145, 145, 145, 0.1) 0px 1.13px 2px 0px, rgba(250, 250, 250, 0.1) 0px 6.77px 12px 0px",
            }}
          />
        ))}

        {/* Central hero element — scales up on hover */}
        {heroHoverScale !== 1 ? (
          <m.div
            className="relative z-10"
            variants={buildHeroVariants(heroHoverScale, shouldReduceMotion ?? false)}
            transition={defaultHeroTransition}
          >
            {hero}
          </m.div>
        ) : (
          <div className="relative z-10">{hero}</div>
        )}

        {/* Floating items — scatter outward, clipped by overflow-hidden */}
        {items.map((item) => (
          <m.div
            key={item.id}
            variants={buildItemVariants(item.hover, shouldReduceMotion ?? false)}
            transition={resolvedItemTransition}
            className={`absolute z-20 ${item.className}`}
            style={item.style}
          />
        ))}
      </div>

      {/* Labels */}
      <div className="pb-6 pt-2 text-center">
        <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
        <p className="text-sm text-neutral-400">{subtitle}</p>
      </div>
    </m.div>
  );
}
