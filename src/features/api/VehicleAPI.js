import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
//Constant API URL
const API_BASE_URL = import.meta.env.VITE_API_URL;
// API Definition
export const vehicleApi = createApi({
    reducerPath: 'vehicleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/api`,
        prepareHeaders: (headers) => {
            const token = localStorage.getItem('token');
            if (token) {
                const cleanToken = token.replace(/"/g, '');
                headers.set('authorization', `Bearer ${cleanToken}`);
                // headers.set('Authorization', `Bearer ${token}`);
            }
            //headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Vehicle', 'VehicleSpec'],
    endpoints: (builder) => ({
        // --- VEHICLE SPECS ENDPOINTS ---
        // Get all vehicle specifications
        getVehicleSpecs: builder.query({
            query: () => '/vehicle-specs',
            providesTags: (result) => result
                ? [
                    ...result.map(({ vehicleSpec_id }) => ({ type: 'VehicleSpec', id: vehicleSpec_id })),
                    { type: 'VehicleSpec', id: 'LIST' }
                ]
                : [{ type: 'VehicleSpec', id: 'LIST' }],
        }),
        // Get vehicle spec by ID
        getVehicleSpecById: builder.query({
            query: (id) => `/vehicle-specs/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'VehicleSpec', id }],
        }),
        // Create vehicle specification
        createVehicleSpec: builder.mutation({
            query: (body) => ({
                url: '/vehicle-specs',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'VehicleSpec', id: 'LIST' }],
        }),
        // Update vehicle specification
        updateVehicleSpec: builder.mutation({
            query: ({ id, data }) => ({
                url: `/vehicle-specs/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'VehicleSpec', id },
                { type: 'VehicleSpec', id: 'LIST' }
            ],
        }),
        // Delete vehicle specification
        deleteVehicleSpec: builder.mutation({
            query: (id) => ({
                url: `/vehicle-specs/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'VehicleSpec', id },
                { type: 'VehicleSpec', id: 'LIST' },
                { type: 'Vehicle', id: 'LIST' } // Invalidate vehicles too since they might be affected
            ],
        }),
        // --- VEHICLE ENDPOINTS ---
        //     // GET: Available Vehicles Only
        getAvailableVehicles: builder.query({
            query: () => '/vehicles/available',
            transformResponse: (response) => {
                // Preserving your robust response parsing
                if (Array.isArray(response))
                    return response;
                if (response?.data && Array.isArray(response.data))
                    return response.data;
                if (response?.vehicles && Array.isArray(response.vehicles))
                    return response.vehicles;
                return []; // fallback
            },
            providesTags: (result) => {
                const tags = (result ?? []).map(({ vehicle_id }) => ({ type: 'Vehicle', id: vehicle_id }));
                tags.push({ type: 'Vehicle', id: 'AVAILABLE' });
                return tags;
            },
        }),
        // Get all vehicles with specs
        getVehicles: builder.query({
            query: () => '/vehicles',
            transformResponse: (response) => {
                const rawData = Array.isArray(response) ? response : (response?.data || []);
                return rawData.map((vehicle) => ({
                    vehicle_id: vehicle.vehicle_id,
                    vehicleSpec_id: vehicle.vehicleSpec_id,
                    vin_number: vehicle.vin_number,
                    license_plate: vehicle.license_plate,
                    current_mileage: vehicle.current_mileage,
                    rental_rate: vehicle.rental_rate,
                    status: vehicle.status,
                    created_at: vehicle.created_at,
                    updated_at: vehicle.updated_at,
                    // Include spec fields
                    manufacturer: vehicle.manufacturer,
                    model: vehicle.model,
                    year: vehicle.year,
                    fuel_type: vehicle.fuel_type,
                    engine_capacity: vehicle.engine_capacity,
                    transmission: vehicle.transmission,
                    seating_capacity: vehicle.seating_capacity,
                    color: vehicle.color,
                    features: vehicle.features,
                    images: vehicle.images,
                    vehicle_type: vehicle.vehicle_type,
                    fuel_efficiency: vehicle.fuel_efficiency,
                    daily_rate: vehicle.daily_rate,
                    weekly_rate: vehicle.weekly_rate,
                    monthly_rate: vehicle.monthly_rate,
                    insurance_group: vehicle.insurance_group,
                    on_promo: vehicle.on_promo,
                    promo_rate: vehicle.promo_rate,
                    promo_start_date: vehicle.promo_start_date,
                    promo_end_date: vehicle.promo_end_date,
                }));
            },
            providesTags: (result) => result
                ? [
                    ...result.map(({ vehicle_id }) => ({ type: 'Vehicle', id: vehicle_id })),
                    { type: 'Vehicle', id: 'LIST' }
                ]
                : [{ type: 'Vehicle', id: 'LIST' }],
        }),
        // Get vehicle by ID
        getVehicleById: builder.query({
            query: (id) => `/vehicles/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
        }),
        // Create vehicle
        addVehicle: builder.mutation({
            query: (body) => ({
                url: '/vehicles',
                method: 'POST',
                body,
            }),
            invalidatesTags: [{ type: 'Vehicle', id: 'LIST' }],
        }),
        // Update vehicle
        updateVehicle: builder.mutation({
            query: ({ id, data }) => ({
                url: `/vehicles/${id}`,
                method: 'PUT',
                body: data,
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Vehicle', id },
                { type: 'Vehicle', id: 'LIST' }
            ],
        }),
        // Delete vehicle
        deleteVehicle: builder.mutation({
            query: (id) => ({
                url: `/vehicles/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Vehicle', id },
                { type: 'Vehicle', id: 'LIST' }
            ],
        }),
        // Update vehicle status only
        updateVehicleStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/vehicles/${id}/status`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: (_result, _error, { id }) => [
                { type: 'Vehicle', id },
                { type: 'Vehicle', id: 'LIST' }
            ],
        }),
    }),
});
// Export hooks
export const { 
// Vehicle Specs
useGetVehicleSpecsQuery, useGetVehicleSpecByIdQuery, useCreateVehicleSpecMutation, useUpdateVehicleSpecMutation, useDeleteVehicleSpecMutation, 
// Vehicles
useGetVehiclesQuery, useGetVehicleByIdQuery, useAddVehicleMutation, useUpdateVehicleMutation, useDeleteVehicleMutation, useUpdateVehicleStatusMutation, useGetAvailableVehiclesQuery, } = vehicleApi;
