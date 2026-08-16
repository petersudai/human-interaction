import { LazyMotion, domMax, m } from "framer-motion";
import { contact, hero } from "../data/content";
import Magnetic from "./Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function HeroContent() {
  return (
    <LazyMotion features={domMax}>
      <m.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.3 }}
        className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row"
      >
        <Magnetic>
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-calendly
            data-ga-event="book_call"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-coral-500 px-6 py-3 text-sm font-semibold text-ink shadow-glow-gold sm:px-7 sm:py-3.5 transition-transform duration-300 hover:scale-105"
          >
            {hero.primaryCta}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Magnetic>
        <Magnetic strength={0.25}>
          <a
            href="#work"
            className="inline-flex items-center gap-2 rounded-full border border-ink-border px-6 py-3 text-sm font-semibold text-cream sm:px-7 sm:py-3.5 transition-colors duration-300 hover:border-dusk-300 hover:text-dusk-100"
          >
            {hero.secondaryCta}
          </a>
        </Magnetic>
      </m.div>
    </LazyMotion>
  );
}
