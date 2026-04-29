import { createApi } from "@reduxjs/toolkit/query/react";
// 🚨 Import your global base query! (Adjust path to where it lives)
import { baseQueryWithReauth } from "./baseQuery";
// API Definition
export const vehicleApi = createApi({
    reducerPath: "vehicleApi",
    // ✅ Using your custom base query!
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Vehicle", "VehicleSpec"],
    endpoints: (builder) => ({
        // --- VEHICLE SPECS ENDPOINTS ---
        getVehicleSpecs: builder.query({
            query: () => "vehicle-specs", // Removed leading slash
            providesTags: (result) => result
                ? [
                    ...result.map(({ vehicleSpec_id }) => ({
                        type: "VehicleSpec",
                        id: vehicleSpec_id,
                    })),
                    { type: "VehicleSpec", id: "LIST" },
                ]
                : [{ type: "VehicleSpec", id: "LIST" }],
        }),
        getVehicleSpecById: builder.query({
            query: (id) => `vehicle-specs/${id}`, // Removed leading slash
            providesTags: (_result, _error, id) => [{ type: "VehicleSpec", id }],
        }),
        createVehicleSpec: builder.mutation({
            query: (body) => ({
                url: "vehicle-specs", // Removed leading slash
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "VehicleSpec", id: "LIST" }],
        }),
        updateVehicleSpec: builder.mutation({
            query: ({ id, data }) => ({
                url: `vehicle-specs/${id}`, // Removed leading slash
                method: "PUT",
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: "VehicleSpec", id },
                { type: "VehicleSpec", id: "LIST" },
            ],
        }),
        deleteVehicleSpec: builder.mutation({
            query: (id) => ({
                url: `vehicle-specs/${id}`, // Removed leading slash
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: "VehicleSpec", id },
                { type: "VehicleSpec", id: "LIST" },
                // If a spec is deleted, available vehicles might change too
                { type: "Vehicle", id: "LIST" },
                { type: "Vehicle", id: "AVAILABLE" },
            ],
        }),
        // --- VEHICLE ENDPOINTS ---
        getAvailableVehicles: builder.query({
            query: () => "vehicles/available", // Removed leading slash
            transformResponse: (response) => {
                if (Array.isArray(response))
                    return response;
                if (response?.data && Array.isArray(response.data))
                    return response.data;
                if (response?.vehicles && Array.isArray(response.vehicles))
                    return response.vehicles;
                return [];
            },
            providesTags: (result) => {
                const tags = (result ?? []).map(({ vehicle_id }) => ({
                    type: "Vehicle",
                    id: vehicle_id,
                }));
                tags.push({ type: "Vehicle", id: "AVAILABLE" });
                return tags;
            },
        }),
        getVehicles: builder.query({
            query: () => "vehicles", // Removed leading slash
            transformResponse: (response) => {
                const rawData = Array.isArray(response)
                    ? response
                    : response?.data || [];
                return rawData.map((vehicle) => ({
                    ...vehicle, // Using spread operator to keep it clean (assuming mapping is 1:1)
                }));
            },
            providesTags: (result) => result
                ? [
                    ...result.map(({ vehicle_id }) => ({
                        type: "Vehicle",
                        id: vehicle_id,
                    })),
                    { type: "Vehicle", id: "LIST" },
                ]
                : [{ type: "Vehicle", id: "LIST" }],
        }),
        getVehicleById: builder.query({
            query: (id) => `vehicles/${id}`, // Removed leading slash
            providesTags: (_result, _error, id) => [{ type: "Vehicle", id }],
        }),
        addVehicle: builder.mutation({
            query: (body) => ({
                url: "vehicles", // Removed leading slash
                method: "POST",
                body,
            }),
            // 🔥 Now also invalidates AVAILABLE so new cars show up in the store!
            invalidatesTags: [
                { type: "Vehicle", id: "LIST" },
                { type: "Vehicle", id: "AVAILABLE" },
            ],
        }),
        updateVehicle: builder.mutation({
            query: ({ id, data }) => ({
                url: `vehicles/${id}`, // Removed leading slash
                method: "PUT",
                body: data,
            }),
            // 🔥 Keep storefront in sync
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Vehicle", id },
                { type: "Vehicle", id: "LIST" },
                { type: "Vehicle", id: "AVAILABLE" },
            ],
        }),
        deleteVehicle: builder.mutation({
            query: (id) => ({
                url: `vehicles/${id}`, // Removed leading slash
                method: "DELETE",
            }),
            // 🔥 Keep storefront in sync
            invalidatesTags: (_result, _error, id) => [
                { type: "Vehicle", id },
                { type: "Vehicle", id: "LIST" },
                { type: "Vehicle", id: "AVAILABLE" },
            ],
        }),
        updateVehicleStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `vehicles/${id}/status`, // Removed leading slash
                method: "PATCH",
                body: { status },
            }),
            // 🔥 Crucial: Removes rented cars from the available list!
            invalidatesTags: (_result, _error, { id }) => [
                { type: "Vehicle", id },
                { type: "Vehicle", id: "LIST" },
                { type: "Vehicle", id: "AVAILABLE" },
            ],
        }),
    }),
});
export const { useGetVehicleSpecsQuery, useGetVehicleSpecByIdQuery, useCreateVehicleSpecMutation, useUpdateVehicleSpecMutation, useDeleteVehicleSpecMutation, useGetVehiclesQuery, useGetVehicleByIdQuery, useAddVehicleMutation, useUpdateVehicleMutation, useDeleteVehicleMutation, useUpdateVehicleStatusMutation, useGetAvailableVehiclesQuery, } = vehicleApi;
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// // Vehicle Interfaces
// export interface VehicleSpec {
//   vehicleSpec_id: number;
//   manufacturer: string;
//   model: string;
//   year: number;
//   fuel_type: string;
//   engine_capacity?: string;
//   transmission: string;
//   seating_capacity: number;
//   color: string;
//   features?: string;
//   images?: string;
//   vehicle_type: string;
//   fuel_efficiency?: string;
//   daily_rate?: number;
//   weekly_rate?: number;
//   monthly_rate?: number;
//   insurance_group?: string;
//   on_promo: boolean;
//   promo_rate?: number;
//   promo_start_date?: string;
//   promo_end_date?: string;
//   review_count: number;
//   created_at: string;
//   updated_at: string;
// }
// export interface Vehicle {
//   vehicle_id: number;
//   vehicleSpec_id: number;
//   vin_number: string;
//   license_plate: string;
//   current_mileage: number;
//   rental_rate: number;
//   status: "Available" | "Rented" | "Maintenance" | "Unavailable";
//   created_at: string;
//   updated_at: string;
//   // Joined fields from VehicleSpec
//   manufacturer?: string;
//   model?: string;
//   year?: number;
//   fuel_type?: string;
//   engine_capacity?: string;
//   transmission?: string;
//   seating_capacity?: number;
//   color?: string;
//   features?: string;
//   images?: string;
//   vehicle_type?: string;
//   fuel_efficiency?: string;
//   daily_rate?: number;
//   weekly_rate?: number;
//   monthly_rate?: number;
//   insurance_group?: string;
//   on_promo?: boolean;
//   promo_rate?: number;
//   promo_start_date?: string;
//   promo_end_date?: string;
// }
// // Request Interfaces
// export interface CreateVehicleSpecRequest {
//   manufacturer: string;
//   model: string;
//   year: number;
//   fuel_type: string;
//   engine_capacity?: string;
//   transmission: string;
//   seating_capacity: number;
//   color: string;
//   vehicle_type: string;
//   features?: string;
//   images?: string;
//   fuel_efficiency?: string;
//   daily_rate?: number;
//   weekly_rate?: number;
//   monthly_rate?: number;
//   insurance_group?: string;
//   on_promo?: boolean;
//   promo_rate?: number;
//   promo_start_date?: string;
//   promo_end_date?: string;
// }
// export interface VehicleWithSpecs {
//   vehicle_id: number;
//   vehicleSpec_id: number;
//   vin_number: string;
//   license_plate: string;
//   current_mileage: number;
//   rental_rate: number;
//   status: string;
//   created_at: string;
//   updated_at: string;
//   // Add specification as nested object
//   specification?: {
//     manufacturer: string;
//     model: string;
//     year: number;
//     fuel_type: string;
//     engine_capacity: string;
//     transmission: string;
//     avg_rating?: number;
//     seating_capacity: number;
//     color: string;
//     features: string;
//     images: string;
//     on_promo: boolean;
//     promo_rate: number;
//     promo_start_date: string;
//     promo_end_date: string;
//     review_count: number;
//     vehicle_type: string;
//     fuel_efficiency: string;
//     daily_rate: number;
//     weekly_rate: number;
//     monthly_rate: number;
//     insurance_group: string;
//   };
//   // OR flatten the properties (recommended):
//   manufacturer?: string;
//   model?: string;
//   year?: number;
//   fuel_type?: string;
//   engine_capacity?: string;
//   transmission?: string;
//   seating_capacity?: number;
//   color?: string;
//   features?: string;
//   images?: string;
//   on_promo?: boolean;
//   promo_rate?: number;
//   promo_start_date?: string;
//   promo_end_date?: string;
//   review_count?: number;
//   vehicle_type?: string;
//   fuel_efficiency?: string;
//   daily_rate?: number;
//   weekly_rate?: number;
//   monthly_rate?: number;
//   insurance_group?: string;
// }
// export interface UpdateVehicleSpecRequest {
//   manufacturer?: string;
//   model?: string;
//   year?: number;
//   fuel_type?: string;
//   engine_capacity?: string;
//   transmission?: string;
//   seating_capacity?: number;
//   color?: string;
//   vehicle_type?: string;
//   features?: string;
//   images?: string;
//   fuel_efficiency?: string;
//   daily_rate?: number;
//   weekly_rate?: number;
//   monthly_rate?: number;
//   insurance_group?: string;
//   on_promo?: boolean;
//   promo_rate?: number;
//   promo_start_date?: string;
//   promo_end_date?: string;
// }
// export interface CreateVehicleRequest {
//   vehicleSpec_id: number;
//   vin_number: string;
//   license_plate: string;
//   current_mileage: number;
//   rental_rate: number;
//   status: "Available" | "Rented" | "Maintenance" | "Unavailable";
// }
// export interface UpdateVehicleRequest {
//   vin_number?: string;
//   license_plate?: string;
//   current_mileage?: number;
//   rental_rate?: number;
//   status?: "Available" | "Rented" | "Maintenance" | "Unavailable";
// }
// //Constant API URL
// const API_BASE_URL = import.meta.env.VITE_API_URL;
// // API Definition
// export const vehicleApi = createApi({
//   reducerPath: "vehicleApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: `${API_BASE_URL}/api`,
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         const cleanToken = token.replace(/"/g, "");
//         headers.set("authorization", `Bearer ${cleanToken}`);
//         // headers.set('Authorization', `Bearer ${token}`);
//       }
//       //headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ["Vehicle", "VehicleSpec"],
//   endpoints: (builder) => ({
//     // --- VEHICLE SPECS ENDPOINTS ---
//     // Get all vehicle specifications
//     getVehicleSpecs: builder.query<VehicleSpec[], void>({
//       query: () => "/vehicle-specs",
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ vehicleSpec_id }) => ({
//                 type: "VehicleSpec" as const,
//                 id: vehicleSpec_id,
//               })),
//               { type: "VehicleSpec", id: "LIST" },
//             ]
//           : [{ type: "VehicleSpec", id: "LIST" }],
//     }),
//     // Get vehicle spec by ID
//     getVehicleSpecById: builder.query<VehicleSpec, number>({
//       query: (id) => `/vehicle-specs/${id}`,
//       providesTags: (_result, _error, id) => [{ type: "VehicleSpec", id }],
//     }),
//     // Create vehicle specification
//     createVehicleSpec: builder.mutation<VehicleSpec, CreateVehicleSpecRequest>({
//       query: (body) => ({
//         url: "/vehicle-specs",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: [{ type: "VehicleSpec", id: "LIST" }],
//     }),
//     // Update vehicle specification
//     updateVehicleSpec: builder.mutation<
//       VehicleSpec,
//       { id: number; data: UpdateVehicleSpecRequest }
//     >({
//       query: ({ id, data }) => ({
//         url: `/vehicle-specs/${id}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: "VehicleSpec", id },
//         { type: "VehicleSpec", id: "LIST" },
//       ],
//     }),
//     // Delete vehicle specification
//     deleteVehicleSpec: builder.mutation<void, number>({
//       query: (id) => ({
//         url: `/vehicle-specs/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (_result, _error, id) => [
//         { type: "VehicleSpec", id },
//         { type: "VehicleSpec", id: "LIST" },
//         { type: "Vehicle", id: "LIST" }, // Invalidate vehicles too since they might be affected
//       ],
//     }),
//     // --- VEHICLE ENDPOINTS ---
//     //     // GET: Available Vehicles Only
//     getAvailableVehicles: builder.query<VehicleWithSpecs[], void>({
//       query: () => "/vehicles/available",
//       transformResponse: (response: any) => {
//         // Preserving your robust response parsing
//         if (Array.isArray(response)) return response;
//         if (response?.data && Array.isArray(response.data))
//           return response.data;
//         if (response?.vehicles && Array.isArray(response.vehicles))
//           return response.vehicles;
//         return []; // fallback
//       },
//       providesTags: (result) => {
//         const tags: { type: "Vehicle"; id: number | "AVAILABLE" }[] = (
//           result ?? []
//         ).map(({ vehicle_id }) => ({
//           type: "Vehicle" as const,
//           id: vehicle_id,
//         }));
//         tags.push({ type: "Vehicle" as const, id: "AVAILABLE" });
//         return tags;
//       },
//     }),
//     // Get all vehicles with specs
//     getVehicles: builder.query<Vehicle[], void>({
//       query: () => "/vehicles",
//       transformResponse: (response: any) => {
//         const rawData = Array.isArray(response)
//           ? response
//           : response?.data || [];
//         return rawData.map((vehicle: any) => ({
//           vehicle_id: vehicle.vehicle_id,
//           vehicleSpec_id: vehicle.vehicleSpec_id,
//           vin_number: vehicle.vin_number,
//           license_plate: vehicle.license_plate,
//           current_mileage: vehicle.current_mileage,
//           rental_rate: vehicle.rental_rate,
//           status: vehicle.status,
//           created_at: vehicle.created_at,
//           updated_at: vehicle.updated_at,
//           // Include spec fields
//           manufacturer: vehicle.manufacturer,
//           model: vehicle.model,
//           year: vehicle.year,
//           fuel_type: vehicle.fuel_type,
//           engine_capacity: vehicle.engine_capacity,
//           transmission: vehicle.transmission,
//           seating_capacity: vehicle.seating_capacity,
//           color: vehicle.color,
//           features: vehicle.features,
//           images: vehicle.images,
//           vehicle_type: vehicle.vehicle_type,
//           fuel_efficiency: vehicle.fuel_efficiency,
//           daily_rate: vehicle.daily_rate,
//           weekly_rate: vehicle.weekly_rate,
//           monthly_rate: vehicle.monthly_rate,
//           insurance_group: vehicle.insurance_group,
//           on_promo: vehicle.on_promo,
//           promo_rate: vehicle.promo_rate,
//           promo_start_date: vehicle.promo_start_date,
//           promo_end_date: vehicle.promo_end_date,
//         }));
//       },
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.map(({ vehicle_id }) => ({
//                 type: "Vehicle" as const,
//                 id: vehicle_id,
//               })),
//               { type: "Vehicle", id: "LIST" },
//             ]
//           : [{ type: "Vehicle", id: "LIST" }],
//     }),
//     // Get vehicle by ID
//     getVehicleById: builder.query<Vehicle, number>({
//       query: (id) => `/vehicles/${id}`,
//       providesTags: (_result, _error, id) => [{ type: "Vehicle", id }],
//     }),
//     // Create vehicle
//     addVehicle: builder.mutation<Vehicle, CreateVehicleRequest>({
//       query: (body) => ({
//         url: "/vehicles",
//         method: "POST",
//         body,
//       }),
//       invalidatesTags: [{ type: "Vehicle", id: "LIST" }],
//     }),
//     // Update vehicle
//     updateVehicle: builder.mutation<
//       Vehicle,
//       { id: number; data: UpdateVehicleRequest }
//     >({
//       query: ({ id, data }) => ({
//         url: `/vehicles/${id}`,
//         method: "PUT",
//         body: data,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: "Vehicle", id },
//         { type: "Vehicle", id: "LIST" },
//       ],
//     }),
//     // Delete vehicle
//     deleteVehicle: builder.mutation<void, number>({
//       query: (id) => ({
//         url: `/vehicles/${id}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: (_result, _error, id) => [
//         { type: "Vehicle", id },
//         { type: "Vehicle", id: "LIST" },
//       ],
//     }),
//     // Update vehicle status only
//     updateVehicleStatus: builder.mutation<
//       Vehicle,
//       { id: number; status: string }
//     >({
//       query: ({ id, status }) => ({
//         url: `/vehicles/${id}/status`,
//         method: "PATCH",
//         body: { status },
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: "Vehicle", id },
//         { type: "Vehicle", id: "LIST" },
//       ],
//     }),
//   }),
// });
// // Export hooks
// export const {
//   // Vehicle Specs
//   useGetVehicleSpecsQuery,
//   useGetVehicleSpecByIdQuery,
//   useCreateVehicleSpecMutation,
//   useUpdateVehicleSpecMutation,
//   useDeleteVehicleSpecMutation,
//   // Vehicles
//   useGetVehiclesQuery,
//   useGetVehicleByIdQuery,
//   useAddVehicleMutation,
//   useUpdateVehicleMutation,
//   useDeleteVehicleMutation,
//   useUpdateVehicleStatusMutation,
//   useGetAvailableVehiclesQuery,
// } = vehicleApi;
