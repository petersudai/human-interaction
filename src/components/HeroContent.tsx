import { motion } from "framer-motion";
import { contact, hero } from "../data/content";
import Magnetic from "./Magnetic";

const EASE = [0.16, 1, 0.3, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: EASE },
  },
};

const headlineContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.05, delayChildren: 0.45 },
  },
};

const word = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.85, ease: EASE } },
};

function Word({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className="mr-[0.28em] inline-block overflow-hidden pb-1 align-bottom last:mr-0">
      <motion.span variants={word} className={`inline-block ${className}`}>
        {children}
      </motion.span>
    </span>
  );
}

export default function HeroContent() {
  const leadWords = hero.headlineLead.split(" ");
  const tailWords = hero.headlineTail.split(" ");

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-5 text-center"
    >
      <motion.span
        variants={item}
        className="mb-5 inline-flex items-center gap-2 rounded-full border border-ink-border bg-ink-2/60 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-gold-300 sm:mb-6"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400" />
        {hero.eyebrow}
      </motion.span>

      <motion.h1
        variants={headlineContainer}
        className="text-balance font-display text-[12vw] leading-[1.05] tracking-tight text-cream sm:text-6xl sm:leading-[1.03] md:text-7xl lg:text-[5.25rem]"
      >
        <span className="sr-only">
          {hero.headlineLead} {hero.headlineEmphasis} {hero.headlineTail}
        </span>
        <span aria-hidden="true">
          {leadWords.map((w, i) => (
            <Word key={`lead-${i}`}>{w}</Word>
          ))}
          <Word className="text-shimmer bg-clip-text italic text-transparent">
            {hero.headlineEmphasis}
          </Word>
          {tailWords.map((w, i) => (
            <Word key={`tail-${i}`}>{w}</Word>
          ))}
        </span>
      </motion.h1>

      <motion.p
        variants={item}
        className="mt-5 max-w-2xl text-balance text-base leading-relaxed text-dusk-100/85 sm:mt-7 sm:text-lg md:text-xl"
      >
        {hero.sub}
      </motion.p>

      <motion.div variants={item} className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row">
        <Magnetic>
          <a
            href={contact.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
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
      </motion.div>
    </motion.div>
  );
}
