import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    // 1. Verify logged-in user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Please login first",
        },
        { status: 401 }
      );
    }

    // 2. Get form data
    const body = await request.json();

    // 3. Check environment variables
    if (
      !process.env.SERVER_API_URL ||
      !process.env.INTERNAL_API_SECRET
    ) {
      throw new Error("Missing server environment variables");
    }

    // 4. Attach authenticated user information
    const studioData = {
      ...body,
      hostName: session.user.name,
      hostEmail: session.user.email,
    };

    // 5. Send request to Express backend
    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/studios`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-api-key": process.env.INTERNAL_API_SECRET,
        },
        body: JSON.stringify(studioData),
        cache: "no-store",
      }
    );

    // 6. Read backend response
    const text = await response.text();

    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Express returned non-JSON response:", text);

      return NextResponse.json(
        {
          success: false,
          message: "Backend returned an invalid response",
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
        message: error.message || "Failed to create studio",
      },
      { status: 500 }
    );
  }
}