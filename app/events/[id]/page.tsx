import { getEventById } from "@/lib/data/events";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CalendarIcon, MapPinIcon, ClockIcon, UserIcon } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { RegisterButton } from "@/components/register-button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // Declare the prisma variable
import { isUserRegistered } from "@/lib/data/registrations";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const event = await getEventById(params.id);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  return {
    title: `${event.title} | JIS College Event Management`,
    description: event.description,
  };
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await getEventById(params.id);
  const session = await getServerSession(authOptions);

  if (!event) {
    notFound();
  }

  const organizer = await prisma.user.findUnique({
    where: { id: event.createdBy },
    select: { name: true },
  });

  // Check if user is already registered
  let isRegistered = false;
  if (session) {
    isRegistered = await isUserRegistered(session.user.id, event.id);
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/events">
            <Button variant="link" className="pl-0 text-blue-600">
              ← Back to Events
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-64 bg-blue-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="96"
              height="96"
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

          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {event.title}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <CalendarIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Date
                        </p>
                        <p className="text-gray-900">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Time
                        </p>
                        <p className="text-gray-900">
                          {new Date(event.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <MapPinIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Venue
                        </p>
                        <p className="text-gray-900">{event.venue}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-blue-600 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">
                          Organizer
                        </p>
                        <p className="text-gray-900">
                          {organizer?.name || "JIS College"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">
                About this event
              </h2>
              <p className="text-gray-600 whitespace-pre-line">
                {event.description}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-center">
              <RegisterButton
                eventId={event.id}
                isLoggedIn={!!session}
                isRegistered={isRegistered}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
