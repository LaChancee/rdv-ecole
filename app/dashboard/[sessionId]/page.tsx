import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionWithBookings } from "@/lib/actions/sessions";
import { BookingList } from "@/components/booking-list";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ sessionId: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { sessionId } = await params;
  const session = await getSessionWithBookings(sessionId);

  if (!session) {
    return { title: "Session introuvable" };
  }

  return {
    title: `${session.name} - RDV-École`,
  };
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { sessionId } = await params;
  const session = await getSessionWithBookings(sessionId);

  if (!session) {
    notFound();
  }

  const bookings = session.slots
    .filter((slot) => slot.booking)
    .map((slot) => ({
      id: slot.booking!.id,
      parentName: slot.booking!.parentName,
      childFirstname: slot.booking!.childFirstname,
      email: slot.booking!.email,
      comment: slot.booking!.comment,
      slot: {
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
      },
    }));

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">← Retour au dashboard</Link>
          </Button>
        </div>

        <div className="mb-4 p-4 bg-white rounded-lg border">
          <p className="text-sm text-muted-foreground">
            Lien pour les parents :{" "}
            <code className="bg-gray-100 px-2 py-1 rounded">
              {process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/
              {session.slug}
            </code>
          </p>
        </div>

        <BookingList bookings={bookings} sessionName={session.name} />
      </div>
    </div>
  );
}
