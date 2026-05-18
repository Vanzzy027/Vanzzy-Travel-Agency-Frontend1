import { createApi } from "@reduxjs/toolkit/query/react";
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
