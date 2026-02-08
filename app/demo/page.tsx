"use client";

import { LazyMotion, domAnimation } from "motion/react";
import * as m from "motion/react-m";
import { HoverScatterCard } from "@/components/hover-scatter-card";
import type { FloatingItem, DeckCard } from "@/components/hover-scatter-card";
import { ParallaxDepthCard } from "@/components/parallax-depth-card";
import type { ParallaxLayer } from "@/components/parallax-depth-card";

// [rerender-variants-object] Stagger variants hoisted outside component
// [polish-stagger-children] Orchestrated reveal for design principles cards
const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    // [ease-out-default] Entrance motion → ease-out
    transition: {
      duration: 0.5,
      ease: [0, 0, 0.2, 1] as [number, number, number, number],
    },
  },
};

// ── Hero mockups (colored div placeholders) ──────────────────────────────────

function BrowserMockup() {
  // Original reference: 148 × 103 pt (~1.44:1 ratio)
  return (
    <div
      className="bg-neutral-50 overflow-hidden"
      style={{
        width: 168,
        height: 117,
        borderRadius: "10.8064% / 15.0378%",
        boxShadow:
          "rgba(38, 38, 38, 0.1) 0px 1.13px 2px 0px, rgba(117, 117, 117, 0.1) 0px 6.77px 12px 0px, rgba(145, 145, 145, 0.1) 0px 13.54px 24px 0px",
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1 px-2.5 py-1.5 bg-white border-b border-neutral-100">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
        <span className="ml-1.5 text-[8px] text-neutral-400">kizer.me</span>
      </div>
      {/* Content area — landscape layout with sidebar placeholder */}
      <div className="flex gap-2.5 px-3 py-2.5 bg-amber-50/60 h-full">
        {/* Left: text lines */}
        <div className="flex-1 space-y-2">
          <div className="w-14 h-2 rounded bg-neutral-800" />
          <div className="w-full h-1 rounded bg-neutral-300" />
          <div className="w-[85%] h-1 rounded bg-neutral-300" />
          <div className="w-10 h-1 rounded bg-amber-300" />
        </div>
        {/* Right: image/card placeholder */}
        <div className="w-12 h-12 rounded-md bg-amber-100/60 shrink-0 self-end" />
      </div>
    </div>
  );
}

function CodeEditorMockup() {
  return (
    <div
      className="bg-neutral-900 overflow-hidden"
      style={{
        width: 168,
        height: 117,
        borderRadius: "10.8064% / 15.0378%",
        boxShadow:
          "rgba(38, 38, 38, 0.1) 0px 1.13px 2px 0px, rgba(117, 117, 117, 0.1) 0px 6.77px 12px 0px, rgba(145, 145, 145, 0.1) 0px 13.54px 24px 0px",
      }}
    >
      {/* Title bar */}
      <div className="flex items-center gap-1 px-2.5 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
        <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
      </div>
      {/* Code lines */}
      <div className="px-3 pb-3 space-y-2 font-mono text-[9px]">
        <div className="flex gap-1">
          <span className="text-pink-400">&lt;head&gt;</span>
        </div>
        <div className="flex gap-1 pl-3">
          <span className="text-blue-400">&lt;title&gt;</span>
          <span className="text-green-300">Hi Human!</span>
          <span className="text-blue-400">&lt;/title&gt;</span>
        </div>
        <div className="flex gap-1">
          <span className="text-pink-400">&lt;/head&gt;</span>
        </div>
      </div>
    </div>
  );
}

function StyleGuideMockup() {
  return (
    <div
      className="bg-white overflow-hidden p-3 space-y-2"
      style={{
        width: 168,
        height: 117,
        borderRadius: "10.8064% / 15.0378%",
        boxShadow:
          "rgba(38, 38, 38, 0.1) 0px 1.13px 2px 0px, rgba(117, 117, 117, 0.1) 0px 6.77px 12px 0px, rgba(145, 145, 145, 0.1) 0px 13.54px 24px 0px",
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
        <span className="text-[8px] text-neutral-500">Style Guide</span>
      </div>
      <div className="flex gap-4">
        <div>
          <span className="text-[8px] text-neutral-400 block mb-1">Colours</span>
          <div className="flex gap-0.5">
            <span className="w-3 h-3 rounded bg-indigo-500" />
            <span className="w-3 h-3 rounded bg-rose-400" />
            <span className="w-3 h-3 rounded bg-amber-400" />
          </div>
          <div className="flex gap-0.5 mt-0.5">
            <span className="w-3 h-3 rounded bg-emerald-400" />
            <span className="w-3 h-3 rounded bg-sky-400" />
            <span className="w-3 h-3 rounded bg-violet-400" />
          </div>
        </div>
        <div>
          <span className="text-[8px] text-neutral-400 block mb-1">Typography</span>
          <div className="space-y-1">
            <div className="w-12 h-1.5 rounded bg-neutral-300" />
            <div className="w-10 h-1.5 rounded bg-neutral-200" />
            <div className="w-14 h-1 rounded bg-neutral-200" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Website card: floating items ─────────────────────────────────────────────
// Positioned to hug the browser mockup corners. The two right-side icons
// overlap each other (stacked). Rounding is small (rounded-md ≈ 6px).
// On hover they scatter far enough to clip completely out of view.

// [physics-subtle-deformation] scale within 0.95-1.05
const websiteItems: FloatingItem[] = [
  {
    // Shopify — top-left corner of browser card
    id: "shopify",
    className: "size-10 rounded-md bg-[#95bf47] shadow-md rotate-5",
    style: { top: "18%", left: "10%" },
    hover: { x: -100, y: -80, rotate: -20, scale: 0.97, opacity: 0 },
  },
  {
    // Dark tool (R) — top-right, offset right of browser card
    id: "dark-tool",
    className: "size-12 rounded-lg bg-neutral-900 shadow-md rotate-6",
    style: { top: "18%", right: "10%" },
    hover: { x: 90, y: -90, rotate: 15, scale: 0.97, opacity: 0 },
  },
  {
    // Blue arrow — right side, overlapping just below the dark tool
    id: "blue-arrow",
    className: "size-9 rounded-md bg-[#2563eb] shadow-md rotate-6",
    style: { top: "30%", right: "7%" },
    hover: { x: 110, y: 40, rotate: 35, scale: 0.97, opacity: 0 },
  },
  {
    // Webflow (W) — bottom-left corner of browser card
    id: "webflow",
    className: "size-9 rounded-md bg-white shadow-md border border-gray-200",
    style: { bottom: "28%", left: "10%" },
    hover: { x: -100, y: 80, rotate: -15, scale: 0.97, opacity: 0 },
  },
];

// ── Website card: stacked deck ───────────────────────────────────────────────
// Solid white cards with real box-shadows that fan out behind the hero on
// hover. They match the browser mockup's shape. Starts hidden (opacity 0),
// fans out to clearly visible white cards — NOT transparent ghosts.

const websiteDeck: DeckCard[] = [
  {
    id: "deck-1",
    rest: { rotate: 0, x: 0, y: 0, opacity: 0, scale: 0.97 },
    hover: { rotate: -5, x: -6, y: 3, opacity: 1, scale: 0.99 },
  },
  {
    id: "deck-2",
    rest: { rotate: 0, x: 0, y: 0, opacity: 0, scale: 0.94 },
    hover: { rotate: 8, x: 4, y: 6, opacity: 1, scale: 0.97 },
  },
  {
    id: "deck-3",
    rest: { rotate: 0, x: 0, y: 0, opacity: 0, scale: 0.90 },
    hover: { rotate: 22, x: 10, y: 12, opacity: 0.85, scale: 0.95 },
  },
];

// ── Product card: floating items ─────────────────────────────────────────────
// [physics-subtle-deformation] scale within 0.95-1.05

const productItems: FloatingItem[] = [
  {
    id: "figma",
    className: "size-10 rounded-md bg-orange-400 shadow-md -rotate-10",
    style: { top: "20%", left: "11%" },
    hover: { x: -90, y: -70, rotate: -18, scale: 0.97, opacity: 0 },
  },
  {
    id: "nuxt",
    className: "size-11 rounded-lg bg-emerald-500 shadow-md rotate-10",
    style: { bottom: "20%", right: "12%" },
    hover: { x: 100, y: 70, rotate: 20, scale: 0.97, opacity: 0 },
  },
  {
    id: "bolt",
    className: "size-9 rounded-md bg-teal-400 shadow-md",
    style: { bottom: "20%", left: "12%" },
    hover: { x: -80, y: 80, rotate: -22, scale: 0.97, opacity: 0 },
  },
];

// ── Brand card: floating items ───────────────────────────────────────────────

// [physics-subtle-deformation] scale kept within 0.95-1.05 range
// [physics-spring-for-overshoot] using spring transition for natural settle
const brandItems: FloatingItem[] = [
  {
    id: "figma-b",
    className: "w-10 h-10 rounded-md bg-violet-500 shadow-md",
    style: { top: "10%", left: "10%" },
    hover: { x: -80, y: -70, rotate: -15, scale: 0.97, opacity: 0 },
  },
  {
    id: "ae",
    className: "w-11 h-11 rounded-lg bg-indigo-600 shadow-md",
    style: { top: "6%", right: "8%" },
    hover: { x: 90, y: -80, rotate: 18, scale: 0.97, opacity: 0 },
  },
  {
    id: "ai",
    className: "w-10 h-10 rounded-md bg-orange-600 shadow-md",
    style: { bottom: "28%", left: "6%" },
    hover: { x: -100, y: 60, rotate: -20, scale: 0.97, opacity: 0 },
  },
  {
    id: "ps",
    className: "w-9 h-9 rounded-md bg-sky-600 shadow-md",
    style: { bottom: "26%", right: "6%" },
    hover: { x: 90, y: 70, rotate: 22, scale: 0.97, opacity: 0 },
  },
];

// [physics-spring-for-overshoot] spring transitions for natural settle
// [timing-under-300ms] spring settles within ~280ms with these params
const brandSpringTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

const productSpringTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

const websiteSpringTransition = {
  type: "spring" as const,
  stiffness: 500,
  damping: 30,
  mass: 0.8,
};

// [physics-spring-for-overshoot] deck fan uses spring for overshoot-settle
const websiteDeckSpringTransition = {
  type: "spring" as const,
  stiffness: 400,
  damping: 28,
  mass: 1,
};

// ── Parallax Design Principles Cards ────────────────────────────────────────

// Speed - Blue/cyan theme with motion elements
const speedLayers: ParallaxLayer[] = [
  {
    id: "speed-bg",
    depth: 0.2,
    children: (
      <div className="w-48 h-48 rounded-full bg-linear-to-br from-blue-400 to-cyan-400 blur-3xl opacity-40" />
    ),
  },
  {
    id: "speed-streaks",
    depth: 0.5,
    children: (
      <div className="relative w-full h-full">
        <div className="absolute top-1/3 left-1/4 w-32 h-1 bg-blue-500/30 rounded-full rotate-12" />
        <div className="absolute top-1/2 right-1/4 w-24 h-1 bg-cyan-500/30 rounded-full -rotate-12" />
        <div className="absolute bottom-1/3 left-1/3 w-28 h-1 bg-blue-400/30 rounded-full rotate-6" />
      </div>
    ),
  },
  {
    id: "speed-icon",
    depth: 0.9,
    children: (
      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-cyan-500 shadow-2xl flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
    ),
  },
];

// Clarity - Purple/indigo theme with geometric structure
const clarityLayers: ParallaxLayer[] = [
  {
    id: "clarity-bg",
    depth: 0.2,
    children: (
      <div className="w-48 h-48 rounded-full bg-linear-to-br from-purple-400 to-indigo-400 blur-3xl opacity-40" />
    ),
  },
  {
    id: "clarity-grid",
    depth: 0.5,
    children: (
      <div className="w-40 h-40 border-2 border-purple-300/30 rounded-2xl grid grid-cols-3 grid-rows-3 gap-2 p-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="rounded bg-purple-200/20" />
        ))}
      </div>
    ),
  },
  {
    id: "clarity-icon",
    depth: 0.9,
    children: (
      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-purple-500 to-indigo-500 shadow-2xl flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </div>
    ),
  },
];

// Delight - Orange/rose theme with playful elements
const delightLayers: ParallaxLayer[] = [
  {
    id: "delight-bg",
    depth: 0.2,
    children: (
      <div className="w-48 h-48 rounded-full bg-linear-to-br from-orange-400 to-rose-400 blur-3xl opacity-40" />
    ),
  },
  {
    id: "delight-shapes",
    depth: 0.5,
    children: (
      <div className="relative w-full h-full">
        <div className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full bg-orange-300/40" />
        <div className="absolute bottom-1/3 right-1/4 w-16 h-16 rounded-lg bg-rose-300/40 rotate-12" />
        <div className="absolute top-1/2 right-1/3 w-10 h-10 bg-orange-400/40 rotate-45" />
      </div>
    ),
  },
  {
    id: "delight-icon",
    depth: 0.9,
    children: (
      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-orange-500 to-rose-500 shadow-2xl flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
  },
];

// Trust - Green/teal theme with shield/security elements
const trustLayers: ParallaxLayer[] = [
  {
    id: "trust-bg",
    depth: 0.2,
    children: (
      <div className="w-48 h-48 rounded-full bg-linear-to-br from-emerald-400 to-teal-400 blur-3xl opacity-40" />
    ),
  },
  {
    id: "trust-rings",
    depth: 0.5,
    children: (
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="w-32 h-32 rounded-full border-2 border-emerald-300/30" />
        <div className="absolute w-24 h-24 rounded-full border-2 border-teal-300/40" />
        <div className="absolute w-16 h-16 rounded-full border-2 border-emerald-400/50" />
      </div>
    ),
  },
  {
    id: "trust-icon",
    depth: 0.9,
    children: (
      <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-emerald-500 to-teal-500 shadow-2xl flex items-center justify-center">
        <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </div>
    ),
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen w-full bg-white overflow-auto flex flex-col items-center justify-center gap-12 p-10">
        {/* Header */}
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 text-balance leading-tight">
            Designers Who Ship AI Products That Users Actually Want
          </h1>
          <p className="mt-4 text-neutral-600 text-lg md:text-xl text-pretty leading-relaxed">
            Most designers build interfaces. We build AI-native experiences that feel magical, not mechanical. 
            <span className="font-medium text-neutral-900"> We specialize in the unique challenges of AI product design</span>—handling uncertainty, 
            managing expectations, and creating trust when the product thinks for itself.
          </p>
          <p className="mt-3 text-neutral-500 text-base">
            If you&apos;re shipping AI features and need someone who understands both design systems and AI systems, 
            <span className="text-neutral-700 font-medium"> let&apos;s talk.</span>
          </p>
        </div>

        {/* Cards row */}
        <div className="flex flex-wrap items-start justify-center gap-8">
          <HoverScatterCard
            title="Brand"
            subtitle="Concept Style Identity"
            hero={<StyleGuideMockup />}
            items={brandItems}
            itemTransition={brandSpringTransition}
            staggerChildren={0.035}
          />
          <HoverScatterCard
            title="Product"
            subtitle="Code Function Flow"
            hero={<CodeEditorMockup />}
            items={productItems}
            itemTransition={productSpringTransition}
            staggerChildren={0.035}
          />
          <HoverScatterCard
            title="Website"
            subtitle="Build Launch Grow"
            hero={<BrowserMockup />}
            items={websiteItems}
            deck={websiteDeck}
            heroHoverScale={1.06}
            itemTransition={websiteSpringTransition}
            deckTransition={websiteDeckSpringTransition}
            staggerChildren={0.035}
          />
        </div>

        {/* Parallax Design Principles Section */}
        <div className="w-full max-w-5xl mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900">
              How We Design
            </h2>
            <p className="mt-3 text-neutral-600 text-lg">
              Every decision guided by principles that create better experiences
            </p>
          </div>

          {/* [polish-scroll-reveal] Trigger when meaningfully in viewport */}
          <m.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px 0px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 justify-items-center"
          >
            <m.div variants={staggerItem}>
              <ParallaxDepthCard
                title="Speed"
                subtitle="Fast interactions build trust"
                layers={speedLayers}
                theme="blue"
              />
            </m.div>
            <m.div variants={staggerItem}>
              <ParallaxDepthCard
                title="Clarity"
                subtitle="Clear paths reduce friction"
                layers={clarityLayers}
                theme="purple"
              />
            </m.div>
            <m.div variants={staggerItem}>
              <ParallaxDepthCard
                title="Delight"
                subtitle="Joy makes products memorable"
                layers={delightLayers}
                theme="orange"
              />
            </m.div>
            <m.div variants={staggerItem}>
              <ParallaxDepthCard
                title="Trust"
                subtitle="Reliability enables adoption"
                layers={trustLayers}
                theme="green"
              />
            </m.div>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
}
