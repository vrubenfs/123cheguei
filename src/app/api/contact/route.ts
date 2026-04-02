import { NextResponse, NextRequest } from "next/server";

// ─── HTML Escaping (prevents XSS in email templates) ───
function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Input Validation ───
function validateInput(data: Record<string, unknown>): string | null {
  const name = String(data.name || "").trim();
  const phone = String(data.phone || "").trim();
  const from = String(data.from || "").trim();
  const to = String(data.to || "").trim();
  const email = String(data.email || "").trim();
  const notes = String(data.notes || "").trim();

  if (!name || !phone || !from || !to) return "Missing required fields";
  if (name.length > 200) return "Name too long";
  if (phone.length > 30 || !/^[+\d\s()\-]{6,30}$/.test(phone)) return "Invalid phone";
  if (from.length > 200) return "Origin too long";
  if (to.length > 200) return "Destination too long";
  if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return "Invalid email";
  if (notes.length > 2000) return "Notes too long";
  return null;
}

// ─── Rate Limiting (in-memory, per IP) ───
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 5; // max requests
const RATE_WINDOW = 60 * 60 * 1000; // per hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateMap.get(ip)?.filter((t) => now - t < RATE_WINDOW) || [];
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

// ─── Brevo Email Sender ───
async function sendBrevoEmail(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Brevo API error:", res.status);
    throw new Error(`Brevo: ${err.substring(0, 200)}`);
  }
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    // CSRF: check origin
    const origin = request.headers.get("origin") || "";
    const allowedOrigins = [
      "https://123cheguei.pt",
      "https://www.123cheguei.pt",
      "http://localhost:3005",
      "http://localhost:3000",
    ];
    if (origin && !allowedOrigins.some((o) => origin.startsWith(o))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 });
    }

    const raw = await request.json();

    // Honeypot: if the hidden field is filled, it's a bot
    if (raw.website) {
      return NextResponse.json({ success: true }); // silently discard
    }

    // Validate
    const validationError = validateInput(raw);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Sanitize
    const data = {
      name: esc(String(raw.name).trim()),
      email: raw.email ? esc(String(raw.email).trim()) : "",
      phone: esc(String(raw.phone).trim()),
      from: esc(String(raw.from).trim()),
      to: esc(String(raw.to).trim()),
      date: raw.date ? esc(String(raw.date).trim()) : "",
      type: raw.type ? esc(String(raw.type).trim()) : "",
      notes: raw.notes ? esc(String(raw.notes).trim()) : "",
    };

    const brevoKey = process.env.BREVO_API_KEY;
    const companyEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

    if (!brevoKey) {
      console.log("New quote request received (BREVO_API_KEY not set)");
      return NextResponse.json({ success: true });
    }

    // ═══ EMAIL 1: To company ═══
    const companyHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1E3A5F;color:white;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h2 style="margin:0;font-size:20px;">Novo Pedido de Orcamento</h2>
    <p style="margin:6px 0 0;opacity:0.7;font-size:14px;">${data.from} &rarr; ${data.to}</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <table style="font-size:14px;border-collapse:collapse;width:100%;">
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;width:120px;">Nome</td><td style="padding:10px 12px;">${data.name}</td></tr>
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Telefone</td><td style="padding:10px 12px;"><a href="tel:${data.phone}" style="color:#5A9E2F;">${data.phone}</a></td></tr>
      ${data.email ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Email</td><td style="padding:10px 12px;"><a href="mailto:${data.email}" style="color:#5A9E2F;">${data.email}</a></td></tr>` : ""}
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Origem</td><td style="padding:10px 12px;">${data.from}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Destino</td><td style="padding:10px 12px;">${data.to}</td></tr>
      ${data.date ? `<tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Data</td><td style="padding:10px 12px;">${data.date}</td></tr>` : ""}
      ${data.type ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Tipologia</td><td style="padding:10px 12px;">${data.type}</td></tr>` : ""}
    </table>
    ${data.notes ? `<div style="margin-top:16px;padding:12px;background:#f8fafb;border-radius:8px;font-size:14px;"><strong>Observacoes:</strong><br/>${data.notes}</div>` : ""}
  </div>
</div>`.trim();

    await sendBrevoEmail(brevoKey, {
      sender: { name: "123cheguei Website", email: companyEmail },
      to: [{ email: companyEmail, name: "123cheguei" }],
      ...(data.email ? { replyTo: { email: data.email, name: data.name } } : {}),
      subject: `Novo Orcamento: ${data.name} — ${data.from} → ${data.to}`,
      htmlContent: companyHtml,
    });

    // ═══ EMAIL 2: To client (only if email provided) ═══
    if (data.email) {
      const clientHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#5A9E2F;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
    <h2 style="margin:0;font-size:22px;">Pedido Recebido!</h2>
    <p style="margin:8px 0 0;opacity:0.85;font-size:15px;">Obrigado, ${data.name}!</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <p style="font-size:15px;color:#334155;line-height:1.6;">Recebemos o seu pedido de orcamento para a mudanca de <strong>${data.from}</strong> para <strong>${data.to}</strong>.</p>
    <p style="font-size:15px;color:#334155;line-height:1.6;">A nossa equipa ira entrar em contacto consigo <strong>dentro de 24 horas</strong>.</p>
    <div style="background:#f8fafb;border-radius:8px;padding:16px;margin:20px 0;font-size:14px;">
      <p style="margin:0;color:#475569;">${data.from} &rarr; ${data.to}</p>
      ${data.date ? `<p style="margin:4px 0 0;color:#475569;">${data.date}</p>` : ""}
      ${data.type ? `<p style="margin:4px 0 0;color:#475569;">${data.type}</p>` : ""}
    </div>
    <p style="font-size:14px;color:#64748b;">Contacte-nos:</p>
    <p style="font-size:14px;"><a href="tel:+351932844460" style="color:#5A9E2F;">+351 932 844 460</a> | <a href="https://wa.me/351932844460" style="color:#25D366;">WhatsApp</a> | <a href="mailto:${companyEmail}" style="color:#5A9E2F;">${companyEmail}</a></p>
  </div>
  <p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:16px;">123cheguei &middot; <a href="https://123cheguei.pt" style="color:#5A9E2F;">123cheguei.pt</a></p>
</div>`.trim();

      try {
        await sendBrevoEmail(brevoKey, {
          sender: { name: "123cheguei", email: companyEmail },
          to: [{ email: data.email, name: data.name }],
          replyTo: { email: companyEmail, name: "123cheguei" },
          subject: `Recebemos o seu pedido — 123cheguei`,
          htmlContent: clientHtml,
        });
      } catch {
        console.error("Client confirmation email failed (non-blocking)");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", (error as Error).message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
