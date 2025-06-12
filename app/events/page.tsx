import { getEvents } from "@/lib/data/events";
import { EventList } from "@/components/event-list";
import { Suspense } from "react";
import { EventsFilter } from "@/components/events-filter";

export const metadata = {
  title: "Events | JIS College Event Management",
  description: "Browse all events at JIS College of Engineering",
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const events = await getEvents(searchParams);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Events</h1>
          <p className="text-gray-600 mt-1">
            Browse all upcoming events at JIS College
          </p>
        </div>
        <Suspense fallback={<div>Loading filters...</div>}>
          <EventsFilter />
        </Suspense>
      </div>

      <EventList events={events} />
    </div>
  );
}
