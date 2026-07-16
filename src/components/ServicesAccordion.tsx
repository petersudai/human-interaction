import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { services } from "../data/content";

export default function ServicesAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="border-t border-ink-border">
      {services.map((s, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={s.title} className="border-b border-ink-border">
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="group flex w-full items-center gap-6 py-7 text-left transition-colors duration-300 hover:bg-ink-2/40 sm:px-6"
              aria-expanded={isOpen}
            >
              <span className="w-10 flex-none font-display text-lg text-dusk-300/60 sm:w-12">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="flex-1 font-display text-xl text-cream transition-colors group-hover:text-gold-200 sm:text-2xl">
                {s.title}
              </h3>
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-8 w-8 flex-none items-center justify-center rounded-full border border-ink-border text-lg text-cream"
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-xl pb-7 pl-[3.5rem] pr-6 text-dusk-100/70 sm:pl-[4.5rem]">
                    {s.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
