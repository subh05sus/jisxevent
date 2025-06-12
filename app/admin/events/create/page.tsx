import { requireAdmin } from "@/lib/auth";
import { CreateEventForm } from "@/components/create-event-form";

export const metadata = {
  title: "Create Event | Admin Dashboard",
  description: "Create a new event for JIS College",
};

export default async function CreateEventPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Create New Event</h1>
          <p className="text-gray-600 mt-1">
            Fill in the details to create a new event for students
          </p>
        </div>

        <CreateEventForm />
      </div>
    </div>
  );
}
