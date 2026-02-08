"use client";

import { LazyMotion, domAnimation } from "motion/react";
import { HoverScatterCard } from "@/components/hover-scatter-card";
import type { FloatingItem, DeckCard } from "@/components/hover-scatter-card";

// ── Hero mockups (colored div placeholders) ──────────────────────────────────

function BrowserMockup() {
  // Original reference: 148 × 103 pt (~1.44:1 ratio)
  return (
    <div
      className="bg-white overflow-hidden"
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

// ── Page ─────────────────────────────────────────────────────────────────────

export default function DemoPage() {
  return (
    <LazyMotion features={domAnimation}>
      <div className="min-h-screen w-full bg-white overflow-auto flex flex-col items-center justify-center gap-12 p-10">
        {/* Header */}
        <div className="text-center max-w-lg">
          <h1 className="text-3xl font-bold text-neutral-900 text-balance">
            Hover Scatter Cards
          </h1>
          <p className="mt-2 text-neutral-500 text-base text-pretty">
            Hover over each card. Icons scatter out and clip at the card edge,
            the hero scales up, and a deck of cards fans out behind.
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
      </div>
    </LazyMotion>
  );
}
