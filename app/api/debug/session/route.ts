import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  try {
    const session = await getServerSession(authOptions) as any;
    
    return NextResponse.json({
      hasSession: !!session,
      user: session?.user ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        jisid: (session.user as any).jisid,
        role: (session.user as any).role,
      } : null,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Session debug error:", error);
    
    return NextResponse.json(
      {
        error: "Failed to get session",
        details: process.env.NODE_ENV === "development" ? error : "Internal error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
