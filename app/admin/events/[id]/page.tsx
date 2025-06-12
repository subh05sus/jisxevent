import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EditEventForm } from "@/components/admin/edit-event-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, UsersIcon, ClockIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime, isEventUpcoming } from "@/lib/utils";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await prisma.event.findUnique({
    where: { id: params.id },
  });

  if (!event) {
    return { title: "Event Not Found" };
  }

  return {
    title: `Edit ${event.title} | Admin Dashboard`,
    description: `Edit event details for ${event.title}`,
  };
}

export default async function EditEventPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const event = await prisma.event.findUnique({
    where: { id: params.id },
    include: {
      organizer: {
        select: { name: true, jisid: true },
      },
      _count: {
        select: { registrations: true },
      },
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/admin/events">
            <Button variant="link" className="pl-0 text-blue-600">
              ← Back to Events
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Event Details */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Event Details</CardTitle>
                <Badge
                  variant={
                    isEventUpcoming(event.date) ? "default" : "secondary"
                  }
                >
                  {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                </Badge>
              </div>
              <CardDescription>Current event information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date & Time
                    </p>
                    <p className="text-gray-900">
                      {formatDateTime(event.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Venue</p>
                    <p className="text-gray-900">{event.venue}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UsersIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Registrations
                    </p>
                    <p className="text-gray-900">
                      {event._count.registrations} students registered
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ClockIcon className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Created</p>
                    <p className="text-gray-900">
                      {formatDate(event.createdAt)}
                    </p>
                    <p className="text-sm text-gray-500">
                      by {event.organizer.name}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Link href={`/admin/registrations?eventId=${event.id}`}>
                  <Button className="w-full">
                    <UsersIcon className="h-4 w-4 mr-2" />
                    View Registrations ({event._count.registrations})
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Edit Form */}
          <Card>
            <CardHeader>
              <CardTitle>Edit Event</CardTitle>
              <CardDescription>Update event information</CardDescription>
            </CardHeader>
            <CardContent>
              <EditEventForm event={event} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
