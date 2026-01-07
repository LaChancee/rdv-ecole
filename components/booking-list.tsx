import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatTime, groupBy } from "@/lib/utils";

interface Booking {
  id: string;
  parentName: string;
  childFirstname: string;
  email: string | null;
  comment: string | null;
  slot: {
    date: Date;
    startTime: string;
    endTime: string;
  };
}

interface BookingListProps {
  bookings: Booking[];
  sessionName: string;
}

export function BookingList({ bookings, sessionName }: BookingListProps) {
  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-muted-foreground text-center">
            Aucune réservation pour cette session.
          </p>
        </CardContent>
      </Card>
    );
  }

  const bookingsByDate = groupBy(bookings, (b) =>
    new Date(b.slot.date).toISOString().split("T")[0]
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{sessionName}</h2>
        <Badge variant="secondary">{bookings.length} rendez-vous</Badge>
      </div>

      {Object.entries(bookingsByDate).map(([dateStr, dateBookings]) => (
        <div key={dateStr}>
          <h3 className="font-medium text-lg mb-3 capitalize border-b pb-2">
            {formatDate(new Date(dateStr))}
          </h3>
          <div className="space-y-3">
            {dateBookings
              .sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime))
              .map((booking) => (
                <Card key={booking.id}>
                  <CardHeader className="py-3 pb-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        {formatTime(booking.slot.startTime)} -{" "}
                        {formatTime(booking.slot.endTime)}
                      </CardTitle>
                      <span className="font-semibold text-primary">
                        {booking.childFirstname}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm text-muted-foreground">
                      Parent : {booking.parentName}
                      {booking.email && ` (${booking.email})`}
                    </p>
                    {booking.comment && (
                      <p className="text-sm mt-1 italic">"{booking.comment}"</p>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
