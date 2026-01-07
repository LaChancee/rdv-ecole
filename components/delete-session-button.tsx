"use client";

import { useState } from "react";
import { deleteSession } from "@/lib/actions/sessions";
import { Button } from "@/components/ui/button";

interface DeleteSessionButtonProps {
  sessionId: string;
}

export function DeleteSessionButton({ sessionId }: DeleteSessionButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleDelete = async () => {
    setIsPending(true);
    await deleteSession(sessionId);
    setIsPending(false);
    setConfirming(false);
  };

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-red-600">Supprimer ?</span>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "..." : "Oui"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={isPending}
        >
          Non
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setConfirming(true)}
      className="text-red-600 hover:text-red-700 hover:bg-red-50"
    >
      Supprimer
    </Button>
  );
}
