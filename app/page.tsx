import { Button } from "@/components/ui/button";
import { EventList } from "@/components/event-list";
import { getEvents } from "@/lib/data/events";
import Link from "next/link";

export default async function Home() {
  const events = await getEvents();

  return (
    <div className="container mx-auto py-8 px-4">
      <section className="py-12 md:py-24 lg:py-32 bg-white rounded-lg shadow-sm mb-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-blue-700">
                JIS College Event Management
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                Discover, register, and participate in exciting events at JIS
                College of Engineering.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/events">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  Browse Events
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
          <Link href="/events">
            <Button variant="link" className="text-blue-600">
              View All
            </Button>
          </Link>
        </div>
        <EventList events={events.slice(0, 3)} />
      </section>

      <section className="bg-white rounded-lg shadow-sm p-8 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          About JIS College Events
        </h2>
        <p className="text-gray-600 mb-4">
          JIS College of Engineering hosts a variety of academic, cultural, and
          technical events throughout the year. Our event management system
          makes it easy for students to discover events, register, and manage
          their participation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
                <line x1="16" x2="16" y1="2" y2="6"></line>
                <line x1="8" x2="8" y1="2" y2="6"></line>
                <line x1="3" x2="21" y1="10" y2="10"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Discover Events
            </h3>
            <p className="text-gray-500 mt-2">
              Browse and search for upcoming events at JIS College.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <polyline points="9 11 12 14 22 4"></polyline>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Register Easily
            </h3>
            <p className="text-gray-500 mt-2">
              Simple registration process for all college events.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-4">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-600"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <line x1="10" x2="8" y1="9" y2="9"></line>
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Manage Tickets
            </h3>
            <p className="text-gray-500 mt-2">
              Access your event tickets anytime from your dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
