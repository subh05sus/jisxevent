import { prisma } from "@/lib/prisma";
import type { Event } from "@prisma/client";

export async function getEvents(searchParams?: {
  [key: string]: string | string[] | undefined;
}): Promise<Event[]> {
  try {
    const search = searchParams?.search as string;
    const venue = searchParams?.venue as string;
    const dateParam = searchParams?.date as string;

    // Build filter conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (venue && venue !== "All venues") {
      where.venue = venue;
    }

    if (dateParam) {
      const date = new Date(dateParam);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      where.date = {
        gte: date,
        lt: nextDay,
      };
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: { date: "asc" },
    });

    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getEventById(id: string): Promise<Event | null> {
  try {
    const event = await prisma.event.findUnique({
      where: { id },
    });

    return event;
  } catch (error) {
    console.error("Error fetching event:", error);
    return null;
  }
}

export async function getUpcomingEvents(limit?: number): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: { date: "asc" },
      ...(limit && { take: limit }),
    });

    return events;
  } catch (error) {
    console.error("Error fetching upcoming events:", error);
    return [];
  }
}

export async function getEventsByOrganizer(
  organizerId: string
): Promise<Event[]> {
  try {
    const events = await prisma.event.findMany({
      where: { createdBy: organizerId },
      orderBy: { date: "desc" },
    });

    return events;
  } catch (error) {
    console.error("Error fetching events by organizer:", error);
    return [];
  }
}
