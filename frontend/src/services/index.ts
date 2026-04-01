import axios from "axios";
import { getCookie } from "cookies-next/client";

import { ACCESS_TOKEN } from "@/constants/auth";
import { IS_PRODUCTION, STATIC_API_URL } from "@/constants/common";
import { logout } from "@/helpers/logout";
import { ApiError } from "@/types/api";

const axiosClient = axios.create({
  baseURL: STATIC_API_URL,
  timeout: 30000,
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  function (config) {
    const token = getCookie(ACCESS_TOKEN);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      logout();
    }

    if (!IS_PRODUCTION) console.log(error);

    const apiError: ApiError = { message, status };

    return Promise.reject(apiError);
  },
);

export default axiosClient;
