"use client";

import { useState } from "react";
import { SlotGrid } from "@/components/slot-grid";
import { BookingForm } from "@/components/booking-form";

interface Slot {
  id: string;
  date: Date;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface BookingPageClientProps {
  slots: Slot[];
  teacherName: string;
}

export function BookingPageClient({ slots, teacherName }: BookingPageClientProps) {
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);

  const selectedSlot = slots.find((s) => s.id === selectedSlotId) || null;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <h2 className="text-lg font-medium mb-4">Choisissez un créneau</h2>
        <SlotGrid
          slots={slots}
          selectedSlotId={selectedSlotId}
          onSelectSlot={setSelectedSlotId}
        />
      </div>
      <div>
        <h2 className="text-lg font-medium mb-4">Vos informations</h2>
        <BookingForm selectedSlot={selectedSlot} teacherName={teacherName} />
      </div>
    </div>
  );
}
