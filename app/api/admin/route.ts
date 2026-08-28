import { NextResponse } from "next/server";
import { ADMIN_COOKIE, cookieOptions, createAdminSession, isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/** Report whether the caller currently holds an admin session. */
export async function GET() {
  return NextResponse.json({ admin: await isAdmin() });
}

/** Exchange the shared admin password for a signed session cookie. */
export async function POST(request: Request) {
  let password = "";
  try {
    const body = await request.json();
    password = typeof body?.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = createAdminSession(password);
  if (!token) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ admin: true });
  response.cookies.set(ADMIN_COOKIE, token, cookieOptions);
  return response;
}

/** Sign out of admin mode. */
export async function DELETE() {
  const response = NextResponse.json({ admin: false });
  response.cookies.set(ADMIN_COOKIE, "", { ...cookieOptions, maxAge: 0 });
  return response;
}
