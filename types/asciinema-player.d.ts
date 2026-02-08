declare module "asciinema-player" {
  interface PlayerOptions {
    autoPlay?: boolean;
    loop?: boolean;
    fit?: "width" | "height" | "both" | "none" | false;
    theme?: string;
    poster?: string;
    terminalFontFamily?: string;
    terminalFontSize?: string;
    cols?: number;
    rows?: number;
    preload?: boolean;
    speed?: number;
    idleTimeLimit?: number;
    markers?: [number, string][];
    pauseOnMarkers?: boolean;
    [key: string]: unknown;
  }

  interface Player {
    play(): void;
    pause(): void;
    seek(location: number | { marker: "prev" | "next" }): void;
    getCurrentTime(): number;
    getDuration(): number;
    dispose(): void;
    addEventListener(event: string, handler: (...args: unknown[]) => void): void;
  }

  export function create(
    src: string | { url: string } | { data: string },
    containerElement: HTMLElement,
    opts?: PlayerOptions
  ): Player;
}

declare module "asciinema-player/dist/bundle/asciinema-player.css" {
  const content: string;
  export default content;
}
