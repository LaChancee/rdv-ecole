"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface LinkDisplayProps {
  slug: string;
}

export function LinkDisplay({ slug }: LinkDisplayProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== "undefined"
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const fullUrl = `${baseUrl}/${slug}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-1">Lien pour les parents :</p>
        <code className="text-sm bg-gray-100 px-2 py-1 rounded block truncate">
          {fullUrl}
        </code>
      </div>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? "Copié !" : "Copier"}
      </Button>
    </div>
  );
}
