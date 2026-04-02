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

    // Validate required fields
    if (!data.name || !data.email || !data.phone || !data.from || !data.to) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build email body
    const emailBody = `
Novo Pedido de Orçamento - 123cheguei
======================================

Nome: ${data.name}
Email: ${data.email}
Telefone: ${data.phone}

Morada de Origem: ${data.from}
Morada de Destino: ${data.to}

Data Pretendida: ${data.date || "Não especificada"}
Tipologia: ${data.type || "Não especificada"}

Observações:
${data.notes || "Sem observações"}

======================================
Enviado através do website 123cheguei.pt
    `.trim();

    // Option 1: Using Resend (recommended - set RESEND_API_KEY env var)
    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

    if (resendKey) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "123cheguei <noreply@123cheguei.pt>",
          to: [toEmail],
          reply_to: data.email,
          subject: `Novo Orçamento: ${data.name} - ${data.from} → ${data.to}`,
          text: emailBody,
        }),
      });

      if (!res.ok) {
        console.error("Resend error:", await res.text());
        return NextResponse.json(
          { error: "Failed to send email" },
          { status: 500 }
        );
      }
    } else {
      // Fallback: log to console when no email service is configured
      console.log("=== NEW MOVE REQUEST ===");
      console.log(emailBody);
      console.log("========================");
      console.log(
        "To enable email sending, set RESEND_API_KEY and CONTACT_EMAIL environment variables."
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
