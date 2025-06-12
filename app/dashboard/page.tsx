import { requireAuth } from "@/lib/auth";
import { getUserRegistrations } from "@/lib/data/registrations";
import { getEventsByOrganizer } from "@/lib/data/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, TicketIcon, PlusIcon, UsersIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";

export const metadata = {
  title: "Dashboard | JIS College Event Management",
  description: "Your personal dashboard for events and registrations",
};

export default async function DashboardPage() {
  const user = await requireAuth();
  const registrations = await getUserRegistrations(user.id);
  const organizedEvents =
    user.role === "ADMIN" ? await getEventsByOrganizer(user.id) : [];

  const upcomingRegistrations = registrations.filter((reg) =>
    isEventUpcoming(reg.event.date)
  );
  const pastRegistrations = registrations.filter(
    (reg) => !isEventUpcoming(reg.event.date)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your events and registrations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingRegistrations.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Events you're registered for
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
            <TicketIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{registrations.length}</div>
            <p className="text-xs text-muted-foreground">
              All time registrations
            </p>
          </CardContent>
        </Card>

        {user.role === "ADMIN" && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Events Organized
                </CardTitle>
                <PlusIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {organizedEvents.length}
                </div>
                <p className="text-xs text-muted-foreground">
                  Events you've created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Admin Panel
                </CardTitle>
                <UsersIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Link href="/admin">
                  <Button size="sm" className="w-full">
                    Manage Events
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Events you're registered for</CardDescription>
            </div>
            <Link href="/dashboard/tickets">
              <Button variant="outline" size="sm">
                View All Tickets
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingRegistrations.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No upcoming events
                </h3>
                <p className="text-gray-500 mb-4">
                  You haven't registered for any upcoming events yet.
                </p>
                <Link href="/events">
                  <Button>Browse Events</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingRegistrations.slice(0, 3).map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {registration.event.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(registration.event.date)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {registration.event.venue}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline">Registered</Badge>
                      <Link
                        href={`/dashboard/tickets/${registration.ticketId}`}
                      >
                        <Button variant="outline" size="sm">
                          View Ticket
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
                {upcomingRegistrations.length > 3 && (
                  <div className="text-center pt-4">
                    <Link href="/dashboard/tickets">
                      <Button variant="link">
                        View {upcomingRegistrations.length - 3} more events
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest event registrations</CardDescription>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-8">
                <TicketIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No registrations yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by registering for an event.
                </p>
                <Link href="/events">
                  <Button>Browse Events</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.slice(0, 5).map((registration) => (
                  <div
                    key={registration.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {registration.event.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Registered on{" "}
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        isEventUpcoming(registration.event.date)
                          ? "default"
                          : "secondary"
                      }
                    >
                      {isEventUpcoming(registration.event.date)
                        ? "Upcoming"
                        : "Past"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
