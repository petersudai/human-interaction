import type { APIRoute } from "astro";
import { contact } from "../../data/content";

// Opts this one route into on-demand rendering; the rest of the site stays static.
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    // Not configured yet — fail quietly so the main Formspree submission
    // (the part that actually matters) is never affected by this.
    return new Response(JSON.stringify({ skipped: true }), { status: 200 });
  }

  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const website = typeof body?.website === "string" ? body.website.trim() : "";

  if (!email) {
    return new Response(JSON.stringify({ error: "Missing email" }), { status: 400 });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Human Interaction <${contact.email}>`,
      to: email,
      subject: "Got your audit request",
      html: `<p>Thanks${website ? `, we've got your request for <strong>${website}</strong>` : ", we've got your request"}. We'll send your free 5-point audit within 2 business days.</p><p>Questions in the meantime? Just reply to this email.</p><p>&mdash; Human Interaction</p>`,
    }),
  });

  return new Response(JSON.stringify({ ok: res.ok }), { status: res.ok ? 200 : 502 });
};
