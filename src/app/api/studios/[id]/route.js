export async function DELETE(request, { params }) {
  try {
    // Get request headers
    const requestHeaders = await headers();

    // Check user session
    const session = await auth.api.getSession({
      headers: requestHeaders,
    });

    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Please login first" },
        { status: 401 },
      );
    }

    const { id } = await params;
    // Send data to Express server
    const response = await fetch(`${process.env.SERVER_API_URL}/api/studios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-api-key": process.env.INTERNAL_API_SECRET,
        "x-user-email": session.user.email,

        // Forward authentication cookie
        Cookie: requestHeaders.get("cookie") || "",
      },
      body: JSON.stringify({
        ...body,
        hostName: session.user.name,
        hostEmail: session.user.email,
      }),
      cache: "no-store",
    });

    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch (error) {
    console.error("Delete studio error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to delete studio" },
      { status: 500 },
    );
  }
}
