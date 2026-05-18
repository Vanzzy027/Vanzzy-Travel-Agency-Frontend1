import { fetchBaseQuery, } from "@reduxjs/toolkit/query";
import { logout } from "../../features/slice/AuthSlice";
import { toast } from "react-toastify";
const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api`,
    prepareHeaders: (headers, { getState }) => {
        const token = getState().auth.token;
        console.log("🔑 TOKEN USED:", token);
        if (token) {
            headers.set("authorization", `Bearer ${token}`);
        }
        return headers;
    },
});
export const baseQueryWithReauth = async (args, api, extraOptions) => {
    console.log("📡 API CALL:", args);
    const result = await rawBaseQuery(args, api, extraOptions);
    console.log("📡 API RESULT:", result);
    if (result.error) {
        console.error("❌ API ERROR:", result.error);
        const status = result.error.status;
        // 🔥 HANDLE 401 GLOBALLY (Session Expired)
        if (status === 401) {
            console.warn("🔒 401 detected - session expired");
            const state = api.getState();
            const isLoggedIn = !!state.auth.token;
            if (isLoggedIn) {
                console.log("🚪 Dispatching logout...");
                api.dispatch(logout());
                toast.error("Session expired. Please log in again.", {
                    position: "top-right",
                    autoClose: 3000,
                });
            }
        }
        // 🔥 HANDLE 5xx SERVER ERRORS GLOBALLY
        else if (typeof status === "number" && status >= 500) {
            toast.error("Internal server error. Our team is looking into it.", {
                position: "top-right",
                autoClose: 4000,
            });
        }
        // 🔥 HANDLE NETWORK ERRORS (e.g., server offline, no internet)
        else if (status === "FETCH_ERROR") {
            toast.error("Network error. Please check your connection or try again later.", {
                position: "top-right",
                autoClose: 4000,
            });
        }
    }
    return result;
};
// import {
//   fetchBaseQuery,
//   type BaseQueryFn,
//   type FetchArgs,
//   type FetchBaseQueryError,
// } from "@reduxjs/toolkit/query";
// import { logout } from "../../features/slice/AuthSlice";
// import type { RootState } from "../../store/store";
// import { toast } from "react-toastify";
// const rawBaseQuery = fetchBaseQuery({
//   baseUrl: `${import.meta.env.VITE_API_URL}/api`,
//   prepareHeaders: (headers, { getState }) => {
//     const token = (getState() as RootState).auth.token;
//     console.log("🔑 TOKEN USED:", token);
//     if (token) {
//       headers.set("authorization", `Bearer ${token}`);
//     }
//     return headers;
//   },
// });
// export const baseQueryWithReauth: BaseQueryFn<
//   string | FetchArgs,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions) => {
//   console.log("📡 API CALL:", args);
//   const result = await rawBaseQuery(args, api, extraOptions);
//   console.log("📡 API RESULT:", result);
//   if (result.error) {
//     console.error("❌ API ERROR:", result.error);
//   }
//   // 🔥 HANDLE 401 GLOBALLY
//   if (result.error?.status === 401) {
//     console.warn("🔒 401 detected - session expired");
//     // ✅ Avoid firing multiple times (important)
//     const state = api.getState() as RootState;
//     const isLoggedIn = !!state.auth.token;
//     if (isLoggedIn) {
//       console.log("🚪 Dispatching logout...");
//       // 1. Clear auth state
//       api.dispatch(logout());
//       // 2. Show toast (clean UX)
//       toast.error("Session expired. Please log in again.", {
//         position: "top-right",
//         autoClose: 3000,
//       });
//     }
//   }
//   return result;
// };
