import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { sendReminderEmail, sendTeacherDailySummary } from "@/lib/actions/emails";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get tomorrow's date
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Find all bookings for tomorrow that haven't received a reminder
    const bookingsToRemind = await prisma.booking.findMany({
      where: {
        reminderSent: false,
        email: { not: null },
        slot: {
          date: {
            gte: tomorrow,
            lt: dayAfterTomorrow,
          },
          session: {
            status: "active",
          },
        },
      },
      include: {
        slot: {
          include: {
            session: true,
          },
        },
      },
    });

    // Send reminders to parents
    for (const booking of bookingsToRemind) {
      if (booking.email) {
        await sendReminderEmail({
          parentName: booking.parentName,
          childFirstname: booking.childFirstname,
          parentEmail: booking.email,
          teacherName: booking.slot.session.teacherName,
          date: booking.slot.date,
          startTime: booking.slot.startTime,
          endTime: booking.slot.endTime,
        });

        // Mark reminder as sent
        await prisma.booking.update({
          where: { id: booking.id },
          data: { reminderSent: true },
        });
      }
    }

    // Get unique sessions with tomorrow's appointments
    const sessionsWithAppointments = await prisma.session.findMany({
      where: {
        status: "active",
        slots: {
          some: {
            date: {
              gte: tomorrow,
              lt: dayAfterTomorrow,
            },
            isBooked: true,
          },
        },
      },
      include: {
        slots: {
          where: {
            date: {
              gte: tomorrow,
              lt: dayAfterTomorrow,
            },
            isBooked: true,
          },
          include: {
            booking: true,
          },
          orderBy: {
            startTime: "asc",
          },
        },
      },
    });

    // Send daily summary to each teacher
    for (const session of sessionsWithAppointments) {
      const appointments = session.slots
        .filter((slot: { booking: unknown }) => slot.booking)
        .map((slot: { booking: { parentName: string; childFirstname: string } | null; startTime: string; endTime: string }) => ({
          parentName: slot.booking!.parentName,
          childFirstname: slot.booking!.childFirstname,
          startTime: slot.startTime,
          endTime: slot.endTime,
        }));

      if (appointments.length > 0) {
        await sendTeacherDailySummary({
          teacherEmail: session.teacherEmail,
          teacherName: session.teacherName,
          date: tomorrow,
          appointments,
        });
      }
    }

    return Response.json({
      success: true,
      remindersCount: bookingsToRemind.length,
      teacherSummaries: sessionsWithAppointments.length,
    });
  } catch (error) {
    console.error("Cron error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
