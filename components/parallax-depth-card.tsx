"use client";

import * as m from "motion/react-m";
import {
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import type { MotionValue } from "motion/react";
import { useCallback, useRef } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

export interface ParallaxLayer {
  id: string;
  /** Parallax strength: 0 = no movement, 1 = full movement with cursor */
  depth: number;
  className?: string;
  children: React.ReactNode;
}

export interface ParallaxDepthCardProps {
  title: string;
  subtitle?: string;
  layers: ParallaxLayer[];
  /** Base color theme for the card */
  theme: "blue" | "purple" | "orange" | "green";
  className?: string;
}

// ── Constants (hoisted outside component for stable refs) ────────────────────

const themes = {
  blue: "from-blue-400/20 to-cyan-400/20",
  purple: "from-purple-400/20 to-indigo-400/20",
  orange: "from-orange-400/20 to-rose-400/20",
  green: "from-emerald-400/20 to-teal-400/20",
} as const;

// [spring-damping-ratio] Tuned for buttery, weighted cursor-follow feel
// Lower stiffness = more lag behind cursor = "gravity" feel
// Damping ratio ≈ 0.82 → slight overshoot adds organic life
const parallaxSpring = { stiffness: 120, damping: 18, mass: 1 };

// [spring-physics-based] Snappier for card tilt (direct user feedback)
// Damping ratio ≈ 0.89 → nearly critically damped, smooth without bounce
const tiltSpring = { stiffness: 250, damping: 20, mass: 0.5 };

// Parallax movement range (px). Deepest layer moves ±(0.5 × depth × RANGE)
const PARALLAX_RANGE = 50;

// [transform-3d-preserve] Max card tilt in degrees
const MAX_TILT = 8;

// ── Sub-component (fixes hooks-in-loop violation) ────────────────────────────
// Each layer needs its own useTransform hooks — React requires hooks at
// the top level of a component, not inside .map() loops.

function ParallaxLayerItem({
  layer,
  smoothX,
  smoothY,
  shouldReduceMotion,
}: {
  layer: ParallaxLayer;
  smoothX: MotionValue<number>;
  smoothY: MotionValue<number>;
  shouldReduceMotion: boolean;
}) {
  // [rerender-use-transform] Derived motion values — zero re-renders
  const x = useTransform(smoothX, (v) => v * layer.depth * PARALLAX_RANGE);
  const y = useTransform(smoothY, (v) => v * layer.depth * PARALLAX_RANGE);

  return (
    <m.div
      className={`absolute inset-0 flex items-center justify-center ${layer.className ?? ""}`}
      style={
        shouldReduceMotion
          ? {}
          : {
              x,
              y,
              // [anim-will-change] Hint for continuous parallax movement
              willChange: "transform",
            }
      }
    >
      {layer.children}
    </m.div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export function ParallaxDepthCard({
  title,
  subtitle,
  layers,
  theme,
  className = "",
}: ParallaxDepthCardProps) {
  // [polish-reduced-motion] Detect user's motion preference
  const shouldReduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  // [rerender-motion-value] Motion values instead of useState — zero re-renders
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Two spring systems: softer for parallax layers, snappier for card tilt
  const smoothX = useSpring(mouseX, parallaxSpring);
  const smoothY = useSpring(mouseY, parallaxSpring);
  const tiltInputX = useSpring(mouseX, tiltSpring);
  const tiltInputY = useSpring(mouseY, tiltSpring);

  // [rerender-use-transform] 3D tilt derived from cursor — no re-renders
  const rotateX = useTransform(tiltInputY, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]);
  const rotateY = useTransform(tiltInputX, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]);

  // [rerender-stable-callbacks] Stable event handlers
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      // Normalized: -0.5 to +0.5 from card center
      mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width);
      mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height);
    },
    [shouldReduceMotion, mouseX, mouseY],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    // [transform-3d-preserve] Perspective wrapper enables 3D tilt
    <div style={{ perspective: 800 }} className="w-fit">
      <m.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        // [transform-scale-097] Press feedback per Emil Kowalski
        whileTap={{ scale: shouldReduceMotion ? 1 : 0.97 }}
        className={`
          relative flex flex-col
          w-[280px] h-[340px] rounded-2xl
          bg-linear-to-br ${themes[theme]}
          border border-[#E6E6E6]
          cursor-pointer select-none overflow-hidden
          transition-shadow duration-200 ease-out
          shadow-[0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.04)]
          hover:shadow-[0_8px_24px_rgba(0,0,0,0.10),0_16px_48px_rgba(0,0,0,0.08)]
          ${className}
        `}
        style={
          shouldReduceMotion
            ? {}
            : {
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
                willChange: "transform",
              }
        }
      >
        {/* Parallax layers */}
        <div className="relative flex-1 overflow-hidden">
          {layers.map((layer) => (
            <ParallaxLayerItem
              key={layer.id}
              layer={layer}
              smoothX={smoothX}
              smoothY={smoothY}
              shouldReduceMotion={shouldReduceMotion ?? false}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="relative z-50 pb-6 pt-4 px-6 text-center bg-white/80 backdrop-blur-sm rounded-b-2xl">
          <h3 className="text-xl font-bold text-neutral-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
      </m.div>
    </div>
  );
}
