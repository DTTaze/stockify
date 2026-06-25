import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

import { ACCESS_TOKEN, ROLE, ROLE_NAME } from "./constants/auth";
import { routing } from "./i18n/routing";
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
  protectedRouteEnum.STOCKS,
];

export const ADMIN_ROUTES = [
  protectedRouteEnum.ADMIN_DASHBOARD,
  protectedRouteEnum.USERS,
  protectedRouteEnum.MODELS,
  protectedRouteEnum.DATA,
  protectedRouteEnum.MONITORING,
];

function isPublicRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname as publicRouteEnum);
}

function isUserRoute(pathname: string) {
  return USER_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string) {
  return ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

const intlMiddleware = createMiddleware(routing);

export function proxy(req: NextRequest) {
  // 1. Run next-intl middleware first to handle locale redirects and headers
  const response = intlMiddleware(req);

  // If next-intl decided to redirect, honor it
  if (
    response.status === 307 ||
    response.status === 308 ||
    response.status === 302
  ) {
    return response;
  }

  const { pathname } = req.nextUrl;

  // Extract locale prefix
  const localeMatch = pathname.match(/^\/(vi|en)(\/|$)/);
  const locale = localeMatch ? localeMatch[1] : "vi";

  // Clean pathname for route mapping (strip the locale prefix)
  const cleanPathname = pathname.replace(/^\/(vi|en)(\/|$)/, "/") || "/";

  const token = req.cookies.get(ACCESS_TOKEN)?.value;
  const roleCookie = req.cookies.get(ROLE)?.value;

  const roles = roleCookie ? roleCookie.split(",") : [];

  const isAdmin = roles.includes(ROLE_NAME.ADMIN);
  const isUser = roles.includes(ROLE_NAME.USER);

  // chưa login
  if (!token && (isUserRoute(cleanPathname) || isAdminRoute(cleanPathname))) {
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // login rồi mà vào auth page
  if (token && isPublicRoute(cleanPathname)) {
    if (isAdmin) {
      return NextResponse.redirect(
        new URL(`/${locale}/admin/dashboard`, req.url),
      );
    }

    if (isUser) {
      return NextResponse.redirect(
        new URL(`/${locale}/user/dashboard`, req.url),
      );
    }
  }

  // admin không được vào user route
  if (isAdmin && isUserRoute(cleanPathname)) {
    return NextResponse.redirect(
      new URL(`/${locale}/admin/dashboard`, req.url),
    );
  }

  // user không được vào admin route
  if (isUser && isAdminRoute(cleanPathname)) {
    return NextResponse.redirect(new URL(`/${locale}/user/dashboard`, req.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
