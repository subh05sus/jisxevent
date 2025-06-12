import { requireAdmin } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UsersIcon, TicketIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { RegistrationsFilter } from "@/components/admin/registrations-filter";
import { ExportRegistrationsButton } from "@/components/admin/export-registrations-button";

export const metadata = {
  title: "Manage Registrations | Admin Dashboard",
  description: "View and manage all event registrations",
};

interface RegistrationsPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function AdminRegistrationsPage({
  searchParams,
}: RegistrationsPageProps) {
  await requireAdmin();

  const eventId = searchParams.eventId as string;
  const search = searchParams.search as string;
  const status = searchParams.status as string;

  // Build filter conditions
  const where: any = {};

  if (eventId) {
    where.eventId = eventId;
  }

  if (search) {
    where.OR = [
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { user: { jisid: { contains: search, mode: "insensitive" } } },
      { ticketId: { contains: search, mode: "insensitive" } },
    ];
  }

  if (status === "upcoming") {
    where.event = { date: { gte: new Date() } };
  } else if (status === "past") {
    where.event = { date: { lt: new Date() } };
  }

  const registrations = await prisma.registration.findMany({
    where,
    include: {
      user: {
        select: { name: true, email: true, jisid: true },
      },
      event: {
        select: { title: true, date: true, venue: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Get events for filter dropdown
  const events = await prisma.event.findMany({
    select: { id: true, title: true, date: true },
    orderBy: { date: "desc" },
  });

  // Get selected event details if filtering by event
  const selectedEvent = eventId
    ? await prisma.event.findUnique({
        where: { id: eventId },
        select: { title: true, date: true, venue: true },
      })
    : null;

  // Get statistics
  const totalRegistrations = await prisma.registration.count();
  const upcomingRegistrations = await prisma.registration.count({
    where: { event: { date: { gte: new Date() } } },
  });
  const todayRegistrations = await prisma.registration.count({
    where: {
      createdAt: {
        gte: new Date(new Date().setHours(0, 0, 0, 0)),
        lt: new Date(new Date().setHours(23, 59, 59, 999)),
      },
    },
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Registrations
        </h1>
        <p className="text-gray-600 mt-1">
          {selectedEvent
            ? `Registrations for "${selectedEvent.title}"`
            : "View and manage all event registrations"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {eventId ? registrations.length : totalRegistrations}
            </div>
            <p className="text-xs text-muted-foreground">
              {eventId ? "For this event" : "All time registrations"}
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
            <div className="text-2xl font-bold">{upcomingRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              Active registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Registrations
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayRegistrations}</div>
            <p className="text-xs text-muted-foreground">Registered today</p>
          </CardContent>
        </Card>
      </div>

      {/* Selected Event Info */}
      {selectedEvent && (
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-blue-900">
                  {selectedEvent.title}
                </CardTitle>
                <CardDescription className="text-blue-700">
                  {formatDateTime(selectedEvent.date)} • {selectedEvent.venue}
                </CardDescription>
              </div>
              <Link href="/admin/registrations">
                <Button variant="outline" size="sm">
                  View All Registrations
                </Button>
              </Link>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filter Registrations</CardTitle>
            <ExportRegistrationsButton
              registrations={registrations}
              eventTitle={selectedEvent?.title}
            />
          </div>
        </CardHeader>
        <CardContent>
          <RegistrationsFilter events={events} />
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {selectedEvent
              ? `Registrations for ${selectedEvent.title}`
              : "All Registrations"}{" "}
            ({registrations.length})
          </CardTitle>
          <CardDescription>
            {selectedEvent
              ? "Students registered for this event"
              : "All event registrations in the system"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {registrations.length === 0 ? (
            <div className="text-center py-12">
              <TicketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                No registrations found
              </h3>
              <p className="text-gray-500 mb-6">
                {search || status || eventId
                  ? "Try adjusting your filters to see more results"
                  : "No students have registered for events yet"}
              </p>
              {!eventId && (
                <Link href="/admin/events">
                  <Button>Manage Events</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Event Date</TableHead>
                    <TableHead>Ticket ID</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {registration.user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.user.jisid}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {registration.event.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {registration.event.venue}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(registration.createdAt)}
                          <div className="text-gray-500">
                            {new Date(
                              registration.createdAt
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(registration.event.date)}
                          <div className="text-gray-500">
                            {new Date(
                              registration.event.date
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {registration.ticketId}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            new Date(registration.event.date) > new Date()
                              ? "default"
                              : "secondary"
                          }
                        >
                          {new Date(registration.event.date) > new Date()
                            ? "Active"
                            : "Completed"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link
                            href={`/dashboard/tickets/${registration.ticketId}`}
                          >
                            <Button variant="outline" size="sm">
                              View Ticket
                            </Button>
                          </Link>
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
