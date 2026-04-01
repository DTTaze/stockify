/* eslint-disable no-unused-vars */

export enum SORT_DIRECTIONS {
  ASC = "createdAt",
  DESC = "-createdAt",
}

export interface SearchParams {
  limit?: number;
  total?: number;
  offset?: number;
  fromDate?: string;
  toDate?: string;
  keyword?: string;
}

export interface PaginatedResponse<T> {
  rows: T;
  limit: number;
  total: number;
  offset: number;
}

export interface DefaultTableParams {
  limit?: number;
  offset?: number;
  sort?: SORT_DIRECTIONS;
  fromDate?: string;
  toDate?: string;
}

export interface BreadcrumbType {
  link?: string;
  name: string;
}

export interface ErrorType {
  message: string;
  errorCode: string;
}
