import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/feed/:path*",
    "/sub_admin/:path*",
    "/registroCliente/:path*",
    "/registroSub_Admin/:path*",
    "/registroAdmin/:path*",
    "/cupons/:path*",
    "/atividades/:path*",
    "/admin/:path*",
  ],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  try {
    await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////