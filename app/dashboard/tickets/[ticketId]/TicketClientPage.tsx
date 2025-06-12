"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  TicketIcon,
  ClockIcon,
} from "lucide-react";
import Link from "next/link";
import { formatDate, formatDateTime, isEventUpcoming } from "@/lib/utils";
import { QRCodeComponent } from "@/components/qr-code";

interface TicketPageProps {
  registration: any;
  user: any;
}

export default function TicketClientPage({
  registration,
  user,
}: TicketPageProps) {
  const isUpcoming = isEventUpcoming(registration.event.date);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard/tickets">
            <Button variant="link" className="pl-0 text-blue-600">
              ← Back to My Tickets
            </Button>
          </Link>
        </div>

        <Card className="overflow-hidden">
          <CardHeader className="bg-blue-50 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <TicketIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Event Ticket</CardTitle>
                  <p className="text-sm text-gray-600">
                    JIS College of Engineering
                  </p>
                </div>
              </div>
              <Badge
                variant={isUpcoming ? "default" : "secondary"}
                className="text-sm"
              >
                {isUpcoming ? "Active" : "Past Event"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Event Details */}
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {registration.event.title}
                </h2>
                <p className="text-gray-600 mb-6">
                  {registration.event.description}
                </p>
              </div>

              <Separator />

              {/* Event Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Date & Time
                      </p>
                      <p className="text-gray-900">
                        {formatDateTime(registration.event.date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPinIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Venue</p>
                      <p className="text-gray-900">
                        {registration.event.venue}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <UserIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Attendee
                      </p>
                      <p className="text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.jisid}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <ClockIcon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Registered On
                      </p>
                      <p className="text-gray-900">
                        {formatDate(registration.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ticket ID Section */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Ticket ID
                    </p>
                    <p className="text-lg font-mono font-bold text-gray-900">
                      {registration.ticketId}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <Badge variant={isUpcoming ? "default" : "secondary"}>
                      {isUpcoming ? "Valid" : "Expired"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-center py-6">
                <div className="flex flex-col items-center space-y-2">
                  <QRCodeComponent
                    value={`${window.location.origin}/api/attendance/verify/${registration.ticketId}`}
                    size={160}
                    className="border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 text-center">
                    Scan this QR code for attendance verification
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Link
                  href={`/events/${registration.event.id}`}
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    View Event Details
                  </Button>
                </Link>
                <Button
                  onClick={() => window.print()}
                  variant="outline"
                  className="flex-1"
                >
                  Print Ticket
                </Button>
              </div>

              {/* Important Notes */}
              <div className="bg-blue-50 rounded-lg p-4 mt-6">
                <h3 className="font-medium text-blue-900 mb-2">
                  Important Notes:
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Please bring a valid ID along with this ticket</li>
                  <li>• Arrive at least 15 minutes before the event starts</li>
                  <li>• This ticket is non-transferable</li>
                  <li>• Contact support if you have any issues</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
