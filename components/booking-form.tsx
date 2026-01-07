"use client";

import { useActionState } from "react";
import { createBooking, type ActionResult } from "@/lib/actions/bookings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatTime } from "@/lib/utils";

interface BookingFormProps {
  selectedSlot: {
    id: string;
    date: Date;
    startTime: string;
    endTime: string;
  } | null;
  teacherName: string;
}

export function BookingForm({ selectedSlot, teacherName }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState<
    ActionResult<{ id: string }> | null,
    FormData
  >(createBooking, null);

  if (!selectedSlot) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Sélectionnez un créneau pour réserver
          </p>
        </CardContent>
      </Card>
    );
  }

  if (state?.success) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-green-800">
              Rendez-vous confirmé !
            </h3>
            <p className="text-green-700">
              Votre rendez-vous avec {teacherName} est réservé pour le{" "}
              {formatDate(selectedSlot.date)} à {formatTime(selectedSlot.startTime)}.
            </p>
            {state.data && (
              <p className="text-sm text-green-600">
                Un email de confirmation vous a été envoyé.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Réserver le {formatDate(selectedSlot.date)} à{" "}
          {formatTime(selectedSlot.startTime)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="slotId" value={selectedSlot.id} />

          <div className="space-y-2">
            <Label htmlFor="parentName">Nom du parent *</Label>
            <Input
              id="parentName"
              name="parentName"
              required
              placeholder="Dupont"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="childFirstname">Prénom de l'enfant *</Label>
            <Input
              id="childFirstname"
              name="childFirstname"
              required
              placeholder="Lucas"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (optionnel)</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="parent@email.com"
            />
            <p className="text-xs text-muted-foreground">
              Pour recevoir une confirmation et un rappel
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Textarea
              id="comment"
              name="comment"
              placeholder="Informations complémentaires..."
              rows={3}
            />
          </div>

          {state?.success === false && (
            <p className="text-sm text-red-600">{state.error}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Réservation en cours..." : "Confirmer le rendez-vous"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
