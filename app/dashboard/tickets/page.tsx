import { requireAuth } from "@/lib/auth";
import { getUserRegistrations } from "@/lib/data/registrations";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, MapPinIcon, TicketIcon } from "lucide-react";
import Link from "next/link";
import { formatDate, isEventUpcoming } from "@/lib/utils";

export const metadata = {
  title: "My Tickets | JIS College Event Management",
  description: "View all your event tickets and registrations",
};

export default async function TicketsPage() {
  const user = await requireAuth() as any;
  const registrations = await getUserRegistrations(user.id);

  const upcomingRegistrations = registrations.filter((reg) =>
    isEventUpcoming(reg.event.date)
  );
  const pastRegistrations = registrations.filter(
    (reg) => !isEventUpcoming(reg.event.date)
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Tickets</h1>
        <p className="text-gray-600 mt-1">View and manage your event tickets</p>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upcoming">
            Upcoming Events ({upcomingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past Events ({pastRegistrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="mt-6">
          {upcomingRegistrations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <TicketIcon className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No upcoming events
                </h3>
                <p className="text-gray-500 mb-6 text-center">
                  You haven't registered for any upcoming events yet. Browse our
                  events to find something interesting!
                </p>
                <Link href="/events">
                  <Button>Browse Events</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingRegistrations.map((registration) => (
                <Card
                  key={registration.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Active Ticket
                      </Badge>
                      <span className="text-xs text-gray-500">
                        #{registration.ticketId.slice(-8)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {registration.event.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{formatDate(registration.event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{registration.event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Link
                        href={`/dashboard/tickets/${registration.ticketId}`}
                      >
                        <Button className="w-full" size="sm">
                          View Full Ticket
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="mt-6">
          {pastRegistrations.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarIcon className="h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No past events
                </h3>
                <p className="text-gray-500 text-center">
                  You haven't attended any events yet.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastRegistrations.map((registration) => (
                <Card
                  key={registration.id}
                  className="overflow-hidden opacity-75"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary">Past Event</Badge>
                      <span className="text-xs text-gray-500">
                        #{registration.ticketId.slice(-8)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">
                        {registration.event.title}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm text-gray-600">
                          <CalendarIcon className="h-4 w-4 mr-2" />
                          <span>{formatDate(registration.event.date)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 mr-2" />
                          <span>{registration.event.venue}</span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 border-t">
                      <Link
                        href={`/dashboard/tickets/${registration.ticketId}`}
                      >
                        <Button variant="outline" className="w-full" size="sm">
                          View Ticket
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
