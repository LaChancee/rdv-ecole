import { notFound } from "next/navigation";
import { getSessionBySlug } from "@/lib/actions/sessions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookingPageClient } from "./booking-page-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);

  if (!session) {
    return { title: "Session introuvable" };
  }

  return {
    title: `RDV ${session.teacherName} - ${session.name}`,
    description: `Prenez rendez-vous avec ${session.teacherName}`,
  };
}

export default async function BookingPage({ params }: PageProps) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);

  if (!session) {
    notFound();
  }

  const availableSlots = session.slots.filter((s) => !s.isBooked).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-2xl">{session.name}</CardTitle>
            <p className="text-muted-foreground">
              {session.teacherName} - Classe de {session.teacherClass}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              <span className="font-medium">{availableSlots}</span> créneaux
              disponibles
            </p>
          </CardContent>
        </Card>

        {availableSlots === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Tous les créneaux ont été réservés.
              </p>
            </CardContent>
          </Card>
        ) : (
          <BookingPageClient
            slots={session.slots}
            teacherName={session.teacherName}
          />
        )}
      </div>
    </div>
  );
}
