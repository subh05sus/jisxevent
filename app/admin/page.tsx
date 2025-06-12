import { requireAdmin } from "@/lib/auth";
import { getEventsByOrganizer } from "@/lib/data/events";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusIcon, CalendarIcon, UsersIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Dashboard | JIS College Event Management",
  description: "Admin panel for managing events and users",
};

export default async function AdminPage() {
  const user = await requireAdmin();
  const events = await getEventsByOrganizer(user.id);

  // Get total statistics
  const totalEvents = await prisma.event.count();
  const totalUsers = await prisma.user.count({ where: { role: "STUDENT" } });
  const totalRegistrations = await prisma.registration.count();

  const upcomingEvents = events.filter((event) => isEventUpcoming(event.date));
  const pastEvents = events.filter((event) => !isEventUpcoming(event.date));

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage events and monitor system activity
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
              Total Students
            </CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Registered students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <SettingsIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              All time registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Events</CardTitle>
            <PlusIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              Events you've created
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Your Recent Events</CardTitle>
              <CardDescription>
                Events you've created and organized
              </CardDescription>
            </div>
            <Link href="/admin/events">
              <Button variant="outline" size="sm">
                Manage All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {events.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No events created
                </h3>
                <p className="text-gray-500 mb-4">
                  Start by creating your first event.
                </p>
                <Link href="/admin/events/create">
                  <Button>Create Event</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {formatDate(event.date)}
                      </p>
                      <p className="text-sm text-gray-500">{event.venue}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant={
                          isEventUpcoming(event.date) ? "default" : "secondary"
                        }
                      >
                        {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                      </Badge>
                      <Link href={`/admin/events/${event.id}`}>
                        <Button variant="outline" size="sm">
                          Manage
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/admin/events/create">
              <Button className="w-full justify-start" variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Create New Event
              </Button>
            </Link>
            <Link href="/admin/events">
              <Button className="w-full justify-start" variant="outline">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Manage All Events
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button className="w-full justify-start" variant="outline">
                <UsersIcon className="h-4 w-4 mr-2" />
                View All Users
              </Button>
            </Link>
            <Link href="/admin/registrations">
              <Button className="w-full justify-start" variant="outline">
                <SettingsIcon className="h-4 w-4 mr-2" />
                View All Registrations
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
