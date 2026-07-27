import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LogoMark from "./LogoMark";
import { availability, brand, contact, nav } from "../data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ink/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-[padding] duration-500 md:grid md:grid-cols-[1fr_auto_1fr] md:px-8 ${
          scrolled ? "py-3" : "py-5"
        }`}
      >
        <a
          href="#top"
          className="group flex items-center gap-2.5 justify-self-start"
          onClick={() => setOpen(false)}
        >
          <LogoMark size={34} />
          <span className="font-display text-lg italic tracking-tight text-cream">{brand.name}</span>
        </a>

        {/* Numbered index links. Hovering one dims its neighbours. */}
        <div className="group/nav hidden items-center gap-7 justify-self-center md:col-start-2 md:flex">
          {nav.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              className="group/link relative flex items-baseline gap-1.5 text-sm font-medium text-dusk-100/80 opacity-100 transition-all duration-300 hover:text-cream group-hover/nav:opacity-40 hover:!opacity-100"
            >
              <span className="font-display text-[10px] italic tabular-nums text-gold-400/70 transition-colors duration-300 group-hover/link:text-gold-300">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span>{item.label}</span>
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover/link:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4 justify-self-end md:col-start-3">
          <span className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-dusk-100/55 lg:inline-flex">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold-400" />
            </span>
            {availability}
          </span>

          {/* Keyline, not a gradient — the filled gradient stays reserved for
              the hero and pricing CTAs so the hierarchy still reads. */}
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group hidden items-center gap-2 rounded-full border border-gold-500/40 px-5 py-2 text-sm font-semibold text-cream transition-colors duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-ink sm:inline-flex"
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
      </nav>

      {/* Hairline rule carrying a gold read-progress line. */}
      <div className="relative h-px w-full">
        <div
          className="absolute inset-0 bg-ink-border transition-opacity duration-500"
          style={{ opacity: scrolled ? 1 : 0 }}
        />
        <div
          className="absolute left-0 top-0 h-px bg-gradient-to-r from-gold-500 to-coral-500"
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
            className="overflow-hidden border-b border-ink-border bg-ink md:hidden"
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
