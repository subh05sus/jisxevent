import { prisma } from "@/lib/prisma";
import type { Registration, Event } from "@prisma/client";

export type RegistrationWithEvent = Registration & {
  event: Event;
};

export async function getUserRegistrations(
  userId: string
): Promise<RegistrationWithEvent[]> {
  try {
    const registrations = await prisma.registration.findMany({
      where: { userId },
      include: { event: true },
      orderBy: { createdAt: "desc" },
    });

    return registrations;
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return [];
  }
}

export async function getRegistrationByTicketId(
  ticketId: string
): Promise<RegistrationWithEvent | null> {
  try {
    const registration = await prisma.registration.findUnique({
      where: { ticketId },
      include: { event: true },
    });

    return registration;
  } catch (error) {
    console.error("Error fetching registration by ticket ID:", error);
    return null;
  }
}

export async function getEventRegistrations(eventId: string) {
  try {
    const registrations = await prisma.registration.findMany({
      where: { eventId },
      include: { user: { select: { name: true, email: true, jisid: true } } },
      orderBy: { createdAt: "desc" },
    });

    return registrations;
  } catch (error) {
    console.error("Error fetching event registrations:", error);
    return [];
  }
}

export async function isUserRegistered(
  userId: string,
  eventId: string
): Promise<boolean> {
  try {
    const registration = await prisma.registration.findFirst({
      where: { userId, eventId },
    });

    return !!registration;
  } catch (error) {
    console.error("Error checking user registration:", error);
    return false;
  }
}
