import type { APIRoute } from "astro";

export const prerender = false;

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

function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

async function fetchWithTimeout(url: string, ms: number, init?: RequestInit) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function runPageSpeed(
  targetUrl: string
): Promise<{ scores: CategoryScores; debug: unknown }> {
  const apiKey = import.meta.env.PAGESPEED_API_KEY;
  const params = new URLSearchParams({ url: targetUrl, strategy: "mobile" });
  ["performance", "seo", "accessibility", "best-practices"].forEach((c) => params.append("category", c));
  if (apiKey) params.set("key", apiKey);

  const res = await fetchWithTimeout(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params.toString()}`,
    55000
  );
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`PageSpeed request failed: ${res.status} ${body.slice(0, 300)}`);
  }
  const data = await res.json();
  const categories = data?.lighthouseResult?.categories ?? {};
  const toScore = (v: unknown) => (typeof v === "number" ? Math.round(v * 100) : null);

  // TEMPORARY diagnostic block, stripped once the performance pass is done.
  const audits = data?.lighthouseResult?.audits ?? {};
  const opportunities = Object.values(audits)
    .filter((a: any) => a?.details?.type === "opportunity" && a.numericValue > 0)
    .map((a: any) => ({ title: a.title, ms: Math.round(a.numericValue), display: a.displayValue }))
    .sort((a: any, b: any) => b.ms - a.ms)
    .slice(0, 8);
  const metrics = ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "speed-index", "interactive", "cumulative-layout-shift"]
    .filter((k) => audits[k])
    .map((k) => ({ metric: k, display: audits[k].displayValue }));

  return {
    scores: {
      performance: toScore(categories.performance?.score),
      seo: toScore(categories.seo?.score),
      accessibility: toScore(categories.accessibility?.score),
      bestPractices: toScore(categories["best-practices"]?.score),
    },
    debug: { opportunities, metrics, lcpRaw: audits["largest-contentful-paint-element"] ?? null },
  };
}

async function runOwnChecks(targetUrl: string): Promise<Check[]> {
  const res = await fetchWithTimeout(targetUrl, 10000, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; HumanInteractionSiteCheck/1.0)" },
    redirect: "follow",
  });
  const finalIsHttps = res.url.startsWith("https://");
  const html = await res.text();

  const hasTitle = /<title>([^<]{3,})<\/title>/i.test(html);
  const hasMetaDescription = /<meta[^>]+name=["']description["'][^>]+content=["'][^"']{10,}["']/i.test(html);
  const hasStructuredData = /application\/ld\+json/i.test(html);
  const hasViewport = /<meta[^>]+name=["']viewport["']/i.test(html);

  return [
    { label: "Secure connection (HTTPS)", pass: finalIsHttps },
    { label: "Page title", pass: hasTitle },
    { label: "Meta description", pass: hasMetaDescription },
    { label: "Mobile viewport", pass: hasViewport },
    { label: "Structured data", pass: hasStructuredData },
  ];
}

function buildTakeaway(scores: CategoryScores, checks: Check[], psiFailed: boolean): string {
  const named: Array<{ label: string; value: number }> = [];
  if (scores.performance !== null) named.push({ label: "load speed", value: scores.performance });
  if (scores.seo !== null) named.push({ label: "search visibility", value: scores.seo });
  if (scores.accessibility !== null) named.push({ label: "accessibility", value: scores.accessibility });
  if (scores.bestPractices !== null) named.push({ label: "technical health", value: scores.bestPractices });

  const failed = checks.filter((c) => !c.pass);

  // No PSI data at all: say so plainly, never claim things look "solid"
  // off a set of zero scores.
  if (psiFailed && named.length === 0) {
    if (failed.length) {
      return `Couldn't get a full performance read on this one, might be worth trying again in a moment. What we could confirm: missing ${failed
        .map((f) => f.label.toLowerCase())
        .join(", ")}.`;
    }
    return "Couldn't get a full performance read on this one, might be worth trying again in a moment. The basics (HTTPS, title, meta description) checked out fine though.";
  }

  const worst = [...named].sort((a, b) => a.value - b.value).slice(0, 2);
  const allGood = named.length > 0 && named.every((n) => n.value >= 85) && failed.length === 0;

  if (allGood) {
    return "This site's actually in solid shape. Most sites we check have at least one real problem, this one doesn't show the usual red flags.";
  }

  const weakest = worst.filter((w) => w.value < 70).map((w) => w.label);
  const parts: string[] = [];
  if (weakest.length) {
    parts.push(`${weakest.join(" and ")} ${weakest.length > 1 ? "are" : "is"} costing this site visitors`);
  }
  if (failed.length) {
    parts.push(`missing ${failed.map((f) => f.label.toLowerCase()).join(", ")}`);
  }
  if (!parts.length) {
    return "A few things here are worth tightening up, nothing dramatic, but they add up.";
  }
  return `${parts.join(", and ")}. Fixable, and worth fixing.`;
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json().catch(() => null);
  const rawUrl = typeof body?.url === "string" ? body.url : "";
  if (!rawUrl.trim()) {
    return new Response(JSON.stringify({ error: "Missing URL" }), { status: 400 });
  }

  const targetUrl = normalizeUrl(rawUrl);
  try {
    new URL(targetUrl);
  } catch {
    return new Response(JSON.stringify({ error: "Invalid URL" }), { status: 400 });
  }

  let psiFailed = false;
  try {
    const [psi, checks] = await Promise.all([
      runPageSpeed(targetUrl).catch((err) => {
        psiFailed = true;
        console.error("site-check: PageSpeed failed for", targetUrl, err);
        return {
          scores: { performance: null, seo: null, accessibility: null, bestPractices: null },
          debug: null,
        };
      }),
      runOwnChecks(targetUrl).catch((err) => {
        console.error("site-check: own checks failed for", targetUrl, err);
        return [] as Check[];
      }),
    ]);
    const { scores, debug } = psi;

    const numericScores = Object.values(scores).filter((v): v is number => v !== null);
    const overall = numericScores.length
      ? Math.round(numericScores.reduce((a, b) => a + b, 0) / numericScores.length)
      : null;

    if (overall === null && checks.length === 0) {
      return new Response(JSON.stringify({ error: "Could not analyze this URL" }), { status: 502 });
    }

    return new Response(
      JSON.stringify({
        url: targetUrl,
        overall,
        scores,
        checks,
        takeaway: buildTakeaway(scores, checks, psiFailed),
        debug,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("site-check: unexpected failure for", targetUrl, err);
    return new Response(JSON.stringify({ error: "Could not analyze this URL" }), { status: 502 });
  }
};
