"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  createSessionSchema,
  type CreateSessionInput,
} from "@/lib/validations/session";
import { generateSlug, generateTimeSlots } from "@/lib/utils";

export type ActionResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export async function createSession(
  input: CreateSessionInput
): Promise<ActionResult<{ id: string; slug: string }>> {
  const validated = createSessionSchema.safeParse(input);
  if (!validated.success) {
    return { success: false, error: validated.error.errors[0].message };
  }

  const { name, teacherName, teacherEmail, teacherClass, slotConfig } =
    validated.data;
  const slug = generateSlug(teacherName, name);

  // Check if slug already exists
  const existing = await prisma.session.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, error: "Une session avec ce nom existe déjà" };
  }

  const generatedSlots = generateTimeSlots(slotConfig);

  try {
    const session = await prisma.$transaction(async (tx) => {
      const newSession = await tx.session.create({
        data: {
          name,
          slug,
          teacherName,
          teacherEmail,
          teacherClass,
        },
      });

      await tx.slot.createMany({
        data: generatedSlots.map((slot) => ({
          sessionId: newSession.id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
        })),
      });

      return newSession;
    });

    revalidatePath("/dashboard");
    return { success: true, data: { id: session.id, slug: session.slug } };
  } catch {
    return { success: false, error: "Erreur lors de la création de la session" };
  }
}

export async function getSessionBySlug(slug: string) {
  return prisma.session.findUnique({
    where: { slug, status: "active" },
    include: {
      slots: {
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
        include: {
          booking: true,
        },
      },
    },
  });
}

export async function getAllSessions() {
  return prisma.session.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { slots: true },
      },
      slots: {
        where: { isBooked: true },
        select: { id: true },
      },
    },
  });
}

export async function getSessionWithBookings(sessionId: string) {
  return prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      slots: {
        orderBy: [{ date: "asc" }, { startTime: "asc" }],
        include: {
          booking: true,
        },
      },
    },
  });
}

export async function archiveSession(
  sessionId: string
): Promise<ActionResult<void>> {
  try {
    await prisma.session.update({
      where: { id: sessionId },
      data: { status: "archived" },
    });
    revalidatePath("/dashboard");
    return { success: true, data: undefined };
  } catch {
    return { success: false, error: "Erreur lors de l'archivage" };
  }
}
