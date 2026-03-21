/* eslint-disable no-unused-vars */

export enum RoutePath {
  Home = "/",
}

export enum RouteAlias {
  Home = "home",
}

export type RouteItem = {
  titleKey: string;
  url: RoutePath;
  alias: RouteAlias;
  visibleInNav?: boolean;
  requiresAuth?: boolean;
};

export type NavItem = { label: string; href: RoutePath };
export type FooterSectionType = {
  title: string;
  items: ReadonlyArray<NavItem>;
};

export enum publicRouteEnum {
  HOME_PAGE = "/",
  LOGIN = "/login",
  FORGOT_PASSWORD = "/forgot-password",
  REGISTER = "/register",
}

export enum protectedRouteEnum {}

export interface NavType {
  label: string;
  alias: string;
  href: string;
  children?: string[];
}
