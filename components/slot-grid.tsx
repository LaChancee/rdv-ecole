"use client";

import { cn, formatDate, formatTime, groupBy } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Slot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface SlotGridProps {
  slots: Slot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
}

export function SlotGrid({ slots, selectedSlotId, onSelectSlot }: SlotGridProps) {
  const slotsByDate = groupBy(slots, (slot) =>
    new Date(slot.date).toISOString().split("T")[0]
  );

  return (
    <div className="space-y-6">
      {Object.entries(slotsByDate).map(([dateStr, dateSlots]) => (
        <div key={dateStr}>
          <h3 className="font-medium text-lg mb-3 capitalize">
            {formatDate(new Date(dateStr))}
          </h3>
          <div className="flex flex-wrap gap-2">
            {dateSlots.map((slot) => (
              <Button
                key={slot.id}
                type="button"
                variant={
                  slot.isBooked
                    ? "outline"
                    : selectedSlotId === slot.id
                      ? "default"
                      : "secondary"
                }
                size="sm"
                disabled={slot.isBooked}
                onClick={() => onSelectSlot(slot.id)}
                className={cn(
                  slot.isBooked && "opacity-50 line-through cursor-not-allowed"
                )}
              >
                {formatTime(slot.startTime)}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
