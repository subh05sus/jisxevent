import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hash } from "bcrypt";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  jisid: z
    .string()
    .min(5)
    .regex(/^JIS\/\d{4}\/\d{4}$/),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    const existingUserByJisId = await prisma.user.findUnique({
      where: { jisid: validatedData.jisid },
    });

    if (existingUserByJisId) {
      return NextResponse.json(
        { message: "User with this JIS ID already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hash(validatedData.password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        jisid: validatedData.jisid,
        password: hashedPassword,
        role: "STUDENT", // Default role for new registrations
      },
    });

    // Return the user without the password
    const { password, ...userWithoutPassword } = user;

    return NextResponse.json(
      { message: "User registered successfully", user: userWithoutPassword },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("Registration error:", error);
    
    // Handle database connection errors
    if (error instanceof Error && error.message.includes("database")) {
      return NextResponse.json(
        { message: "Database connection error. Please try again later." },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
