import { NextResponse, NextRequest } from "next/server";
import { kv } from "@vercel/kv";
import type { Quote } from "../contact/route";

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function checkAuth(request: NextRequest): boolean {
  const pwd = process.env.ADMIN_PASSWORD;
  if (!pwd) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${pwd}`;
}

// GET /api/quotes — list all quotes (newest first)
export async function GET(request: NextRequest) {
  if (!checkAuth(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ids = (await kv.zrange("quotes:all", 0, -1, { rev: true })) as string[];
  const quotes: Quote[] = [];

  for (const id of ids) {
    const q = await kv.get<Quote>(`quote:${id}`);
    if (q) quotes.push(q);
  }

  return NextResponse.json({ quotes });
}

// POST /api/quotes — approve, reject, or send email
export async function POST(request: NextRequest) {
  if (!checkAuth(request))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, action } = (await request.json()) as {
    id: string;
    action: "approve" | "reject" | "send" | "delete";
  };
  const quote = await kv.get<Quote>(`quote:${id}`);
  if (!quote) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (action === "approve") {
    quote.status = "approved";
    await kv.set(`quote:${id}`, quote);
    return NextResponse.json({ success: true, quote });
  }

  if (action === "reject") {
    quote.status = "rejected";
    await kv.set(`quote:${id}`, quote);
    return NextResponse.json({ success: true, quote });
  }

  if (action === "delete") {
    await kv.del(`quote:${id}`);
    await kv.zrem("quotes:all", id);
    return NextResponse.json({ success: true });
  }

  if (action === "send") {
    // Send company email via Brevo
    const brevoKey = process.env.BREVO_API_KEY;
    const companyEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

    if (!brevoKey)
      return NextResponse.json(
        { error: "Brevo not configured" },
        { status: 500 },
      );

    const html = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1E3A5F;color:white;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h2 style="margin:0;font-size:20px;">Orcamento Aprovado</h2>
    <p style="margin:6px 0 0;opacity:0.7;font-size:14px;">${esc(quote.from)} → ${esc(quote.to)}</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <table style="font-size:14px;border-collapse:collapse;width:100%;">
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;width:120px;">Nome</td><td style="padding:10px 12px;">${esc(quote.name)}</td></tr>
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Telefone</td><td style="padding:10px 12px;"><a href="tel:${esc(quote.phone)}" style="color:#5A9E2F;">${esc(quote.phone)}</a></td></tr>
      ${quote.email ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Email</td><td style="padding:10px 12px;"><a href="mailto:${esc(quote.email)}" style="color:#5A9E2F;">${esc(quote.email)}</a></td></tr>` : ""}
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Origem</td><td style="padding:10px 12px;">${esc(quote.from)}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Destino</td><td style="padding:10px 12px;">${esc(quote.to)}</td></tr>
      ${quote.date ? `<tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Data</td><td style="padding:10px 12px;">${esc(quote.date)}</td></tr>` : ""}
      ${quote.type ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Tipologia</td><td style="padding:10px 12px;">${esc(quote.type)}</td></tr>` : ""}
    </table>
    ${quote.notes ? `<div style="margin-top:16px;padding:12px;background:#f8fafb;border-radius:8px;font-size:14px;"><strong>Notas:</strong><br/>${esc(quote.notes)}</div>` : ""}
  </div>
</div>`.trim();

    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "123cheguei Website", email: companyEmail },
        to: [{ email: companyEmail, name: "123cheguei" }],
        ...(quote.email
          ? { replyTo: { email: quote.email, name: quote.name } }
          : {}),
        subject: `✅ Aprovado: ${quote.name} — ${quote.from} → ${quote.to}`,
        htmlContent: html,
      }),
    });

    if (!res.ok)
      return NextResponse.json({ error: "Email failed" }, { status: 500 });

    quote.status = "sent";
    await kv.set(`quote:${id}`, quote);
    return NextResponse.json({ success: true, quote });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
