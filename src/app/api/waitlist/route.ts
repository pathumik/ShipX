// src/app/api/waitlist/route.ts
// API route for waitlist signup

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addWaitlistEntry } from "@/lib/db";
import type { WaitlistEntry, UncertaintyType } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const { name, email, idea_summary, primary_uncertainty } = body as {
      name: string;
      email: string;
      idea_summary: string;
      primary_uncertainty?: UncertaintyType;
    };

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Create waitlist entry
    const entry: WaitlistEntry = {
      id: uuidv4(),
      name,
      email,
      idea_summary: idea_summary || "",
      primary_uncertainty,
      created_at: new Date().toISOString(),
    };

    // Save to database
    const savedEntry = await addWaitlistEntry(entry);

    return NextResponse.json({
      success: true,
      message: "Successfully joined the waitlist!",
      entry: savedEntry,
    });
  } catch (error) {
    console.error("Waitlist signup error:", error);
    return NextResponse.json(
      { error: "Failed to save waitlist entry" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "ShipX Waitlist API",
    endpoints: {
      POST: "Submit name, email, idea_summary, primary_uncertainty",
    },
  });
}
