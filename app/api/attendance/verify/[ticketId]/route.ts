import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET - Verify ticket and show attendance form
export async function GET(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const registration = await prisma.registration.findUnique({
      where: { ticketId: params.ticketId },
      include: {
        user: {
          select: { name: true, jisid: true, email: true },
        },
        event: {
          select: { title: true, date: true, venue: true },
        },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Invalid ticket ID" },
        { status: 404 }
      );
    }

    // Check if event is today or in the past (for attendance marking)
    const eventDate = new Date(registration.event.date);
    const today = new Date();
    const isEventDay =
      eventDate.toDateString() === today.toDateString() || eventDate < today;

    return NextResponse.json({
      registration,
      isEventDay,
      message: isEventDay
        ? "Ticket verified successfully"
        : "Event has not started yet",
    });
  } catch (error) {
    console.error("Error verifying ticket:", error);
    return NextResponse.json(
      { message: "Failed to verify ticket" },
      { status: 500 }
    );
  }
}

// POST - Mark attendance
export async function POST(
  req: Request,
  { params }: { params: { ticketId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can mark attendance
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const registration = await prisma.registration.findUnique({
      where: { ticketId: params.ticketId },
      include: {
        user: {
          select: { name: true, jisid: true },
        },
        event: {
          select: { title: true, date: true },
        },
      },
    });

    if (!registration) {
      return NextResponse.json(
        { message: "Invalid ticket ID" },
        { status: 404 }
      );
    }

    // Check if attendance already marked
    const existingAttendance = await prisma.attendance.findUnique({
      where: { registrationId: registration.id },
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          message: "Attendance already marked",
          attendance: existingAttendance,
        },
        { status: 200 }
      );
    }

    // Mark attendance
    const attendance = await prisma.attendance.create({
      data: {
        registrationId: registration.id,
        markedAt: new Date(),
        markedBy: session.user.id,
      },
    });

    return NextResponse.json({
      message: "Attendance marked successfully",
      attendance,
      student: {
        name: registration.user.name,
        jisid: registration.user.jisid,
      },
      event: {
        title: registration.event.title,
      },
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { message: "Failed to mark attendance" },
      { status: 500 }
    );
  }
}
