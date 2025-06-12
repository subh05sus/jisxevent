import { requireAdmin } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusIcon, EditIcon, UsersIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { EventsFilter } from "@/components/admin/events-filter";
import { DeleteEventButton } from "@/components/admin/delete-event-button";

export const metadata = {
  title: "Manage Events | Admin Dashboard",
  description: "View and manage all events in the system",
};

interface EventsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminEventsPage({
  searchParams,
}: EventsPageProps) {
  await requireAdmin();

  // Build filter conditions
  const where: any = {};
  const search = searchParams.search as string;
  const status = searchParams.status as string;
  const venue = searchParams.venue as string;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status === "upcoming") {
    where.date = { gte: new Date() };
  } else if (status === "past") {
    where.date = { lt: new Date() };
  }

  if (venue && venue !== "all") {
    where.venue = venue;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      organizer: {
        select: { name: true, jisid: true },
      },
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { date: "desc" },
  });

  const totalEvents = await prisma.event.count();
  const upcomingEvents = await prisma.event.count({
    where: { date: { gte: new Date() } },
  });
  const totalRegistrations = await prisma.registration.count();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manage Events</h1>
          <p className="text-gray-600 mt-1">
            View and manage all events in the system
          </p>
        </div>
        <Link href="/admin/events/create">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              All events in system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events scheduled ahead
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              All time registrations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter Events</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsFilter />
        </CardContent>
      </Card>

      {/* Events Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Events ({events.length})</CardTitle>
          <CardDescription>Manage all events in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No events found
              </h3>
              <p className="text-gray-500 mb-6">
                {search || status || venue
                  ? "Try adjusting your filters"
                  : "Create your first event to get started"}
              </p>
              <Link href="/admin/events/create">
                <Button>Create Event</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Venue</TableHead>
                    <TableHead>Organizer</TableHead>
                    <TableHead>Registrations</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {event.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{formatDate(event.date)}</div>
                          <div className="text-gray-500">
                            {new Date(event.date).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{event.venue}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{event.organizer.name}</div>
                          <div className="text-gray-500">
                            {event.organizer.jisid}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/registrations?eventId=${event.id}`}>
                          <Button
                            variant="link"
                            className="p-0 h-auto font-medium text-blue-600"
                          >
                            {event._count.registrations} registered
                          </Button>
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            isEventUpcoming(event.date)
                              ? "default"
                              : "secondary"
                          }
                        >
                          {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/events/${event.id}`}>
                            <Button variant="outline" size="sm">
                              <EditIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link
                            href={`/admin/registrations?eventId=${event.id}`}
                          >
                            <Button variant="outline" size="sm">
                              <UsersIcon className="h-4 w-4" />
                            </Button>
                          </Link>
                          <DeleteEventButton
                            eventId={event.id}
                            eventTitle={event.title}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
