import { Resend } from "resend";

export async function sendLeadEmail(lead) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.MAIL_TO;     // ventas@mime.com
  const from = process.env.MAIL_FROM; // ejemplo: "MIME <onboarding@resend.dev>" o tu dominio verificado

  if (!apiKey || !to || !from) return; // si no configuras env, no rompe nada

  const resend = new Resend(apiKey);

  const subject = `Nuevo contacto: ${lead.nombre} ${lead.apellido}`;
  const text = `
Nuevo lead recibido:

Nombre: ${lead.nombre} ${lead.apellido}
Email: ${lead.email}
Teléfono: ${lead.telefono}
Empresa: ${lead.empresa || "-"}
Cargo: ${lead.cargo || "-"}
Mensaje:
${lead.mensaje}
`;

  await resend.emails.send({
    from,
    to,
    subject,
    text,
  });
}
