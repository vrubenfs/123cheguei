import { NextResponse, NextRequest } from "next/server";

// ─── HTML Escaping ───
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
  if (phone.length > 30 || !/^[+\d\s()\-]{6,30}$/.test(phone))
    return "Invalid phone";
  if (from.length > 200) return "Origin too long";
  if (to.length > 200) return "Destination too long";
  if (
    email &&
    (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
  )
    return "Invalid email";
  if (notes.length > 2000) return "Notes too long";
  return null;
}

// ─── Rate Limiting ───
const rateMap = new Map<string, number[]>();
const RATE_LIMIT = 5;
const RATE_WINDOW = 60 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps =
    rateMap.get(ip)?.filter((t) => now - t < RATE_WINDOW) || [];
  if (timestamps.length >= RATE_LIMIT) return true;
  timestamps.push(now);
  rateMap.set(ip, timestamps);
  return false;
}

// ─── Brevo Email Sender ───
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

// ─── Notion: Create page in quotes database ───
async function createNotionQuote(data: {
  name: string;
  phone: string;
  email: string;
  from: string;
  to: string;
  date: string;
  type: string;
  notes: string;
}): Promise<string> {
  const notionKey = process.env.NOTION_API_KEY;
  const dbId = process.env.NOTION_DB_ID;
  if (!notionKey || !dbId) throw new Error("Notion not configured");

  const webhookSecret = process.env.WEBHOOK_SECRET || "changeme";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://123cheguei.pt";

  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${notionKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      parent: { database_id: dbId },
      properties: {
        Nome: { title: [{ text: { content: data.name } }] },
        Telefone: { rich_text: [{ text: { content: data.phone } }] },
        ...(data.email ? { Email: { email: data.email } } : {}),
        Origem: { rich_text: [{ text: { content: data.from } }] },
        Destino: { rich_text: [{ text: { content: data.to } }] },
        ...(data.date ? { Data: { date: { start: data.date } } } : {}),
        ...(data.type
          ? { Tipologia: { rich_text: [{ text: { content: data.type } }] } }
          : {}),
        ...(data.notes
          ? { Notas: { rich_text: [{ text: { content: data.notes } }] } }
          : {}),
        Estado: { select: { name: "Novo" } },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("Notion API error:", err.substring(0, 300));
    throw new Error(`Notion: ${res.status}`);
  }

  const page = await res.json();
  const pageId = page.id;

  // Add "Send Email" button as page content
  const approveUrl = `${siteUrl}/api/approve?id=${pageId}&secret=${webhookSecret}`;
  await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${notionKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      children: [
        {
          type: "callout",
          callout: {
            icon: { emoji: "📧" },
            rich_text: [
              { text: { content: "Enviar email para a empresa: " } },
              {
                text: {
                  content: "Clique aqui para aprovar e enviar",
                  link: { url: approveUrl },
                },
                annotations: { bold: true },
              },
            ],
          },
        },
        {
          type: "divider",
          divider: {},
        },
        {
          type: "heading_3",
          heading_3: {
            rich_text: [{ text: { content: "Detalhes do Pedido" } }],
          },
        },
        {
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                text: { content: `${data.from} → ${data.to}` },
                annotations: { bold: true },
              },
              { text: { content: data.date ? `\nData: ${data.date}` : "" } },
              {
                text: { content: data.type ? `\nTipologia: ${data.type}` : "" },
              },
              { text: { content: data.notes ? `\nNotas: ${data.notes}` : "" } },
            ],
          },
        },
      ],
    }),
  });

  return pageId;
}

// ─── Main Handler ───
export async function POST(request: NextRequest) {
  try {
    // CSRF
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

    // Rate limit
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests." },
        { status: 429 },
      );
    }

    const raw = await request.json();
    if (raw.website) return NextResponse.json({ success: true }); // honeypot

    const validationError = validateInput(raw);
    if (validationError)
      return NextResponse.json({ error: validationError }, { status: 400 });

    const data = {
      name: String(raw.name).trim(),
      email: raw.email ? String(raw.email).trim() : "",
      phone: String(raw.phone).trim(),
      from: String(raw.from).trim(),
      to: String(raw.to).trim(),
      date: raw.date ? String(raw.date).trim() : "",
      type: raw.type ? String(raw.type).trim() : "",
      notes: raw.notes ? String(raw.notes).trim() : "",
    };

    // ═══ Save to Notion (replaces company email) ═══
    try {
      await createNotionQuote(data);
    } catch (err) {
      console.error("Failed to save to Notion:", (err as Error).message);
      return NextResponse.json(
        { error: "Failed to process request" },
        { status: 500 },
      );
    }

    // ═══ Client confirmation email (still immediate) ═══
    const brevoKey = process.env.BREVO_API_KEY;
    const companyEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

    if (brevoKey && data.email) {
      const clientHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#5A9E2F;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
    <h2 style="margin:0;font-size:22px;">Pedido Recebido!</h2>
    <p style="margin:8px 0 0;opacity:0.85;font-size:15px;">Obrigado, ${esc(data.name)}!</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <p style="font-size:15px;color:#334155;line-height:1.6;">Recebemos o seu pedido de orcamento para a mudanca de <strong>${esc(data.from)}</strong> para <strong>${esc(data.to)}</strong>.</p>
    <p style="font-size:15px;color:#334155;line-height:1.6;">A nossa equipa ira entrar em contacto consigo <strong>dentro de 24 horas</strong>.</p>
    <p style="font-size:14px;color:#64748b;">Contacte-nos:</p>
    <p style="font-size:14px;"><a href="tel:+351932844460" style="color:#5A9E2F;">+351 932 844 460</a> | <a href="https://wa.me/351932844460" style="color:#25D366;">WhatsApp</a> | <a href="mailto:${companyEmail}" style="color:#5A9E2F;">${companyEmail}</a></p>
  </div>
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
        console.error("Client confirmation email failed");
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", (error as Error).message);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
