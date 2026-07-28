/// <reference types="astro/client" />

interface Window {
  gtag?: (...args: unknown[]) => void;
  Calendly?: {
    initPopupWidget: (options: { url: string }) => void;
  };
}
