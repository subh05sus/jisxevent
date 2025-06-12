"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  const pathname = usePathname();
  const { data: session, status } = useSession() as any;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-700">JIS Events</span>
          </Link>
          <nav className="hidden md:flex ml-8 space-x-6">
            <Link
              href="/"
              className={`text-sm font-medium ${
                isActive("/")
                  ? "text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
            >
              Home
            </Link>
            <Link
              href="/events"
              className={`text-sm font-medium ${
                isActive("/events")
                  ? "text-blue-700"
                  : "text-gray-600 hover:text-blue-700"
              }`}
            >
              Events
            </Link>
            {session?.user?.role === "ADMIN" && (
              <>
                <Link
                  href="/admin"
                  className={`text-sm font-medium ${
                    pathname.startsWith("/admin")
                      ? "text-blue-700"
                      : "text-gray-600 hover:text-blue-700"
                  }`}
                >
                  Admin
                </Link>
                <Link
                  href="/api/attendance/scan"
                  className={`text-sm font-medium ${
                    pathname.startsWith("/api/attendance/scan")
                      ? "text-blue-700"
                      : "text-gray-600 hover:text-blue-700"
                  }`}
                >
                  Scan Attendance
                </Link>
              </>
            )}
            {session && (
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${
                  pathname.startsWith("/dashboard")
                    ? "text-blue-700"
                    : "text-gray-600 hover:text-blue-700"
                }`}
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-800">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {session.user?.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {session.user?.jisid}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/tickets">My Tickets</Link>
                </DropdownMenuItem>
                {session.user?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Panel</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log In
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
