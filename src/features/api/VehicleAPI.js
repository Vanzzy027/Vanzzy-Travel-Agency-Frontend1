import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// API Definition
export const vehicleApi = createApi({
    reducerPath: 'vehicleApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://vanske-car-rental.azurewebsites.net/api',
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
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// // INTERFACES & TYPES
// export interface VehicleSpecification {
//   vehicleSpec_id: number;
//   manufacturer: string;
//   model: string;
//   year: number;
//   fuel_type: string;
//   engine_capacity: string;
//   transmission: string;
//   seating_capacity: number;
//   color: string;
//   features: string; // JSON string
//   images: string;   // JSON string
//   on_promo: boolean;
//   review_count: number;
//   vehicle_type: string; // Ensure this matches your DB
//   fuel_efficiency: string;
//   daily_rate: number;
//   weekly_rate: number;
//   monthly_rate: number;
//   insurance_group: string;
// }
// export interface Vehicle {
//   vehicle_id: number;
//   vehicleSpec_id: number;
//   vin_number: string;
//   license_plate: string;
//   current_mileage: number;
//   rental_rate: number;
//   status: 'Available' | 'Rented' | 'Maintenance' | 'Unavailable' | 'Banned';
//   created_at: string;
//   updated_at: string;
// }
// export interface VehicleWithSpecs extends Vehicle {
//   manufacturer: string;
//   model: string;
//   year: number;
//   fuel_type: string;
//   engine_capacity: string;
//   transmission: string;
//   seating_capacity: number;
//   color: string;
//   features: string;
//   images: string;
//   on_promo: boolean;
//   review_count: number;
//   vehicle_type: string;
//   fuel_efficiency: string;
//   daily_rate: number;
//   weekly_rate: number;
//   monthly_rate: number;
//   insurance_group: string;
// }
// export type GetVehiclesParams = {
//   status?: string;
//   available?: boolean;
//   page?: number;
//   limit?: number;
//   search?: string;
//   vehicle_type?: string;
// };
// // ==========================================
// // 2. API DEFINITION
// // ==========================================
// export const vehicleApi = createApi({
//   reducerPath: 'vehicleApi',
//   baseQuery: fetchBaseQuery({
//     // Preserving your original base URL
//     baseUrl: 'http://localhost:3000/api/',
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token');  
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   // Added 'VehicleSpec' tag to handle the new separation of concerns
//   tagTypes: ['Vehicle', 'VehicleSpec'],
//   endpoints: (builder) => ({
//     // GET: All Vehicles with Filters
//     getVehicles: builder.query<VehicleWithSpecs[], GetVehiclesParams>({
//       query: (params = {}) => {
//         const searchParams = new URLSearchParams();
//         Object.entries(params).forEach(([key, value]) => {
//           if (value != null && value !== '') {
//             searchParams.append(key, String(value));
//           }
//         });
//         const qs = searchParams.toString();
//         return qs ? `?${qs}` : '/vehicles';},
//       // ✅ FIX 1: Normalize the response to ensure it's always an Array
//       transformResponse: (response: any) => {
//         if (Array.isArray(response)) return response;
//         if (response?.data && Array.isArray(response.data)) return response.data;
//         // If backend returns empty or weird structure, return empty array to prevent crash
//         return []; },
//       // ✅ FIX 2: Check if 'result' is actually an array before mapping
//       providesTags: (result) =>
//         Array.isArray(result)
//           ? [
//               ...result.map(({ vehicle_id }) => ({ type: 'Vehicle' as const, id: vehicle_id })),
//               { type: 'Vehicle', id: 'LIST' },
//             ]
//           : [{ type: 'Vehicle', id: 'LIST' }],
//     }),
//     // GET: Available Vehicles Only
//     getAvailableVehicles: builder.query<VehicleWithSpecs[], void>({
//       query: () => '/vehicles/available',
//       transformResponse: (response: any) => {
//         // Preserving your robust response parsing
//         if (Array.isArray(response)) return response;
//         if (response?.data && Array.isArray(response.data)) return response.data;
//         if (response?.vehicles && Array.isArray(response.vehicles)) return response.vehicles;
//         return []; // fallback
//       },
//       providesTags: (result) => {
//         const tags: ({ type: 'Vehicle'; id: number | 'AVAILABLE' })[] = (result ?? []).map(
//           ({ vehicle_id }) => ({ type: 'Vehicle' as const, id: vehicle_id })
//         );
//         tags.push({ type: 'Vehicle' as const, id: 'AVAILABLE' });
//         return tags;
//       },
//     }),
//     // GET: Single Vehicle by ID
//     getVehicleById: builder.query<VehicleWithSpecs, number>({
//       query: (id) => `/vehicles/${id}`,
//       transformResponse: (response: { data: VehicleWithSpecs } | any) => {
//         if (response?.data) {
//           return response.data;
//         }
//         return response;
//       },
//       providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
//     }),
//     // POST: Create Vehicle Specification (Step 1)
//     // This is the NEW endpoint required for your Wizard Form
//     createVehicleSpec: builder.mutation<VehicleSpecification, Partial<VehicleSpecification>>({
//       query: (body) => ({
//         url: '/vehicle-specs', // Assumes your backend route is POST /api/vehicles/specs
//         method: 'POST',
//         body,
//       }),
//       // We don't invalidate 'LIST' yet because a spec without a vehicle 
//       // might not show up in your main vehicle table
//       invalidatesTags: [],
//     }),
//     // POST: Create Vehicle Inventory (Step 2)
//     addVehicle: builder.mutation<Vehicle, Partial<Vehicle> & Pick<Vehicle, 'vehicleSpec_id'>>({
//       query: (body) => ({
//         url: '/vehicles', // POST to base URL (/api/vehicles)
//         method: 'POST',
//         body,
//       }),
//       invalidatesTags: [
//         { type: 'Vehicle', id: 'LIST' }, 
//         { type: 'Vehicle', id: 'AVAILABLE' }
//       ],
//     }),
//     // PUT: Update Vehicle
//     updateVehicle: builder.mutation<Vehicle, { id: number; updates: Partial<Vehicle> }>({
//       query: ({ id, updates }) => ({
//         url: `/vehicles/${id}`,
//         method: 'PUT',
//         body: updates,
//       }),
//       invalidatesTags: (_result, _error, { id }) => [
//         { type: 'Vehicle', id },
//         { type: 'Vehicle', id: 'LIST' },
//         { type: 'Vehicle', id: 'AVAILABLE' },
//       ],
//     }),
//     // DELETE: Remove Vehicle
//     deleteVehicle: builder.mutation<void, number>({
//       query: (id) => ({
//         url: `/vehicles/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: (_result, _error, id) => [
//         { type: 'Vehicle', id },
//         { type: 'Vehicle', id: 'LIST' },
//         { type: 'Vehicle', id: 'AVAILABLE' },
//       ],
//     }),
//   }),
// });
// // ==========================================
// // 3. EXPORTS
// // ==========================================
// export const {
//   useGetVehiclesQuery,
//   useGetAvailableVehiclesQuery,
//   useGetVehicleByIdQuery,
//   useCreateVehicleSpecMutation, // Exporting the new mutation
//   useAddVehicleMutation,
//   useUpdateVehicleMutation,
//   useDeleteVehicleMutation,
// } = vehicleApi;
