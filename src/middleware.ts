import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role?: string;
  exp?: number;
  [key: string]: any;
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const path = request.nextUrl.pathname;

  const protectedPaths = [
    "/dashboard",
    // "/antrian",
    "/monitoring",
    "/queue",
    "/user",
    "/classes",
  ];

  const isProtected = protectedPaths.some((p) =>
    path.startsWith(p)
  );

  if (path === "/login" && token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        return response;
      }

      return NextResponse.redirect(new URL("/dashboard", request.url));
    } catch (err) {
      console.error("Token tidak valid:", err);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }
  }

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const decoded = jwtDecode<DecodedToken>(token);

      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("access_token");
        return response;
      }

      const userRole = decoded.role?.toUpperCase() || "";
      if (path.startsWith("/user")) {
        const allowedRoles = ["ADMIN", "ADMINUSERS"];
        if (!allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }
    } catch (err) {
      console.error("Token tidak valid:", err);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("access_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/antrian/:path*",
    "/monitoring/:path*",
    "/queue/:path*",
    "/user/:path*",
    "/classes/:path*",
  ],
};
