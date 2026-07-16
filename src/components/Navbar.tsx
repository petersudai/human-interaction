import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LogoMark from "./LogoMark";
import { brand, contact, nav } from "../data/content";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-ink/85 backdrop-blur-md border-b border-ink-border" : "bg-transparent border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a href="#top" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <LogoMark size={34} />
          <span className="font-display text-lg italic tracking-tight text-cream">
            {brand.name}
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-dusk-100/80 transition-colors hover:text-cream"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold-400 transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-gradient-to-r from-gold-500 to-coral-500 px-5 py-2.5 text-sm font-semibold text-ink shadow-glow-gold-sm transition-transform duration-300 hover:scale-105 sm:inline-block"
          >
            Book a call
          </a>

          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full border border-ink-border md:hidden"
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

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-b border-ink-border bg-ink md:hidden"
          >
            <div className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border-b border-ink-border/60 py-4 font-display text-2xl italic text-cream"
                >
                  {item.label}
                </a>
              ))}
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 rounded-full bg-gradient-to-r from-gold-500 to-coral-500 px-5 py-3 text-center text-sm font-semibold text-ink"
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
