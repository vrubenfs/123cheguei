import { NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email?: string;
  phone: string;
  from: string;
  to: string;
  date?: string;
  type?: string;
  notes?: string;
}

async function sendBrevoEmail(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    console.error("Brevo error:", err);
    throw new Error(`Brevo API error: ${res.status}`);
  }
  return res;
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    if (!data.name || !data.phone || !data.from || !data.to) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const brevoKey = process.env.BREVO_API_KEY;
    const companyEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

    if (!brevoKey) {
      console.log("=== NEW MOVE REQUEST (no BREVO_API_KEY set) ===");
      console.log(`Name: ${data.name} | Phone: ${data.phone} | Email: ${data.email || "N/A"}`);
      console.log(`From: ${data.from} → To: ${data.to}`);
      return NextResponse.json({ success: true });
    }

    // ═══════════════════════════════════════
    // EMAIL 1: To the company (quote request)
    // ═══════════════════════════════════════
    const companyEmailBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1E3A5F;color:white;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h2 style="margin:0;font-size:20px;">🚚 Novo Pedido de Orçamento</h2>
    <p style="margin:6px 0 0;opacity:0.7;font-size:14px;">${data.from} → ${data.to}</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <table style="font-size:14px;border-collapse:collapse;width:100%;">
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;width:120px;">Nome</td><td style="padding:10px 12px;">${data.name}</td></tr>
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Telefone</td><td style="padding:10px 12px;"><a href="tel:${data.phone}" style="color:#5A9E2F;text-decoration:none;font-weight:600;">${data.phone}</a></td></tr>
      ${data.email ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Email</td><td style="padding:10px 12px;"><a href="mailto:${data.email}" style="color:#5A9E2F;text-decoration:none;">${data.email}</a></td></tr>` : ""}
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Origem</td><td style="padding:10px 12px;">${data.from}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Destino</td><td style="padding:10px 12px;">${data.to}</td></tr>
      ${data.date ? `<tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Data</td><td style="padding:10px 12px;">${data.date}</td></tr>` : ""}
      ${data.type ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Tipologia</td><td style="padding:10px 12px;">${data.type}</td></tr>` : ""}
    </table>
    ${data.notes ? `<div style="margin-top:16px;padding:12px;background:#f8fafb;border-radius:8px;font-size:14px;"><strong>Observações:</strong><br/>${data.notes}</div>` : ""}
  </div>
  <p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:16px;">Enviado através do website 123cheguei.pt</p>
</div>`.trim();

    await sendBrevoEmail(brevoKey, {
      sender: { name: "123cheguei Website", email: companyEmail },
      to: [{ email: companyEmail, name: "123cheguei" }],
      ...(data.email ? { replyTo: { email: data.email, name: data.name } } : {}),
      subject: `🚚 Novo Orçamento: ${data.name} — ${data.from} → ${data.to}`,
      htmlContent: companyEmailBody,
    });

    // ═══════════════════════════════════════
    // EMAIL 2: To the client (confirmation)
    // Only if they provided an email address
    // ═══════════════════════════════════════
    if (data.email) {
      const clientEmailBody = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#5A9E2F;color:white;padding:24px;border-radius:12px 12px 0 0;text-align:center;">
    <h2 style="margin:0;font-size:22px;">✅ Pedido Recebido!</h2>
    <p style="margin:8px 0 0;opacity:0.85;font-size:15px;">Obrigado, ${data.name}!</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <p style="font-size:15px;color:#334155;line-height:1.6;">
      Recebemos o seu pedido de orçamento para a mudança de <strong>${data.from}</strong> para <strong>${data.to}</strong>.
    </p>
    <p style="font-size:15px;color:#334155;line-height:1.6;">
      A nossa equipa irá analisar o seu pedido e entrar em contacto consigo <strong>dentro de 24 horas</strong>.
    </p>
    <div style="background:#f8fafb;border-radius:8px;padding:16px;margin:20px 0;font-size:14px;">
      <p style="margin:0 0 8px;font-weight:bold;color:#1E3A5F;">Resumo do seu pedido:</p>
      <p style="margin:0;color:#475569;">📍 ${data.from} → ${data.to}</p>
      ${data.date ? `<p style="margin:4px 0 0;color:#475569;">📅 ${data.date}</p>` : ""}
      ${data.type ? `<p style="margin:4px 0 0;color:#475569;">🏠 ${data.type}</p>` : ""}
    </div>
    <p style="font-size:14px;color:#64748b;">
      Se tiver alguma dúvida, pode contactar-nos a qualquer momento:
    </p>
    <table style="font-size:14px;margin-top:12px;">
      <tr><td style="padding:4px 0;">📞</td><td style="padding:4px 8px;"><a href="tel:+351932844460" style="color:#5A9E2F;text-decoration:none;font-weight:600;">+351 932 844 460</a></td></tr>
      <tr><td style="padding:4px 0;">💬</td><td style="padding:4px 8px;"><a href="https://wa.me/351932844460" style="color:#25D366;text-decoration:none;font-weight:600;">WhatsApp</a></td></tr>
      <tr><td style="padding:4px 0;">✉️</td><td style="padding:4px 8px;"><a href="mailto:${companyEmail}" style="color:#5A9E2F;text-decoration:none;">${companyEmail}</a></td></tr>
    </table>
  </div>
  <p style="font-size:11px;color:#94a3b8;text-align:center;margin-top:16px;">
    123cheguei · Mudanças em Portugal & Europa · <a href="https://123cheguei.pt" style="color:#5A9E2F;">123cheguei.pt</a>
  </p>
</div>`.trim();

      try {
        await sendBrevoEmail(brevoKey, {
          sender: { name: "123cheguei", email: companyEmail },
          to: [{ email: data.email, name: data.name }],
          replyTo: { email: companyEmail, name: "123cheguei" },
          subject: `✅ Recebemos o seu pedido de orçamento — 123cheguei`,
          htmlContent: clientEmailBody,
        });
      } catch (err) {
        // Don't fail the whole request if client email fails
        console.error("Failed to send client confirmation:", err);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
