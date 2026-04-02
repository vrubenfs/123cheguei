import { NextResponse } from "next/server";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  from: string;
  to: string;
  date?: string;
  type?: string;
  notes?: string;
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    if (!data.name || !data.phone || !data.from || !data.to) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const emailBody = `
<h2>Novo Pedido de Orçamento - 123cheguei</h2>
<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse;width:100%;max-width:500px;">
  <tr><td style="padding:8px;font-weight:bold;color:#1E3A5F;">Nome:</td><td style="padding:8px;">${data.name}</td></tr>
  <tr style="background:#f8f9fa;"><td style="padding:8px;font-weight:bold;color:#1E3A5F;">Email:</td><td style="padding:8px;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
  <tr><td style="padding:8px;font-weight:bold;color:#1E3A5F;">Telefone:</td><td style="padding:8px;"><a href="tel:${data.phone}">${data.phone}</a></td></tr>
  <tr style="background:#f8f9fa;"><td style="padding:8px;font-weight:bold;color:#1E3A5F;">Origem:</td><td style="padding:8px;">${data.from}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;color:#1E3A5F;">Destino:</td><td style="padding:8px;">${data.to}</td></tr>
  <tr style="background:#f8f9fa;"><td style="padding:8px;font-weight:bold;color:#1E3A5F;">Data:</td><td style="padding:8px;">${data.date || "Não especificada"}</td></tr>
  <tr><td style="padding:8px;font-weight:bold;color:#1E3A5F;">Tipologia:</td><td style="padding:8px;">${data.type || "Não especificada"}</td></tr>
</table>
${data.notes ? `<p style="margin-top:16px;"><strong>Observações:</strong><br/>${data.notes}</p>` : ""}
<hr style="margin-top:24px;border:none;border-top:1px solid #e5e7eb;"/>
<p style="font-size:12px;color:#94a3b8;">Enviado através do website 123cheguei.pt</p>
    `.trim();

    const brevoKey = process.env.BREVO_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

    if (brevoKey) {
      const res = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "api-key": brevoKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          sender: { name: "123cheguei Website", email: toEmail },
          to: [{ email: toEmail, name: "123cheguei" }],
          ...(data.email ? { replyTo: { email: data.email, name: data.name } } : {}),
          subject: `Novo Orçamento: ${data.name} — ${data.from} → ${data.to}`,
          htmlContent: emailBody,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("Brevo error:", err);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
      }
    } else {
      console.log("=== NEW MOVE REQUEST ===");
      console.log(`Name: ${data.name} | Email: ${data.email} | Phone: ${data.phone}`);
      console.log(`From: ${data.from} → To: ${data.to} | Date: ${data.date} | Type: ${data.type}`);
      console.log(`Notes: ${data.notes || "none"}`);
      console.log("Set BREVO_API_KEY env var to enable email sending.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
