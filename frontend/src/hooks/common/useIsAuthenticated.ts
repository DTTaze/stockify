"use client";

import { getCookie } from "cookies-next/client";
import { useEffect } from "react";

import { ACCESS_TOKEN } from "@/constants/auth";
import {
  selectIsAuthenticated,
  useAppDispatch,
  useAppStore,
} from "@/store/app/app";

export const useIsAuthenticated = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppStore(selectIsAuthenticated);

  useEffect(() => {
    const token = getCookie(ACCESS_TOKEN);

    if (!token) {
      dispatch({
        type: "SET_AUTH",
        payload: false,
      });
      return;
    }

    dispatch({
      type: "SET_AUTH",
      payload: true,
    });
  }, [dispatch]);

  return isAuthenticated;
};
