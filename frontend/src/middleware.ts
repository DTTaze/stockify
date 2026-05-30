import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN, ROLE, ROLE_NAME } from "./constants/auth";
import { protectedRouteEnum, publicRouteEnum } from "./types/route";

export const AUTH_ROUTES = [
  publicRouteEnum.HOME_PAGE,
  publicRouteEnum.LOGIN,
  publicRouteEnum.REGISTER,
  publicRouteEnum.FORGOT_PASSWORD,
];

export const USER_ROUTES = [
  protectedRouteEnum.DASHBOARD,
  protectedRouteEnum.WATCHLIST,
];

export const ADMIN_ROUTES = [
  protectedRouteEnum.ADMIN_DASHBOARD,
  protectedRouteEnum.USERS,
  protectedRouteEnum.MODELS,
  protectedRouteEnum.DATA,
  protectedRouteEnum.MONITORING,
];

function isPublicRoute(pathname: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return AUTH_ROUTES.includes(pathname as any);
}

function isUserRoute(pathname: string) {
  return USER_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string) {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get(ACCESS_TOKEN)?.value;
  const roleCookie = req.cookies.get(ROLE)?.value;

  const roles = roleCookie ? roleCookie.split(",") : [];

  const isAdmin = roles.includes(ROLE_NAME.ADMIN);
  const isUser = roles.includes(ROLE_NAME.USER);

  // chưa login
  if (!token && (isUserRoute(pathname) || isAdminRoute(pathname))) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // login rồi mà vào auth page
  if (token && isPublicRoute(pathname)) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    if (isUser) {
      return NextResponse.redirect(new URL("/user/dashboard", req.url));
    }
  }

  // admin không được vào user route
  if (isAdmin && isUserRoute(pathname)) {
    return NextResponse.redirect(new URL("/admin/dashboard", req.url));
  }

  // user không được vào admin route
  if (isUser && isAdminRoute(pathname)) {
    return NextResponse.redirect(new URL("/user/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
