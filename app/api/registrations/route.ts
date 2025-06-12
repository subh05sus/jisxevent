import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";
import { nanoid } from "nanoid";

// GET all registrations for the current user
export async function GET(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      where: { userId: session.user.id },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(registrations);
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return NextResponse.json(
      { message: "Failed to fetch registrations" },
      { status: 500 }
    );
  }
}

// POST create a new registration
export async function POST(req: Request) {
  try {
    const session = (await getServerSession(authOptions)) as any;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const registrationSchema = z.object({
      eventId: z.string().min(1, "Event ID is required"),
    });

    const validatedData = registrationSchema.parse(body);

    // Check if event exists
    const event = await prisma.event.findUnique({
      where: { id: validatedData.eventId },
    });

    if (!event) {
      return NextResponse.json({ message: "Event not found" }, { status: 404 });
    }

    // Check if user is already registered for this event
    const existingRegistration = await prisma.registration.findFirst({
      where: { userId: session.user.id, eventId: validatedData.eventId },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { message: "User already registered for this event" },
        { status: 409 }
      );
    }

    // Create a new registration
    const newRegistration = await prisma.registration.create({
      data: {
        id: nanoid(),
        userId: session.user.id,
        eventId: validatedData.eventId,
      },
    });

    return NextResponse.json(newRegistration, { status: 201 });
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { message: "Failed to create registration" },
      { status: 500 }
    );
  }
}
