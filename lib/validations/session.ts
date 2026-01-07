import { z } from "zod";

export const slotGroupSchema = z.object({
  dates: z.array(z.coerce.date()).min(1, "Au moins une date requise"),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM requis"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format HH:MM requis"),
  duration: z.number().min(5).max(60),
});

export const createSessionSchema = z.object({
  name: z.string().min(3, "Nom de session requis"),
  teacherName: z.string().min(2, "Nom de l'enseignant requis"),
  teacherEmail: z.string().email("Email invalide"),
  teacherClass: z.string().min(1, "Classe requise"),
  slotGroups: z.array(slotGroupSchema).min(1, "Au moins un groupe de créneaux requis"),
});

export type SlotGroup = z.infer<typeof slotGroupSchema>;
export type CreateSessionInput = z.infer<typeof createSessionSchema>;
