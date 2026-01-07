"use server";

import { sendEmail } from "@/lib/email";
import { formatDate, formatTime } from "@/lib/utils";

interface ConfirmationEmailData {
  parentName: string;
  childFirstname: string;
  parentEmail: string | null;
  teacherEmail: string;
  teacherName: string;
  sessionName: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export async function sendConfirmationEmails(data: ConfirmationEmailData) {
  const formattedDate = formatDate(data.date);
  const formattedTime = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;

  // Email to parent (if email provided)
  if (data.parentEmail) {
    await sendEmail({
      to: data.parentEmail,
      subject: `Confirmation RDV - ${data.teacherName}`,
      html: `
        <h2>Votre rendez-vous est confirmé !</h2>
        <p>Bonjour ${data.parentName},</p>
        <p>Votre rendez-vous avec <strong>${data.teacherName}</strong> pour <strong>${data.childFirstname}</strong> est confirmé.</p>
        <p><strong>Date :</strong> ${formattedDate}</p>
        <p><strong>Heure :</strong> ${formattedTime}</p>
        <p>À bientôt !</p>
        <hr>
        <p style="color: #666; font-size: 12px;">RDV-École - Prise de rendez-vous simplifiée</p>
      `,
    });
  }

  // Email to teacher
  await sendEmail({
    to: data.teacherEmail,
    subject: `Nouveau RDV - ${data.childFirstname} (${data.parentName})`,
    html: `
      <h2>Nouvelle réservation</h2>
      <p><strong>Parent :</strong> ${data.parentName}</p>
      <p><strong>Enfant :</strong> ${data.childFirstname}</p>
      <p><strong>Date :</strong> ${formattedDate}</p>
      <p><strong>Heure :</strong> ${formattedTime}</p>
      <hr>
      <p style="color: #666; font-size: 12px;">RDV-École</p>
    `,
  });
}

interface ReminderEmailData {
  parentName: string;
  childFirstname: string;
  parentEmail: string;
  teacherName: string;
  date: Date;
  startTime: string;
  endTime: string;
}

export async function sendReminderEmail(data: ReminderEmailData) {
  const formattedDate = formatDate(data.date);
  const formattedTime = `${formatTime(data.startTime)} - ${formatTime(data.endTime)}`;

  await sendEmail({
    to: data.parentEmail,
    subject: `Rappel RDV demain - ${data.teacherName}`,
    html: `
      <h2>Rappel : votre rendez-vous est demain !</h2>
      <p>Bonjour ${data.parentName},</p>
      <p>Nous vous rappelons votre rendez-vous avec <strong>${data.teacherName}</strong> pour <strong>${data.childFirstname}</strong>.</p>
      <p><strong>Date :</strong> ${formattedDate}</p>
      <p><strong>Heure :</strong> ${formattedTime}</p>
      <p>À demain !</p>
      <hr>
      <p style="color: #666; font-size: 12px;">RDV-École - Prise de rendez-vous simplifiée</p>
    `,
  });
}

export async function sendTeacherDailySummary(data: {
  teacherEmail: string;
  teacherName: string;
  date: Date;
  appointments: {
    parentName: string;
    childFirstname: string;
    startTime: string;
    endTime: string;
  }[];
}) {
  const formattedDate = formatDate(data.date);

  const appointmentsList = data.appointments
    .map(
      (apt) =>
        `<li>${formatTime(apt.startTime)} - ${apt.childFirstname} (${apt.parentName})</li>`
    )
    .join("");

  await sendEmail({
    to: data.teacherEmail,
    subject: `Vos RDV de demain - ${formattedDate}`,
    html: `
      <h2>Vos rendez-vous de demain</h2>
      <p>Bonjour ${data.teacherName},</p>
      <p>Voici vos rendez-vous pour demain (${formattedDate}) :</p>
      <ul>${appointmentsList}</ul>
      <hr>
      <p style="color: #666; font-size: 12px;">RDV-École</p>
    `,
  });
}
