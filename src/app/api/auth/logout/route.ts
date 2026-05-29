import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendResponse = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: cookieHeader,
      },
    }
  );

  const setCookie = backendResponse.headers.get("set-cookie");

  const response = NextResponse.json(
    { message: "logout realizado" },
    { status: 200 }
  );

  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}