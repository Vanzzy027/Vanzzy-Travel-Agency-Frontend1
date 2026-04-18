import {fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { logout } from "../../features/slice/AuthSlice";
import {type RootState } from "../../store/store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL, // Uses your localhost:3000
  prepareHeaders: (headers, { getState }) => {
    // Automatically grab token from your authSlice state
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Check if we are already on the login page to avoid infinite loops
    if (!window.location.pathname.includes("/login")) {
      console.warn("Session expired. Logging out...");

      // 1. Trigger the logout reducer you just showed me
      api.dispatch(logout());

      // 2. Redirect to login
      window.location.href = "/login?reason=expired";
    }
  }

  return result;
};
