import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Session {
  id: string;
  name: string;
  slug: string;
  teacherName: string;
  teacherClass: string;
  status: "active" | "archived";
  createdAt: Date;
  _count: { slots: number };
  slots: { id: string }[];
}

interface SessionListProps {
  sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Aucune session créée. Commencez par créer une nouvelle session.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        const bookedCount = session.slots.length;
        const totalSlots = session._count.slots;

        return (
          <Card key={session.id}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{session.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {session.teacherName} - {session.teacherClass}
                  </p>
                </div>
                <Badge variant={session.status === "active" ? "default" : "secondary"}>
                  {session.status === "active" ? "Active" : "Archivée"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <p className="text-sm">
                  <span className="font-medium">{bookedCount}</span> / {totalSlots}{" "}
                  créneaux réservés
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/${session.id}`}>Voir les RDV</Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/${session.slug}`} target="_blank">
                      Page parent
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
