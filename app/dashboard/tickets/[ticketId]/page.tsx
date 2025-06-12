import { requireAuth } from "@/lib/auth";
import { getRegistrationByTicketId } from "@/lib/data/registrations";
import { notFound } from "next/navigation";
import TicketClientPage from "./TicketClientPage";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  // Await params since it's now a Promise
  const { ticketId } = await params;
  const registration = await getRegistrationByTicketId(ticketId);

  if (!registration) {
    return {
      title: "Ticket Not Found",
    };
  }

  return {
    title: `Ticket - ${registration.event.title} | JIS College Event Management`,
    description: `Your ticket for ${registration.event.title}`,
  };
}

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketId: string }>;
}) {
  const user = (await requireAuth()) as any;

  // Await params since it's now a Promise
  const { ticketId } = await params;
  const registration = await getRegistrationByTicketId(ticketId);

  if (!registration || registration.userId !== user.id) {
    notFound();
  }

  return <TicketClientPage registration={registration} user={user} />;
}
