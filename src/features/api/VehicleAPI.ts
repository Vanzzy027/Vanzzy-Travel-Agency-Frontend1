import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuery";

// Vehicle Interfaces
export interface VehicleSpec {
  vehicleSpec_id: number;
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: string;
  engine_capacity?: string;
  transmission: string;
  seating_capacity: number;
  color: string;
  features?: string;
  images?: string;
  vehicle_type: string;
  fuel_efficiency?: string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  insurance_group?: string;
  on_promo: boolean;
  promo_rate?: number;
  promo_start_date?: string;
  promo_end_date?: string;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  vehicle_id: number;
  vehicleSpec_id: number;
  vin_number: string;
  license_plate: string;
  current_mileage: number;
  rental_rate: number;
  status: "Available" | "Rented" | "Maintenance" | "Unavailable";
  created_at: string;
  updated_at: string;
  // Joined fields from VehicleSpec
  manufacturer?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  engine_capacity?: string;
  transmission?: string;
  seating_capacity?: number;
  color?: string;
  features?: string;
  images?: string;
  vehicle_type?: string;
  fuel_efficiency?: string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  insurance_group?: string;
  on_promo?: boolean;
  promo_rate?: number;
  promo_start_date?: string;
  promo_end_date?: string;
}

// Request Interfaces
export interface CreateVehicleSpecRequest {
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: string;
  engine_capacity?: string;
  transmission: string;
  seating_capacity: number;
  color: string;
  vehicle_type: string;
  features?: string;
  images?: string;
  fuel_efficiency?: string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  insurance_group?: string;
  on_promo?: boolean;
  promo_rate?: number;
  promo_start_date?: string;
  promo_end_date?: string;
}

export interface VehicleWithSpecs {
  vehicle_id: number;
  vehicleSpec_id: number;
  vin_number: string;
  license_plate: string;
  current_mileage: number;
  rental_rate: number;
  status: string;
  created_at: string;
  updated_at: string;
  // Add specification as nested object
  specification?: {
    manufacturer: string;
    model: string;
    year: number;
    fuel_type: string;
    engine_capacity: string;
    transmission: string;
    avg_rating?: number;
    seating_capacity: number;
    color: string;
    features: string;
    images: string;
    on_promo: boolean;
    promo_rate: number;
    promo_start_date: string;
    promo_end_date: string;
    review_count: number;
    vehicle_type: string;
    fuel_efficiency: string;
    daily_rate: number;
    weekly_rate: number;
    monthly_rate: number;
    insurance_group: string;
  };
  // OR flatten the properties (recommended):
  manufacturer?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  engine_capacity?: string;
  transmission?: string;
  seating_capacity?: number;
  color?: string;
  features?: string;
  images?: string;
  on_promo?: boolean;
  promo_rate?: number;
  promo_start_date?: string;
  promo_end_date?: string;
  review_count?: number;
  vehicle_type?: string;
  fuel_efficiency?: string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  insurance_group?: string;
}

export interface UpdateVehicleSpecRequest {
  manufacturer?: string;
  model?: string;
  year?: number;
  fuel_type?: string;
  engine_capacity?: string;
  transmission?: string;
  seating_capacity?: number;
  color?: string;
  vehicle_type?: string;
  features?: string;
  images?: string;
  fuel_efficiency?: string;
  daily_rate?: number;
  weekly_rate?: number;
  monthly_rate?: number;
  insurance_group?: string;
  on_promo?: boolean;
  promo_rate?: number;
  promo_start_date?: string;
  promo_end_date?: string;
}

export interface CreateVehicleRequest {
  vehicleSpec_id: number;
  vin_number: string;
  license_plate: string;
  current_mileage: number;
  rental_rate: number;
  status: "Available" | "Rented" | "Maintenance" | "Unavailable";
}

export interface UpdateVehicleRequest {
  vin_number?: string;
  license_plate?: string;
  current_mileage?: number;
  rental_rate?: number;
  status?: "Available" | "Rented" | "Maintenance" | "Unavailable";
}

// API Definition
export const vehicleApi = createApi({
  reducerPath: "vehicleApi",

  // ✅ Using your custom base query!
  baseQuery: baseQueryWithReauth,

  tagTypes: ["Vehicle", "VehicleSpec"],
  endpoints: (builder) => ({
    // --- VEHICLE SPECS ENDPOINTS ---

    getVehicleSpecs: builder.query<VehicleSpec[], void>({
      query: () => "vehicle-specs", // Removed leading slash
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicleSpec_id }) => ({
                type: "VehicleSpec" as const,
                id: vehicleSpec_id,
              })),
              { type: "VehicleSpec", id: "LIST" },
            ]
          : [{ type: "VehicleSpec", id: "LIST" }],
    }),

    getVehicleSpecById: builder.query<VehicleSpec, number>({
      query: (id) => `vehicle-specs/${id}`, // Removed leading slash
      providesTags: (_result, _error, id) => [{ type: "VehicleSpec", id }],
    }),

    createVehicleSpec: builder.mutation<VehicleSpec, CreateVehicleSpecRequest>({
      query: (body) => ({
        url: "vehicle-specs", // Removed leading slash
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "VehicleSpec", id: "LIST" }],
    }),

    updateVehicleSpec: builder.mutation<
      VehicleSpec,
      { id: number; data: UpdateVehicleSpecRequest }
    >({
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

    deleteVehicleSpec: builder.mutation<void, number>({
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

    getAvailableVehicles: builder.query<VehicleWithSpecs[], void>({
      query: () => "vehicles/available", // Removed leading slash
      transformResponse: (response: any) => {
        if (Array.isArray(response)) return response;
        if (response?.data && Array.isArray(response.data))
          return response.data;
        if (response?.vehicles && Array.isArray(response.vehicles))
          return response.vehicles;
        return [];
      },
      providesTags: (result) => {
        const tags: { type: "Vehicle"; id: number | "AVAILABLE" }[] = (
          result ?? []
        ).map(({ vehicle_id }) => ({
          type: "Vehicle" as const,
          id: vehicle_id,
        }));
        tags.push({ type: "Vehicle" as const, id: "AVAILABLE" });
        return tags;
      },
    }),

    getVehicles: builder.query<Vehicle[], void>({
      query: () => "vehicles", // Removed leading slash
      transformResponse: (response: any) => {
        const rawData = Array.isArray(response)
          ? response
          : response?.data || [];
        return rawData.map((vehicle: any) => ({
          ...vehicle, // Using spread operator to keep it clean (assuming mapping is 1:1)
        }));
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicle_id }) => ({
                type: "Vehicle" as const,
                id: vehicle_id,
              })),
              { type: "Vehicle", id: "LIST" },
            ]
          : [{ type: "Vehicle", id: "LIST" }],
    }),

    getVehicleById: builder.query<Vehicle, number>({
      query: (id) => `vehicles/${id}`, // Removed leading slash
      providesTags: (_result, _error, id) => [{ type: "Vehicle", id }],
    }),

    addVehicle: builder.mutation<Vehicle, CreateVehicleRequest>({
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

    updateVehicle: builder.mutation<
      Vehicle,
      { id: number; data: UpdateVehicleRequest }
    >({
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

    deleteVehicle: builder.mutation<void, number>({
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

    updateVehicleStatus: builder.mutation<
      Vehicle,
      { id: number; status: string }
    >({
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

export const {
  useGetVehicleSpecsQuery,
  useGetVehicleSpecByIdQuery,
  useCreateVehicleSpecMutation,
  useUpdateVehicleSpecMutation,
  useDeleteVehicleSpecMutation,
  useGetVehiclesQuery,
  useGetVehicleByIdQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
  useUpdateVehicleStatusMutation,
  useGetAvailableVehiclesQuery,
} = vehicleApi;
