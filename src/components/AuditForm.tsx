import { useState, type FormEvent } from "react";
import { contact } from "../data/content";

export default function AuditForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.currentTarget);
    const rawWebsite = String(formData.get("website") || "").trim();
    // People type "yourwebsite.com" without a scheme, which is exactly the
    // placeholder we show them. type="url" inputs reject that silently, so
    // this field is plain text and we add the scheme here instead.
    formData.set("website", /^https?:\/\//i.test(rawWebsite) ? rawWebsite : `https://${rawWebsite}`);
    try {
      const res = await fetch(contact.auditFormEndpoint, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      setStatus(res.ok ? "success" : "error");
      if (res.ok) {
        if (typeof window.gtag === "function") {
          window.gtag("event", "audit_form_submit");
        }
        // Instant confirmation email — a side effect, not the main event.
        // If this fails, the real lead capture above already succeeded.
        fetch("/api/lead-response", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.get("email"), website: formData.get("website") }),
        }).catch(() => {});
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <p className="text-sm text-gold-300">
        Got it. We'll send your free audit within 2 business days.
      </p>
    );
  }

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        {/* Honeypot: Formspree silently discards submissions where this is
            filled in. Real visitors never see it; simple bots fill every
            field blindly. */}
        <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input
          type="text"
          inputMode="url"
          name="website"
          required
          placeholder="yourwebsite.com"
          className="w-full rounded-full border border-ink-border bg-ink-2/60 px-4 py-2.5 text-sm text-cream placeholder:text-dusk-100/40 focus:border-gold-400 focus:outline-none"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          className="w-full rounded-full border border-ink-border bg-ink-2/60 px-4 py-2.5 text-sm text-cream placeholder:text-dusk-100/40 focus:border-gold-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-none rounded-full border border-ink-border px-5 py-2.5 text-sm font-semibold text-cream transition-colors duration-300 hover:border-gold-400 hover:text-gold-300 disabled:opacity-50"
        >
          {status === "loading" ? "Sending…" : "Get my free audit"}
        </button>
      </form>
      {status === "error" && (
        <p className="mt-2 text-xs text-coral-400">
          Something went wrong. Try again, or email us directly.
        </p>
      )}
    </div>
  );
}
