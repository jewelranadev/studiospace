import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    // Check user session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    // Get form data
    const body = await request.json();

    // Send data to Express server
    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/studios`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-api-key": process.env.INTERNAL_API_SECRET,
          "x-user-email": session.user.email,
        },
        body: JSON.stringify({
          ...body,
          hostName: session.user.name,
          hostEmail: session.user.email,
        }),
        cache: "no-store",
      }
    );

    // Read server response
    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Express returned invalid JSON:", text);

      return NextResponse.json(
        {
          success: false,
          message: "Invalid response from server",
        },
        { status: 502 }
      );
    }

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Create Studio API Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create studio",
      },
      { status: 500 }
    );
  }
}