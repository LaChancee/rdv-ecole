import nodemailer from "nodemailer";

// Brevo (ex-Sendinblue) SMTP configuration
// Free tier: 300 emails/day
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
    console.warn("Email not configured, skipping send");
    return;
  }

  await transporter.sendMail({
    from: `"RDV-École" <${process.env.BREVO_SENDER_EMAIL || process.env.BREVO_SMTP_USER}>`,
    to,
    subject,
    html,
  });
}
