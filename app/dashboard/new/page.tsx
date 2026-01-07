import Link from "next/link";
import { SessionForm } from "@/components/session-form";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Nouvelle session - RDV-École",
  description: "Créer une nouvelle session de rendez-vous",
};

export default function NewSessionPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard">← Retour au dashboard</Link>
          </Button>
        </div>

        <SessionForm />
      </div>
    </div>
  );
}
