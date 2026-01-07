import Link from "next/link";
import { getAllSessions } from "@/lib/actions/sessions";
import { SessionList } from "@/components/session-list";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Dashboard - RDV-École",
  description: "Gérez vos sessions de rendez-vous",
};

export default async function DashboardPage() {
  const sessions = await getAllSessions();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Mes sessions de rendez-vous</h1>
            <p className="text-muted-foreground">
              Gérez vos rendez-vous parents-professeur
            </p>
          </div>
          <Button asChild>
            <Link href="/dashboard/new">+ Nouvelle session</Link>
          </Button>
        </div>

        <SessionList sessions={sessions} />
      </div>
    </div>
  );
}
