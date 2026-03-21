import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN } from "./constants/auth";
import { publicRouteEnum } from "./types/route";

export const PUBLIC_ROUTES = [
  publicRouteEnum.HOME_PAGE,
  publicRouteEnum.LOGIN,
  publicRouteEnum.REGISTER,
  publicRouteEnum.FORGOT_PASSWORD,
];

export const PROTECTED_ROUTES = [];

function isProtectedRoute(pathname: string) {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isPublicRoute(pathname: string) {
  return PUBLIC_ROUTES.some((route) => pathname === route);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get(ACCESS_TOKEN)?.value;

  if (isProtectedRoute(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isPublicRoute(pathname) && token) {
    return NextResponse.redirect(new URL("/profile", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
