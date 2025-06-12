"use client";

import type React from "react";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircleIcon,
  AlertCircleIcon,
  ScanIcon,
  UserCheckIcon,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface AttendanceResult {
  success: boolean;
  message: string;
  student?: {
    name: string;
    jisid: string;
  };
  event?: {
    title: string;
  };
  alreadyMarked?: boolean;
}

export function AttendanceScanner() {
  const [ticketId, setTicketId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceResult[]>(
    []
  );
  const { toast } = useToast();

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setIsLoading(true);
    setResult(null);

    try {
      // First verify the ticket
      const verifyResponse = await fetch(`/api/attendance/verify/${ticketId}`);
      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        setResult({
          success: false,
          message: verifyData.message || "Invalid ticket",
        });
        setIsLoading(false);
        return;
      }

      if (!verifyData.isEventDay) {
        setResult({
          success: false,
          message:
            "Event has not started yet. Attendance can only be marked on the event day.",
        });
        setIsLoading(false);
        return;
      }

      // Mark attendance
      const attendanceResponse = await fetch(
        `/api/attendance/verify/${ticketId}`,
        {
          method: "POST",
        }
      );
      const attendanceData = await attendanceResponse.json();

      if (attendanceResponse.ok) {
        const newResult: AttendanceResult = {
          success: true,
          message: attendanceData.message,
          student: attendanceData.student,
          event: attendanceData.event,
          alreadyMarked: attendanceData.message.includes("already marked"),
        };

        setResult(newResult);

        // Add to recent attendance if not already marked
        if (!newResult.alreadyMarked) {
          setRecentAttendance((prev) => [newResult, ...prev.slice(0, 4)]);
          toast({
            title: "Attendance marked",
            description: `${attendanceData.student.name} marked present for ${attendanceData.event.title}`,
          });
        }
      } else {
        setResult({
          success: false,
          message: attendanceData.message || "Failed to mark attendance",
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: "An error occurred while processing the ticket",
      });
    } finally {
      setIsLoading(false);
      setTicketId("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Scanner Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ScanIcon className="h-5 w-5 mr-2" />
            QR Code Scanner
          </CardTitle>
          <CardDescription>
            Enter or scan the ticket ID to mark attendance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleScan} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter ticket ID or scan QR code"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button type="submit" disabled={isLoading || !ticketId.trim()}>
                {isLoading ? "Processing..." : "Mark Attendance"}
              </Button>
            </div>
          </form>

          {/* Result Display */}
          {result && (
            <div className="mt-4">
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? (
                  <CheckCircleIcon className="h-4 w-4" />
                ) : (
                  <AlertCircleIcon className="h-4 w-4" />
                )}
                <AlertDescription>
                  <div className="space-y-2">
                    <p>{result.message}</p>
                    {result.student && result.event && (
                      <div className="text-sm">
                        <p>
                          <strong>Student:</strong> {result.student.name} (
                          {result.student.jisid})
                        </p>
                        <p>
                          <strong>Event:</strong> {result.event.title}
                        </p>
                        {result.alreadyMarked && (
                          <Badge variant="secondary" className="mt-2">
                            Already Marked
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Attendance */}
      {recentAttendance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <UserCheckIcon className="h-5 w-5 mr-2" />
              Recent Attendance
            </CardTitle>
            <CardDescription>
              Recently marked attendance in this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAttendance.map((attendance, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-green-50 rounded-lg border"
                >
                  <div>
                    <p className="font-medium text-green-900">
                      {attendance.student?.name} ({attendance.student?.jisid})
                    </p>
                    <p className="text-sm text-green-700">
                      {attendance.event?.title}
                    </p>
                  </div>
                  <Badge className="bg-green-100 text-green-800">Present</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-gray-600 space-y-2">
          <p>• Students should show their QR code from their ticket</p>
          <p>• You can manually enter the ticket ID or scan the QR code</p>
          <p>• Attendance can only be marked on the event day</p>
          <p>• Each ticket can only be marked once</p>
          <p>• The system will show confirmation for each successful scan</p>
        </CardContent>
      </Card>
    </div>
  );
}
