import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { Event } from "@prisma/client";

interface EventListProps {
  events: Event[];
}

export function EventList({ events }: EventListProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900">No events found</h3>
        <p className="mt-2 text-gray-500">
          Check back later for upcoming events.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <Card
          key={event.id}
          className="overflow-hidden hover:shadow-md transition-shadow"
        >
          <CardHeader className="p-0">
            <div className="h-48 bg-blue-100 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
                <path d="M18 14h-8" />
                <path d="M15 18h-5" />
                <path d="M10 6h8v4h-8V6Z" />
              </svg>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-2 line-clamp-1">
              {event.title}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500 mb-3">
              <MapPinIcon className="h-4 w-4 mr-1" />
              <span>{event.venue}</span>
            </div>
            <p className="text-gray-600 line-clamp-2 text-sm">
              {event.description}
            </p>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-between items-center">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              Event
            </Badge>
            <Link href={`/events/${event.id}`}>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
