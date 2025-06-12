"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Link from "next/link";

interface RegisterButtonProps {
  eventId: string;
  isLoggedIn: boolean;
  isRegistered: boolean;
}

export function RegisterButton({
  eventId,
  isLoggedIn,
  isRegistered,
}: RegisterButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async () => {
    if (!isLoggedIn) {
      router.push(`/auth/login?callbackUrl=/events/${eventId}`);
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register for event");
      }

      toast({
        title: "Registration successful!",
        description: "You have successfully registered for this event.",
      });

      router.push(`/dashboard/tickets/${data.registration.ticketId}`);
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isRegistered) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded-lg px-4 py-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-green-600"
          >
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span className="text-green-800 font-medium">
            You're already registered for this event
          </span>
        </div>
        <Link href="/dashboard/tickets">
          <Button variant="outline" size="sm">
            View My Tickets
          </Button>
        </Link>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center space-y-2">
        <p className="text-gray-600 mb-2">
          Please log in to register for this event
        </p>
        <Link href={`/auth/login?callbackUrl=/events/${eventId}`}>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Log in to Register
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      <Button
        size="lg"
        className="bg-blue-600 hover:bg-blue-700"
        onClick={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? "Registering..." : "Register for Event"}
      </Button>
      <p className="text-sm text-gray-500">
        You&apos;ll receive a confirmation after registration
      </p>
    </div>
  );
}
