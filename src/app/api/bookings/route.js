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
    { status: 401 }
  );
}

const body = await request.json();

const response = await fetch(
  `${process.env.SERVER_API_URL}/api/bookings`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-internal-api-key": process.env.INTERNAL_API_SECRET,
      cookie: requestHeaders.get("cookie") || "",
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
console.error("Create booking error:", error);


return NextResponse.json(
  { success: false, message: "Failed to create booking" },
  { status: 500 }
);


}
}
