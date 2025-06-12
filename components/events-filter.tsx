"use client";

import type React from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

export function EventsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  const [venue, setVenue] = useState(searchParams.get("venue") || "all");

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "all") {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, value);
        }
      });

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const applyFilters = () => {
    const queryString = createQueryString({
      search: search || null,
      status: status === "all" ? null : status,
      venue: venue === "all" ? null : venue,
    });

    router.push(`/admin/events?${queryString}`);
  };

  const resetFilters = () => {
    setSearch("");
    setStatus("all");
    setVenue("all");
    router.push("/admin/events");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search events..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="past">Past Events</SelectItem>
        </SelectContent>
      </Select>

      <Select value={venue} onValueChange={setVenue}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by venue" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Venues</SelectItem>
          <SelectItem value="Auditorium">Auditorium</SelectItem>
          <SelectItem value="Seminar Hall">Seminar Hall</SelectItem>
          <SelectItem value="Sports Ground">Sports Ground</SelectItem>
          <SelectItem value="Computer Lab">Computer Lab</SelectItem>
          <SelectItem value="Library">Library</SelectItem>
          <SelectItem value="Conference Room">Conference Room</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex gap-2">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Apply
        </Button>
        <Button type="button" variant="outline" onClick={resetFilters}>
          Reset
        </Button>
      </div>
    </form>
  );
}
