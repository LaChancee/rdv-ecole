"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { createSession } from "@/lib/actions/sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

interface SlotGroup {
  id: string;
  dates: Date[];
  startTime: string;
  endTime: string;
  duration: number;
}

export function SessionForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  // Teacher info
  const [name, setName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherClass, setTeacherClass] = useState("");

  // Slot groups
  const [slotGroups, setSlotGroups] = useState<SlotGroup[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [startTime, setStartTime] = useState("17:00");
  const [endTime, setEndTime] = useState("20:00");
  const [duration, setDuration] = useState(15);

  // Get all dates already used in groups
  const usedDates = slotGroups.flatMap((g) => g.dates);

  const addGroup = () => {
    if (selectedDates.length === 0) return;

    const newGroup: SlotGroup = {
      id: crypto.randomUUID(),
      dates: selectedDates,
      startTime,
      endTime,
      duration,
    };

    setSlotGroups([...slotGroups, newGroup]);
    setSelectedDates([]);
  };

  const removeGroup = (id: string) => {
    setSlotGroups(slotGroups.filter((g) => g.id !== id));
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) {
      setSelectedDates([]);
      return;
    }
    // Filter out dates already used in other groups
    const availableDates = dates.filter(
      (d) => !usedDates.some((ud) => ud.toDateString() === d.toDateString())
    );
    setSelectedDates(availableDates);
  };

  const isDateDisabled = (date: Date) => {
    return usedDates.some((ud) => ud.toDateString() === date.toDateString());
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (slotGroups.length === 0) {
      setError("Ajoutez au moins un groupe de créneaux");
      return;
    }

    setIsPending(true);

    const input = {
      name,
      teacherName,
      teacherEmail,
      teacherClass,
      slotGroups: slotGroups.map((g) => ({
        dates: g.dates,
        startTime: g.startTime,
        endTime: g.endTime,
        duration: g.duration,
      })),
    };

    const result = await createSession(input);

    setIsPending(false);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.error);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Nouvelle session de rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Teacher Info Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Informations de la session</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Nom de la session *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="RDV Novembre 2026"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Votre nom *</Label>
                <Input
                  id="teacherName"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  required
                  placeholder="Mme Martin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherClass">Classe *</Label>
                <Input
                  id="teacherClass"
                  value={teacherClass}
                  onChange={(e) => setTeacherClass(e.target.value)}
                  required
                  placeholder="CE1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherEmail">Votre email *</Label>
              <Input
                id="teacherEmail"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                type="email"
                required
                placeholder="enseignant@email.com"
              />
            </div>
          </div>

          {/* Slot Groups Section */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Configuration des créneaux</h3>
            <p className="text-sm text-muted-foreground">
              Sélectionnez des dates sur le calendrier, définissez les horaires,
              puis cliquez sur &quot;Ajouter ce groupe&quot;. Vous pouvez créer
              plusieurs groupes avec des horaires différents.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Calendar */}
              <div className="flex flex-col items-center lg:items-start">
                <Label className="mb-2 block self-start">Sélectionnez les dates</Label>
                <div className="border rounded-lg p-2 inline-flex justify-center w-full sm:w-auto">
                  <Calendar
                    mode="multiple"
                    selected={selectedDates}
                    onSelect={handleDateSelect}
                    disabled={isDateDisabled}
                    fromDate={new Date()}
                    numberOfMonths={1}
                  />
                </div>
                {selectedDates.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2 self-start">
                    {selectedDates.length} date(s) sélectionnée(s)
                  </p>
                )}
              </div>

              {/* Time config */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Début</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Fin</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Durée (min)</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="5"
                      max="60"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={addGroup}
                  disabled={selectedDates.length === 0}
                  className="w-full"
                >
                  + Ajouter ce groupe
                </Button>
              </div>
            </div>

            {/* Created groups */}
            {slotGroups.length > 0 && (
              <div className="space-y-3 mt-6">
                <Label>Groupes créés</Label>
                {slotGroups.map((group) => (
                  <div
                    key={group.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-secondary/50 rounded-lg"
                  >
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex flex-wrap gap-1">
                        {group.dates.map((d) => (
                          <Badge key={d.toISOString()} variant="outline" className="text-xs">
                            {format(d, "EEE d/MM", { locale: fr })}
                          </Badge>
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {group.startTime.replace(":", "h")} -{" "}
                        {group.endTime.replace(":", "h")} • {group.duration} min
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeGroup(group.id)}
                      className="self-end sm:self-auto shrink-0"
                    >
                      Supprimer
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending || slotGroups.length === 0}
          >
            {isPending ? "Création en cours..." : "Créer la session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
