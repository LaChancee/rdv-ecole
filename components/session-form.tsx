"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSession } from "@/lib/actions/sessions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SessionForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [dates, setDates] = useState<string[]>([""]);

  const addDate = () => setDates([...dates, ""]);
  const removeDate = (index: number) =>
    setDates(dates.filter((_, i) => i !== index));
  const updateDate = (index: number, value: string) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setIsPending(true);

    const formData = new FormData(e.currentTarget);

    const input = {
      name: formData.get("name") as string,
      teacherName: formData.get("teacherName") as string,
      teacherEmail: formData.get("teacherEmail") as string,
      teacherClass: formData.get("teacherClass") as string,
      slotConfig: {
        dates: dates.filter(Boolean).map((d) => new Date(d)),
        startTime: formData.get("startTime") as string,
        endTime: formData.get("endTime") as string,
        duration: parseInt(formData.get("duration") as string, 10),
      },
    };

    const result = await createSession(input);

    setIsPending(false);

    if (result.success) {
      router.push(`/dashboard`);
    } else {
      setError(result.error);
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Nouvelle session de rendez-vous</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Informations de la session</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Nom de la session *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="RDV Novembre 2026"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacherName">Votre nom *</Label>
                <Input
                  id="teacherName"
                  name="teacherName"
                  required
                  placeholder="Mme Martin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacherClass">Classe *</Label>
                <Input
                  id="teacherClass"
                  name="teacherClass"
                  required
                  placeholder="CE1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teacherEmail">Votre email *</Label>
              <Input
                id="teacherEmail"
                name="teacherEmail"
                type="email"
                required
                placeholder="enseignant@email.com"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Configuration des créneaux</h3>

            <div className="space-y-2">
              <Label>Dates des rendez-vous *</Label>
              {dates.map((date, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => updateDate(index, e.target.value)}
                    required={index === 0}
                  />
                  {dates.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeDate(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDate}
              >
                + Ajouter une date
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Heure de début *</Label>
                <Input
                  id="startTime"
                  name="startTime"
                  type="time"
                  required
                  defaultValue="17:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">Heure de fin *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  required
                  defaultValue="20:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Durée (min) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  min="5"
                  max="60"
                  required
                  defaultValue="15"
                />
              </div>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Création en cours..." : "Créer la session"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
