import { useState, type FormEvent } from "react";
import { contact } from "../data/content";

interface CategoryScores {
  performance: number | null;
  seo: number | null;
  accessibility: number | null;
  bestPractices: number | null;
}

interface Check {
  label: string;
  pass: boolean;
}

interface Result {
  url: string;
  overall: number | null;
  scores: CategoryScores;
  checks: Check[];
  takeaway: string;
}

const CATEGORY_LABELS: Array<{ key: keyof CategoryScores; label: string }> = [
  { key: "performance", label: "Speed" },
  { key: "seo", label: "SEO" },
  { key: "accessibility", label: "Accessibility" },
  { key: "bestPractices", label: "Best Practices" },
];

const LOADING_MESSAGES = [
  "Loading your site the way a visitor would…",
  "Checking mobile speed…",
  "Reading your SEO signals…",
  "Almost there…",
];

function ScoreRing({ score }: { score: number | null }) {
  if (score === null) {
    return (
      <div className="flex h-28 w-28 flex-none items-center justify-center rounded-full border-4 border-ink-border text-sm text-dusk-100/50">
        N/A
      </div>
    );
  }
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);
  const color = score >= 70 ? "#e3ba58" : "#dc552c";

  return (
    <div className="relative h-28 w-28 flex-none">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="#36313f" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-display text-3xl text-cream">
        {score}
      </div>
    </div>
  );
}

export default function SiteCheck() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState<Result | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url.trim()) return;
    setStatus("loading");
    setResult(null);

    let messageIndex = 0;
    const messageTimer = setInterval(() => {
      messageIndex = Math.min(messageIndex + 1, LOADING_MESSAGES.length - 1);
      setLoadingMessage(LOADING_MESSAGES[messageIndex]);
    }, 3000);

    try {
      const res = await fetch("/api/site-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("failed");
      const data: Result = await res.json();
      setResult(data);
      setStatus("success");
      if (typeof window.gtag === "function") {
        window.gtag("event", "site_check_run", {
          checked_url: data.url,
          overall_score: data.overall,
        });
      }
    } catch {
      setStatus("error");
    } finally {
      clearInterval(messageTimer);
      setLoadingMessage(LOADING_MESSAGES[0]);
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="yourwebsite.com"
          required
          className="w-full rounded-full border border-ink-border bg-ink-2/60 px-5 py-3.5 text-sm text-cream placeholder:text-dusk-100/40 focus:border-gold-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="flex-none rounded-full bg-gradient-to-r from-gold-500 to-coral-500 px-6 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
        >
          {status === "loading" ? "Checking…" : "Check my site, free"}
        </button>
      </form>

      {status === "loading" && (
        <p className="mt-5 text-center text-sm text-dusk-100/60">{loadingMessage}</p>
      )}

      {status === "error" && (
        <p className="mt-5 text-center text-sm text-coral-400">
          Couldn't reach that site. Double-check the URL and try again.
        </p>
      )}

      {status === "success" && result && (
        <div className="mt-8 rounded-2xl border border-ink-border bg-ink-2/40 p-6 text-left sm:p-8">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <ScoreRing score={result.overall} />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.15em] text-gold-300">
                {new URL(result.url).hostname}
              </p>
              <p className="mt-2 text-dusk-100/85">{result.takeaway}</p>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORY_LABELS.map(({ key, label }) => {
              const value = result.scores[key];
              return (
                <div key={key} className="rounded-xl border border-ink-border bg-ink/40 px-3 py-3 text-center">
                  <p
                    className="font-display text-xl"
                    style={{ color: value === null ? "#e4eaeb80" : value >= 70 ? "#e3ba58" : "#dc552c" }}
                  >
                    {value ?? "—"}
                  </p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-dusk-100/50">{label}</p>
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-center text-[11px] text-dusk-100/60">
            Speed, SEO, accessibility, and best practices scores via Google PageSpeed Insights. Scores can vary
            slightly between runs.
          </p>

          {result.checks.length > 0 && (
            <ul className="mt-6 flex flex-col gap-2 border-t border-ink-border pt-6">
              {result.checks.map((check) => (
                <li key={check.label} className="flex items-center gap-2.5 text-sm">
                  <span aria-hidden className={check.pass ? "text-gold-400" : "text-coral-400"}>
                    {check.pass ? "✓" : "✕"}
                  </span>
                  <span className={check.pass ? "text-dusk-100/70" : "text-cream"}>{check.label}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-7 flex justify-center border-t border-ink-border pt-6">
            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-calendly
              data-ga-event="book_call"
              data-ga-tier="site_check"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-500 to-coral-500 px-6 py-3 text-sm font-semibold text-ink transition-transform duration-300 hover:scale-105"
            >
              Want us to fix this? Book a free call →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
