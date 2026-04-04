import { NextResponse, NextRequest } from "next/server";
import { kv } from "@vercel/kv";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function validateInput(data: Record<string, unknown>): string | null {
  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const from = String(data.from || "").trim();
  const to = String(data.to || "").trim();
  const email = String(data.email || "").trim();
  const notes = String(data.notes || "").trim();
  if (!name || !phone || !from || !to) return "Missing required fields";
  if (name.length > 200) return "Name too long";
  if (phone.length > 30 || !/^[+\d\s()\-]{6,30}$/.test(phone))
    return "Invalid phone";
  if (from.length > 200 || to.length > 200) return "Address too long";
  if (
    email &&
    (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )
    return "Invalid email";
  if (notes.length > 2000) return "Notes too long";
  return null;
}

const rateMap = new Map<string, number[]>();
function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const ts = rateMap.get(ip)?.filter((t) => now - t < 3600000) || [];
  if (ts.length >= 5) return true;
  ts.push(now);
  rateMap.set(ip, ts);
  return false;
}

async function sendBrevoEmail(
  apiKey: string,
  payload: Record<string, unknown>,
) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Brevo: ${res.status}`);
}

export interface Quote {
  id: string;
  name: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  date: string;
  type: string;
  notes: string;
  status: "new" | "approved" | "rejected" | "sent";
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const origin = request.headers.get("origin") || "";
    const allowed = [
      "https://123cheguei.pt",
      "https://www.123cheguei.pt",
      "http://localhost:3005",
      "http://localhost:3000",
    ];
    if (origin && !allowed.some((o) => origin.startsWith(o))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip))
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 },
      );

    const raw = await request.json();
    if (raw.website) return NextResponse.json({ success: true });

    const err = validateInput(raw);
    if (err) return NextResponse.json({ error: err }, { status: 400 });

    const quote: Quote = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: String(raw.name).trim(),
      email: raw.email ? String(raw.email).trim() : "",
      phone: String(raw.phone).trim(),
      from: String(raw.from).trim(),
      to: String(raw.to).trim(),
      date: raw.date ? String(raw.date).trim() : "",
      type: raw.type ? String(raw.type).trim() : "",
      notes: raw.notes ? String(raw.notes).trim() : "",
      status: "new",
      createdAt: new Date().toISOString(),
    };

    // Save to Vercel KV
    await kv.set(`quote:${quote.id}`, quote);
    // Add to sorted set for listing (score = timestamp for ordering)
    await kv.zadd("quotes:all", { score: Date.now(), member: quote.id });

    // Client confirmation email
    const brevoKey = process.env.BREVO_API_KEY;
    const companyEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

    if (brevoKey && quote.email) {
      try {
        await sendBrevoEmail(brevoKey, {
          sender: { name: "123cheguei", email: companyEmail },
          to: [{ email: quote.email, name: quote.name }],
          replyTo: { email: companyEmail, name: "123cheguei" },
          subject: `Recebemos o seu pedido — 123cheguei`,
          htmlContent: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;"><div style="background:#5A9E2F;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;"><h2 style="margin:0;">Pedido Recebido!</h2><p style="margin:8px 0 0;opacity:0.85;">Obrigado, ${esc(quote.name)}!</p></div><div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;"><p style="font-size:15px;color:#334155;">Recebemos o seu pedido para a mudanca de <strong>${esc(quote.from)}</strong> para <strong>${esc(quote.to)}</strong>. Entraremos em contacto dentro de <strong>24 horas</strong>.</p><p style="font-size:14px;color:#64748b;"><a href="tel:+351932844460" style="color:#5A9E2F;">+351 932 844 460</a> | <a href="https://wa.me/351932844460" style="color:#25D366;">WhatsApp</a></p></div></div>`,
        });
      } catch {
        /* non-blocking */
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", (error as Error).message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
