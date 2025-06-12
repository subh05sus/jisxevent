import { requireAuth } from "@/lib/auth";
import { getRegistrationByTicketId } from "@/lib/data/registrations";
import { notFound } from "next/navigation";
import TicketClientPage from "./TicketClientPage";

export async function generateMetadata({
  params,
}: {
  params: { ticketId: string };
}) {
  const registration = await getRegistrationByTicketId(params.ticketId);

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
  params: { ticketId: string };
}) {
  const user = await requireAuth();
  const registration = await getRegistrationByTicketId(params.ticketId);

  if (!registration || registration.userId !== user.id) {
    notFound();
  }

  return <TicketClientPage registration={registration} user={user} />;
}
