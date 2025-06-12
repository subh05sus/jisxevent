import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";

export async function GET() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { jisid: "JIS/ADMIN/0001" },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: "Admin account already exists" },
        { status: 200 }
      );
    }

    // Hash password
    const hashedPassword = await hash("123456", 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@jisce.ac.in",
        jisid: "JIS/ADMIN/0001",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    // Return success message
    return NextResponse.json(
      { message: "Admin account created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin creation error:", error);
    return NextResponse.json(
      { message: "Failed to create admin account" },
      { status: 500 }
    );
  }
}
