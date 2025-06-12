"use client"

import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"

interface ExportRegistrationsButtonProps {
  registrations: any[]
  eventTitle?: string
}

export function ExportRegistrationsButton({ registrations, eventTitle }: ExportRegistrationsButtonProps) {
  const exportToCSV = () => {
    if (registrations.length === 0) {
      return
    }

    // CSV headers
    const headers = [
      "Student Name",
      "JIS ID",
      "Email",
      "Event",
      "Venue",
      "Registration Date",
      "Event Date",
      "Ticket ID",
    ]

    // CSV data
    const csvData = registrations.map((reg) => [
      reg.user.name,
      reg.user.jisid,
      reg.user.email,
      reg.event.title,
      reg.event.venue,
      new Date(reg.createdAt).toLocaleDateString(),
      new Date(reg.event.date).toLocaleDateString(),
      reg.ticketId,
    ])

    // Combine headers and data
    const csvContent = [headers, ...csvData].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `registrations-${eventTitle || "all-events"}-${new Date().toISOString().split("T")[0]}.csv`,
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={exportToCSV} variant="outline" disabled={registrations.length === 0}>
      <DownloadIcon className="h-4 w-4 mr-2" />
      Export CSV ({registrations.length})
    </Button>
  )
}
