import { requireAdmin } from "@/lib/auth";
import { AttendanceScanner } from "@/components/admin/attendance-scanner";

export const metadata = {
  title: "Scan Attendance | Admin Dashboard",
  description: "Scan QR codes to mark student attendance",
};

export default async function AttendanceScanPage() {
  await requireAdmin();

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Scan Attendance</h1>
          <p className="text-gray-600 mt-1">
            Scan student QR codes to mark attendance for events
          </p>
        </div>

        <AttendanceScanner />
      </div>
    </div>
  );
}
