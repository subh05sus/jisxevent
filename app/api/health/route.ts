import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      // Don't expose the full URL in production, just indicate if it's set
      nextAuthUrl: process.env.NEXTAUTH_URL ? "configured" : "missing",
      nextAuthSecret: process.env.NEXTAUTH_SECRET ? "configured" : "missing",
    });
  } catch (error) {
    console.error("Health check failed:", error);
    
    return NextResponse.json(
      {
        status: "unhealthy",
        database: "disconnected", 
        error: process.env.NODE_ENV === "development" ? error : "Connection failed",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        nextAuthUrl: process.env.NEXTAUTH_URL ? "configured" : "missing",
        nextAuthSecret: process.env.NEXTAUTH_SECRET ? "configured" : "missing",
      },
      { status: 503 }
    );
  }
}
