"use client";

import { useEffect, useRef } from "react";

export default function PlaybackPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<import("asciinema-player").Player | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let disposed = false;

    const FONT_FAMILY =
      "'Geist Mono', 'Consolas', 'Menlo', 'Bitstream Vera Sans Mono', monospace";

    async function init() {
      const AsciinemaPlayer = await import("asciinema-player");
      await import("asciinema-player/dist/bundle/asciinema-player.css");

      if (disposed || !containerRef.current) return;

      // Wait for the font to load so the player measures glyphs correctly
      await document.fonts.load(`1em ${FONT_FAMILY}`);

      if (disposed || !containerRef.current) return;

      playerRef.current = AsciinemaPlayer.create(
        "/openclaw_install.cast",
        containerRef.current,
        {
          autoPlay: true,
          fit: "width",
          theme: "dracula",
          terminalFontFamily: FONT_FAMILY,
          speed: 1,
          idleTimeLimit: 2,
        }
      );
    }

    init();

    return () => {
      disposed = true;
      playerRef.current?.dispose();
      playerRef.current = null;
    };
  }, []);

  return (
    <main className="flex min-h-dvh flex-col items-center bg-[#0d1117] px-4 py-12">
      <h1 className="mb-8 text-balance text-2xl font-semibold tracking-tight text-white">
        OpenClaw Installation Playback
      </h1>
      <div
        ref={containerRef}
        className="w-full max-w-4xl overflow-hidden rounded-lg shadow-lg"
      />
    </main>
  );
}
