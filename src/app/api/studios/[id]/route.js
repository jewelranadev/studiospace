import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Fetch single studio
export async function GET(request, { params }) {
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
      `${process.env.SERVER_API_URL}/api/studios/${id}`,
      {
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
    console.error("Get Studio Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch studio" },
      { status: 500 }
    );
  }
}

// Update studio
export async function PUT(request, { params }) {
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
    const body = await request.json();

    const response = await fetch(
      `${process.env.SERVER_API_URL}/api/studios/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-internal-api-key": process.env.INTERNAL_API_SECRET,
          "x-user-email": session.user.email,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    );

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Update Studio Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update studio" },
      { status: 500 }
    );
  }
}

//Delete studio
export async function DELETE(request, { params }) {
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
      `${process.env.SERVER_API_URL}/api/studios/${id}`,
      {
        method: "DELETE",
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
    console.error("Delete Studio Error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete studio" },
      { status: 500 }
    );
  }
}