import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function PATCH(request, { params }) {
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

    const { id } = await params;

    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/bookings/${id}/cancel`,
      {
        method: "PATCH",
        headers: {
          "x-internal-api-key": process.env.INTERNAL_API_SECRET,
          "x-user-email": session.user.email,
        },
        cache: "no-store",
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Cancel Booking API Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}