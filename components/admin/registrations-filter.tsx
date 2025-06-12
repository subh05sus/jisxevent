"use client"

import type React from "react"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { SearchIcon } from "lucide-react"

interface RegistrationsFilterProps {
  events: Array<{ id: string; title: string; date: Date }>
}

export function RegistrationsFilter({ events }: RegistrationsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [eventId, setEventId] = useState(searchParams.get("eventId") || "all")
  const [status, setStatus] = useState(searchParams.get("status") || "all")

  const createQueryString = useCallback(
    (params: Record<string, string | null>) => {
      const newSearchParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value === null || value === "all") {
          newSearchParams.delete(key)
        } else {
          newSearchParams.set(key, value)
        }
      })

      return newSearchParams.toString()
    },
    [searchParams],
  )

  const applyFilters = () => {
    const queryString = createQueryString({
      search: search || null,
      eventId: eventId === "all" ? null : eventId,
      status: status === "all" ? null : status,
    })

    router.push(`/admin/registrations?${queryString}`)
  }

  const resetFilters = () => {
    setSearch("")
    setEventId("all")
    setStatus("all")
    router.push("/admin/registrations")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by name, email, JIS ID, or ticket ID..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Select value={eventId} onValueChange={setEventId}>
        <SelectTrigger className="w-full md:w-[250px]">
          <SelectValue placeholder="Filter by event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Events</SelectItem>
          {events.map((event) => (
            <SelectItem key={event.id} value={event.id}>
              {event.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="past">Past Events</SelectItem>
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
  )
}
