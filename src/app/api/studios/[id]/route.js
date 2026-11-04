export async function DELETE(request, { params }) {
try {
const requestHeaders = await headers();


const session = await auth.api.getSession({
  headers: requestHeaders,
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
      cookie: requestHeaders.get("cookie") || "",
    },
    cache: "no-store",
  }
);

const result = await response.json();

return NextResponse.json(result, {
  status: response.status,
});


} catch (error) {
console.error("Delete studio error:", error);


return NextResponse.json(
  { success: false, message: "Failed to delete studio" },
  { status: 500 }
);


}
}
