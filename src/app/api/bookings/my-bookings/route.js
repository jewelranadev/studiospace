import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/bookings/my-bookings`,
      {
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_SECRET,
          "x-user-email": session.user.email,
          "x-user-id": session.user.id,
          "x-user-name": encodeURIComponent(session.user.name || ""),
        },
        cache: "no-store",
        signal: AbortSignal.timeout(25000),
      }
    );

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Express my-bookings non-JSON:", response.status, text);
      return NextResponse.json(
        { success: false, message: "Invalid response from API server" },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error("Express my-bookings error:", response.status, result);
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("My Bookings API Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}