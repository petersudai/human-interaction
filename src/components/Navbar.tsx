import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LogoMark from "./LogoMark";
import { availability, brand, contact, nav } from "../data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<number | null>(null);

  useEffect(() => {
    let ticking = false;

    const read = () => {
      ticking = false;
      setScrolled(window.scrollY > 24);
      const doc = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(doc > 0 ? Math.min(1, Math.max(0, window.scrollY / doc)) : 0);
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(read);
        ticking = true;
      }
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 md:top-3">
      {/* Mobile keeps the plain full-width bar; the island is desktop-only. */}
      <div
        className={`absolute inset-0 transition-colors duration-500 md:hidden ${
          scrolled ? "border-b border-ink-border bg-ink/85 backdrop-blur-md" : "bg-transparent"
        }`}
      />

      <div
        className={`relative mx-auto flex w-full items-center justify-between px-5 py-4 transition-all duration-500 md:grid md:grid-cols-[1fr_auto_1fr] md:overflow-hidden md:rounded-2xl md:border md:py-2 md:pl-4 md:pr-2 md:shadow-2xl md:shadow-black/20 md:backdrop-blur-xl ${
          scrolled
            ? "max-w-7xl md:max-w-4xl md:border-cream/15 md:bg-ink/75"
            : "max-w-7xl md:max-w-5xl md:border-cream/10 md:bg-ink/45"
        }`}
      >
        <a
          href="#top"
          className="flex shrink-0 items-center gap-2.5 md:justify-self-start"
          onClick={() => setOpen(false)}
        >
          <LogoMark size={30} />
          <span className="font-display text-base italic tracking-tight text-cream sm:text-lg">
            {brand.name}
          </span>
        </a>

        {/* True centre column regardless of how wide the logo or actions are.
            Sliding indicator follows the cursor between links. */}
        <div
          className="hidden items-center gap-0.5 md:col-start-2 md:flex md:justify-self-center"
          onMouseLeave={() => setHovered(null)}
        >
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHovered(i)}
              className="relative rounded-xl px-3.5 py-2 text-sm font-medium text-dusk-100/75 transition-colors duration-200 hover:text-cream"
            >
              {hovered === i && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute inset-0 rounded-xl bg-cream/10"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-3 md:col-start-3 md:justify-self-end">
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-calendly
            data-ga-event="book_call"
            className="group hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-500 to-coral-500 px-4 py-2 text-sm font-semibold text-ink shadow-glow-gold-sm transition-transform duration-300 hover:scale-105 md:inline-flex"
          >
            Book a call
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-0.5">
              →
            </span>
          </a>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-ink-border transition-colors duration-300 hover:border-dusk-300 md:hidden"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
              className="h-px w-4 bg-cream"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
              className="h-px w-4 bg-cream"
            />
          </button>
        </div>

        {/* Read progress, riding the island's bottom edge. */}
        <div
          className="absolute bottom-0 left-0 hidden h-px bg-gradient-to-r from-gold-500 to-coral-500 md:block"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden border-b border-ink-border bg-ink md:hidden"
          >
            <div className="flex flex-col px-5 pb-6 pt-2">
              {nav.map((item, i) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-baseline gap-3 border-b border-ink-border/60 py-4 font-display text-2xl italic text-cream"
                >
                  <span className="text-[11px] not-italic tabular-nums text-gold-400/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item.label}
                </a>
              ))}

              <span className="mt-6 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-dusk-100/55">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
                {availability}
              </span>

              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-calendly
                data-ga-event="book_call"
                className="mt-3 rounded-full bg-gradient-to-r from-gold-500 to-coral-500 px-5 py-3.5 text-center text-sm font-semibold text-ink"
              >
                Book a free strategy call
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
