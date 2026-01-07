import { z } from "zod";

export const createBookingSchema = z.object({
  slotId: z.string().min(1, "Créneau requis"),
  parentName: z.string().min(2, "Le nom est requis"),
  childFirstname: z.string().min(2, "Le prénom de l'enfant est requis"),
  email: z
    .string()
    .email("Email invalide")
    .optional()
    .or(z.literal("")),
  comment: z.string().max(500, "Commentaire trop long").optional(),
});

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
