"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createBookingSchema } from "@/lib/validations/booking";
import { sendConfirmationEmails } from "./emails";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createBooking(
  prevState: ActionResult<{ id: string }> | null,
  formData: FormData
): Promise<ActionResult<{ id: string }>> {
  const rawData = {
    slotId: formData.get("slotId"),
    parentName: formData.get("parentName"),
    childFirstname: formData.get("childFirstname"),
    email: formData.get("email") || undefined,
    comment: formData.get("comment") || undefined,
  };

  const validated = createBookingSchema.safeParse(rawData);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const { slotId, parentName, childFirstname, email, comment } = validated.data;

  try {
    const booking = await prisma.$transaction(async (tx) => {
      // Check slot availability
      const slot = await tx.slot.findUnique({
        where: { id: slotId },
        include: { session: true },
      });

      if (!slot) {
        throw new Error("Créneau introuvable");
      }

      if (slot.isBooked) {
        throw new Error("Ce créneau vient d'être réservé par quelqu'un d'autre");
      }

      // Create booking
      const newBooking = await tx.booking.create({
        data: {
          slotId,
          parentName,
          childFirstname,
          email: email || null,
          comment: comment || null,
        },
      });

      // Mark slot as booked
      await tx.slot.update({
        where: { id: slotId },
        data: { isBooked: true },
      });

      return { booking: newBooking, slot, session: slot.session };
    });

    // Send confirmation emails
    await sendConfirmationEmails({
      parentName,
      childFirstname,
      parentEmail: email || null,
      teacherEmail: booking.session.teacherEmail,
      teacherName: booking.session.teacherName,
      sessionName: booking.session.name,
      date: booking.slot.date,
      startTime: booking.slot.startTime,
      endTime: booking.slot.endTime,
    });

    revalidatePath(`/${booking.session.slug}`);
    return { success: true, data: { id: booking.booking.id } };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: "Une erreur est survenue" };
  }
}

export async function getBookingsBySession(sessionId: string) {
  return prisma.booking.findMany({
    where: {
      slot: {
        sessionId,
      },
    },
    include: {
      slot: true,
    },
    orderBy: {
      slot: {
        date: "asc",
      },
    },
  });
}
