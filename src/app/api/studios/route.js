// app/api/studios/route.js
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(request) {
  try {
    const requestHeaders = await headers();

    const session = await auth.api.getSession({ headers: requestHeaders });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 },
      );
    }

    if (!process.env.SERVER_API_URL || !process.env.INTERNAL_API_SECRET) {
      console.error("Missing SERVER_API_URL or INTERNAL_API_SECRET in env");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 },
      );
    }

    const body = await request.json();

    const response = await fetch(`${process.env.SERVER_API_URL}/api/studios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_SECRET,
        "x-user-email": session.user.email,
        "x-user-id": session.user.id,

        "x-user-name": encodeURIComponent(session.user.name || ""),
        Cookie: requestHeaders.get("cookie") || "",
      },
      body: JSON.stringify({
        ...body,
        hostName: session.user.name,
        hostEmail: session.user.email,
      }),
      cache: "no-store",
    });

    const text = await response.text();
    let result;

    try {
      result = JSON.parse(text);
    } catch {
      console.error("Express returned non-JSON:", response.status, text);
      return NextResponse.json(
        { success: false, message: "Invalid response from API server" },
        { status: 502 },
      );
    }

    if (!response.ok) {
      console.error("Express error:", response.status, result);
    }

    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error("Create studio error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create studio" },
      { status: 500 },
    );
  }
}
