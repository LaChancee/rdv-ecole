import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-900">
            RDV-École
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Prise de rendez-vous parents-professeur simplifiée
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2 text-center text-sm text-muted-foreground">
            <p>Premier arrivé, premier servi.</p>
            <p>Plus d&apos;arbitrage, plus de confusion.</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full" size="lg">
              <Link href="/dashboard">Accéder au dashboard</Link>
            </Button>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-medium mb-2">Comment ça marche ?</h3>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Créez une session de rendez-vous</li>
              <li>Partagez le lien aux parents</li>
              <li>Les parents réservent en autonomie</li>
              <li>Recevez des notifications par email</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
