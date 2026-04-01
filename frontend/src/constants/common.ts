export const STATIC_API_URL = process.env.NEXT_PUBLIC_STATIC_API_URL;
export const IS_PRODUCTION = process.env.NEXT_PUBLIC_ENV === "production";
export const IS_DEVELOPMENT = process.env.NEXT_PUBLIC_ENV === "development";

export const LOCALE_COOKIE_KEY = "NEXT_LOCALE";
export const X_PATHNAME_KEY = "X-Pathname-Key";
export const HIDDEN_BALANCE_PATTERN = "******";

export const PROJECT_NAME = "Stockify";

export const EMPTY_TEMPLATE_STRING = "--";

export const DEFAULT_PAGE_SIZE = 10;

export const DEFAULT_PAGINATION_RESPONSE = {
  rows: [],
  limit: 0,
  offset: 0,
  total: 0,
};

export const DEFAULT_PAGINATION_LIMIT = 10;
export const DEFAULT_PAGINATION_OFFSET = 0;
