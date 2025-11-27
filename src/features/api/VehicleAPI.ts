// features/api/VehicleAPI.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface VehicleSpecification {
  vehicleSpec_id: number;
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: string;
  engine_capacity: string;
  transmission: string;
  seating_capacity: number;
  color: string;
  features: string;
  images: string;
  on_promo: boolean;
  review_count: number;
  vehicle_type: string;
  fuel_efficiency: string;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  insurance_group: string;
}

export interface Vehicle {
  vehicle_id: number;
  vehicleSpec_id: number;
  vin_number: string;
  license_plate: string;
  current_mileage: number;
  rental_rate: number;
  status: 'Available' | 'Rented' | 'Maintenance' | 'Unavailable' | 'Banned';
  created_at: string;
  updated_at: string;
}

export interface VehicleWithSpecs extends Vehicle {
  manufacturer: string;
  model: string;
  year: number;
  fuel_type: string;
  transmission: string;
  seating_capacity: number;
  color: string;
  features: string;
  images: string;
  on_promo: boolean;
  vehicle_type: string;
  fuel_efficiency: string;
  daily_rate: number;
  weekly_rate: number;
  monthly_rate: number;
  insurance_group: string;
}

export type GetVehiclesParams = {
  status?: string;
  available?: boolean;
  page?: number;
  limit?: number;
  search?: string;
  vehicle_type?: string;
};

export const vehicleApi = createApi({
  reducerPath: 'vehicleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/api/vehicles',
    // prepareHeaders: (headers) => {
    //   const token = localStorage.getItem('token');
    //   if (token) {
    //     headers.set('authorization', `Bearer ${token}`);
    //   }
    //   headers.set('Content-Type', 'application/json');
    //   return headers;
    // },

prepareHeaders: (headers) => {
  const token = localStorage.getItem('token');  
  if (token) {
    headers.set('authorization', `Bearer ${token}`);
  }
  return headers;
},




  }),
  tagTypes: ['Vehicle'],

  endpoints: (builder) => ({
    // All vehicles with optional filters
    getVehicles: builder.query<VehicleWithSpecs[], GetVehiclesParams>({
      query: (params = {}) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value != null && value !== '') {
            searchParams.append(key, String(value));
          }
        });
        const qs = searchParams.toString();
        return qs ? `?${qs}` : '';
      },
      // Fixed: safe providesTags that never throws
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ vehicle_id }) => ({ type: 'Vehicle' as const, id: vehicle_id })),
              { type: 'Vehicle', id: 'LIST' },
            ]
          : [{ type: 'Vehicle', id: 'LIST' }],
    }),

    // // Only available vehicles
    // getAvailableVehicles: builder.query<VehicleWithSpecs[], void>({
    //   query: () => '/available',
    //   // Fixed: same safe pattern
    //   providesTags: (result) =>
    //     result
    //       ? [
    //           ...result.map(({ vehicle_id }) => ({ type: 'Vehicle' as const, id: vehicle_id })),
    //           { type: 'Vehicle', id: 'AVAILABLE' },
    //         ]
    //       : [{ type: 'Vehicle', id: 'AVAILABLE' }],
    // }),
    // In VehicleAPI.ts — fix getAvailableVehicles and getVehicles
getAvailableVehicles: builder.query<VehicleWithSpecs[], void>({
  query: () => '/available',
  transformResponse: (response: any) => {
    // Handle common backend patterns
    if (Array.isArray(response)) return response;
    if (response?.data && Array.isArray(response.data)) return response.data;
    if (response?.vehicles && Array.isArray(response.vehicles)) return response.vehicles;
    return []; // fallback
  },
  providesTags: (result) => {
    // ensure the array accepts both numeric ids and the 'AVAILABLE' sentinel
    const tags: ({ type: 'Vehicle'; id: number | 'AVAILABLE' })[] = (result ?? []).map(
      ({ vehicle_id }) => ({ type: 'Vehicle' as const, id: vehicle_id })
    );
    tags.push({ type: 'Vehicle' as const, id: 'AVAILABLE' });
    return tags;
  },
}),

    getVehicleById: builder.query<VehicleWithSpecs, number>({
      query: (id) => `/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Vehicle', id }],
    }),

    addVehicle: builder.mutation<Vehicle, Partial<Vehicle> & Pick<Vehicle, 'vehicleSpec_id'>>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Vehicle', id: 'LIST' }, { type: 'Vehicle', id: 'AVAILABLE' }],
    }),

    updateVehicle: builder.mutation<Vehicle, { id: number; updates: Partial<Vehicle> }>({
      query: ({ id, updates }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Vehicle', id },
        { type: 'Vehicle', id: 'LIST' },
        { type: 'Vehicle', id: 'AVAILABLE' },
      ],
    }),

    deleteVehicle: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Vehicle', id },
        { type: 'Vehicle', id: 'LIST' },
        { type: 'Vehicle', id: 'AVAILABLE' },
      ],
    }),
  }),
});

export const {
  useGetVehiclesQuery,
  useGetAvailableVehiclesQuery,
  useGetVehicleByIdQuery,
  useAddVehicleMutation,
  useUpdateVehicleMutation,
  useDeleteVehicleMutation,
} = vehicleApi;



// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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
//   transmission: string;
//   seating_capacity: number;
//   color: string;
//   features: string;
//   images: string;
//   on_promo: boolean;
//   vehicle_type: string;
//   fuel_efficiency: string;
//   daily_rate: number;
//   weekly_rate: number;
//   monthly_rate: number;
//     insurance_group: string;
// }

// export const VehicleApi = createApi({
//   reducerPath: 'vehicleApi',
//   baseQuery: fetchBaseQuery({
//     baseUrl: 'http://localhost:3000/api/vehicles',
//     prepareHeaders: (headers) => {
//       const token = localStorage.getItem('token');
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       headers.set('Content-Type', 'application/json');
//       return headers;
//     },
//   }),
//   tagTypes: ['Vehicle'],
//   endpoints: (builder) => ({
//     // Get all vehicles with optional filters
//     getVehicles: builder.query<VehicleWithSpecs[], { 
//       status?: string; 
//       available?: boolean;
//       page?: number;
//       limit?: number;
//     }>({
//       query: (filters = {}) => {
//         const params = new URLSearchParams();
//         Object.entries(filters).forEach(([key, value]) => {
//           if (value !== undefined && value !== null) {
//             params.append(key, value.toString());
//           }
//         });
//         return `?${params.toString()}`;
//       },
//       providesTags: ['Vehicle'],
//     }),

//     // Get available vehicles only
//     getAvailableVehicles: builder.query<VehicleWithSpecs[], void>({
//       query: () => '/available',
//       providesTags: ['Vehicle'],
//     }),

//     // Get vehicle by ID
//     getVehicleById: builder.query<VehicleWithSpecs, number>({
//       query: (id) => `/${id}`,
//       providesTags: ['Vehicle'],
//     }),

//     // Add new vehicle
//     addVehicle: builder.mutation<Vehicle, Partial<Vehicle>>({
//       query: (vehicle) => ({
//         url: '',
//         method: 'POST',
//         body: vehicle,
//       }),
//       invalidatesTags: ['Vehicle'],
//     }),

//     // Update vehicle
//     updateVehicle: builder.mutation<Vehicle, { id: number; updates: Partial<Vehicle> }>({
//       query: ({ id, updates }) => ({
//         url: `/${id}`,
//         method: 'PUT',
//         body: updates,
//       }),
//       invalidatesTags: ['Vehicle'],
//     }),

//     // Delete vehicle
//     deleteVehicle: builder.mutation<void, number>({
//       query: (id) => ({
//         url: `/${id}`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Vehicle'],
//     }),
//   }),
// });

// export const {
//   useGetVehiclesQuery,
//   useGetAvailableVehiclesQuery,
//   useGetVehicleByIdQuery,
//   useAddVehicleMutation,
//   useUpdateVehicleMutation,
//   useDeleteVehicleMutation,
// } = VehicleApi;

