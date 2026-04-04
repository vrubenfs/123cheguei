import { NextResponse, NextRequest } from "next/server";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ─── Fetch Notion page properties ───
async function getNotionPage(pageId: string, notionKey: string) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    headers: {
      Authorization: `Bearer ${notionKey}`,
      "Notion-Version": "2022-06-28",
    },
  });
  if (!res.ok) throw new Error(`Notion fetch: ${res.status}`);
  return res.json();
}

// ─── Update Notion page status ───
async function updateNotionStatus(
  pageId: string,
  status: string,
  notionKey: string,
) {
  const res = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${notionKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      properties: { Estado: { select: { name: status } } },
    }),
  });
  if (!res.ok) throw new Error(`Notion update: ${res.status}`);
}

// ─── Extract text from Notion rich_text property ───
function getText(prop: { rich_text?: Array<{ plain_text: string }> }): string {
  return prop?.rich_text?.map((t) => t.plain_text).join("") || "";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const pageId = searchParams.get("id");
  const secret = searchParams.get("secret");

  const webhookSecret = process.env.WEBHOOK_SECRET;
  const notionKey = process.env.NOTION_API_KEY;
  const brevoKey = process.env.BREVO_API_KEY;
  const companyEmail = process.env.CONTACT_EMAIL || "info@123cheguei.pt";

  // Validate
  if (!pageId || !secret || secret !== webhookSecret) {
    return new NextResponse(
      "<html><body><h1>Acesso negado</h1></body></html>",
      {
        status: 403,
        headers: { "Content-Type": "text/html" },
      },
    );
  }

  if (!notionKey || !brevoKey) {
    return new NextResponse(
      "<html><body><h1>Serviço não configurado</h1></body></html>",
      {
        status: 500,
        headers: { "Content-Type": "text/html" },
      },
    );
  }

  try {
    // Fetch quote data from Notion
    const page = await getNotionPage(pageId, notionKey);
    const props = page.properties;

    // Check if already sent
    const currentStatus = props.Estado?.select?.name;
    if (currentStatus === "Enviado") {
      return new NextResponse(
        `<html><body style="font-family:Arial;padding:40px;text-align:center;"><h1>⚠️ Já enviado</h1><p>Este orçamento já foi enviado por email.</p></body></html>`,
        {
          status: 200,
          headers: { "Content-Type": "text/html" },
        },
      );
    }

    // Extract data
    const name = props.Nome?.title?.[0]?.plain_text || "Sem nome";
    const phone = getText(props.Telefone);
    const email = props.Email?.email || "";
    const from = getText(props.Origem);
    const to = getText(props.Destino);
    const date = props.Data?.date?.start || "";
    const type = getText(props.Tipologia);
    const notes = getText(props.Notas);

    // Send company email via Brevo
    const companyHtml = `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
  <div style="background:#1E3A5F;color:white;padding:20px 24px;border-radius:12px 12px 0 0;">
    <h2 style="margin:0;font-size:20px;">Novo Pedido de Orcamento (Aprovado)</h2>
    <p style="margin:6px 0 0;opacity:0.7;font-size:14px;">${esc(from)} &rarr; ${esc(to)}</p>
  </div>
  <div style="border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:24px;">
    <table style="font-size:14px;border-collapse:collapse;width:100%;">
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;width:120px;">Nome</td><td style="padding:10px 12px;">${esc(name)}</td></tr>
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Telefone</td><td style="padding:10px 12px;"><a href="tel:${esc(phone)}" style="color:#5A9E2F;">${esc(phone)}</a></td></tr>
      ${email ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Email</td><td style="padding:10px 12px;"><a href="mailto:${esc(email)}" style="color:#5A9E2F;">${esc(email)}</a></td></tr>` : ""}
      <tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Origem</td><td style="padding:10px 12px;">${esc(from)}</td></tr>
      <tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Destino</td><td style="padding:10px 12px;">${esc(to)}</td></tr>
      ${date ? `<tr style="background:#f8fafb;"><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Data</td><td style="padding:10px 12px;">${esc(date)}</td></tr>` : ""}
      ${type ? `<tr><td style="padding:10px 12px;font-weight:bold;color:#1E3A5F;">Tipologia</td><td style="padding:10px 12px;">${esc(type)}</td></tr>` : ""}
    </table>
    ${notes ? `<div style="margin-top:16px;padding:12px;background:#f8fafb;border-radius:8px;font-size:14px;"><strong>Observacoes:</strong><br/>${esc(notes)}</div>` : ""}
  </div>
</div>`.trim();

    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        sender: { name: "123cheguei Website", email: companyEmail },
        to: [{ email: companyEmail, name: "123cheguei" }],
        ...(email ? { replyTo: { email, name } } : {}),
        subject: `✅ Aprovado: ${name} — ${from} → ${to}`,
        htmlContent: companyHtml,
      }),
    });

    // Update Notion status to "Enviado"
    await updateNotionStatus(pageId, "Enviado", notionKey);

    return new NextResponse(
      `<html>
<head><meta charset="utf-8"><title>Email Enviado</title></head>
<body style="font-family:Arial,sans-serif;padding:60px;text-align:center;background:#f8fafb;">
  <div style="max-width:400px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
    <div style="width:64px;height:64px;background:#5A9E2F20;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
      <span style="font-size:32px;">✅</span>
    </div>
    <h1 style="color:#1E3A5F;font-size:22px;margin:0 0 8px;">Email Enviado!</h1>
    <p style="color:#64748b;font-size:15px;margin:0 0 20px;">O orçamento de <strong>${esc(name)}</strong> foi enviado para ${esc(companyEmail)}.</p>
    <p style="color:#94a3b8;font-size:13px;">${esc(from)} → ${esc(to)}</p>
    <a href="https://notion.so/${pageId.replace(/-/g, "")}" style="display:inline-block;margin-top:20px;color:#5A9E2F;font-weight:600;text-decoration:none;">← Voltar ao Notion</a>
  </div>
</body>
</html>`,
      { status: 200, headers: { "Content-Type": "text/html" } },
    );
  } catch (error) {
    console.error("Approve error:", (error as Error).message);
    return new NextResponse(
      `<html><body style="font-family:Arial;padding:40px;text-align:center;"><h1>❌ Erro</h1><p>Não foi possível enviar o email. Tente novamente.</p></body></html>`,
      { status: 500, headers: { "Content-Type": "text/html" } },
    );
  }
}
