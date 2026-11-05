// app/api/studios/[id]/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth"; // আপনার Better Auth ইনস্ট্যান্সের পাথ ঠিক করে নিন

export async function GET(request, { params }) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    if (!process.env.SERVER_API_URL || !process.env.INTERNAL_API_SECRET) {
      console.error("Missing SERVER_API_URL or INTERNAL_API_SECRET in env");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/studios/${id}`,
      {
        method: "GET",
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
      console.error("Express returned non-JSON:", response.status, text);
      return NextResponse.json(
        { success: false, message: "Invalid response from API server" },
        { status: 502 }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Get studio error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch studio" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    if (!process.env.SERVER_API_URL || !process.env.INTERNAL_API_SECRET) {
      console.error("Missing SERVER_API_URL or INTERNAL_API_SECRET in env");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const { id } = await params;

    let body;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid request body" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/studios/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-internal-api-key": process.env.INTERNAL_API_SECRET,
          "x-user-email": session.user.email,
          "x-user-id": session.user.id,
          "x-user-name": encodeURIComponent(session.user.name || ""),
        },
        body: JSON.stringify(body),
        cache: "no-store",
        signal: AbortSignal.timeout(25000),
      }
    );

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Express returned non-JSON:", response.status, text);
      return NextResponse.json(
        { success: false, message: "Invalid response from API server" },
        { status: 502 }
      );
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Update studio error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update studio" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 }
      );
    }

    if (!process.env.SERVER_API_URL || !process.env.INTERNAL_API_SECRET) {
      console.error("Missing SERVER_API_URL or INTERNAL_API_SECRET in env");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    const { id } = await params;

    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/studios/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
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
      console.error("Express returned non-JSON:", response.status, text);
      return NextResponse.json(
        { success: false, message: "Invalid response from API server" },
        { status: 502 }
      );
    }

    if (!response.ok) {
      console.error("Express error:", response.status, result);
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Delete studio error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete studio" },
      { status: 500 }
    );
  }
}