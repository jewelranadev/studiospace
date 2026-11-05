import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";


export async function POST(request) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 },
      );
    }

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 },
      );
    }

  
    const { studioId, date, startTime, endTime } = body;

    const response = await fetch(`${process.env.SERVER_API_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_SECRET,
        "x-user-email": session.user.email,
        "x-user-id": session.user.id,
        "x-user-name": encodeURIComponent(session.user.name || ""),
      },
      body: JSON.stringify({ studioId, date, startTime, endTime }),
      cache: "no-store",
      signal: AbortSignal.timeout(25000),
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Express bookings non-JSON:", response.status, text);
      return NextResponse.json(
        { success: false, message: "Invalid response from API server" },
        { status: 502 },
      );
    }

    if (!response.ok) {
      console.error("Express bookings error:", response.status, result);
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create booking" },
      { status: 500 },
    );
  }
}