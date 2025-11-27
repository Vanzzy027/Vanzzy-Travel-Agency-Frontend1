// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// export interface User {
//   user_id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string | null;
//   user_type: 'admin' | 'user' | 'RestaurantOwner' | 'superAdmin'; 
//   status: 'active' | 'inactive' | 'banned';
//   profile_image: string | null;
//   cover_image: string | null;
//   is_online: boolean;
//   last_seen_at: string | null;
//   meals_available: boolean;
//   created_at: string;
//   updated_at: string | null;
// }


// export interface Restaurant {
//   restaurant_id: number;
//   restaurant_owner_id: number;
//   name: string;
//   description: string | null;
//   address: string;
//   city: string;
//   phone_number: string | null;
//   email: string | null;
//   opening_time: string | null;
//   closing_time: string | null;
//   cuisine_type: string | null;
//   restaurant_image: string | null;
//   cover_image: string | null;
//   is_active: boolean;
//   created_at: string;
//   owner_name?: string; 
//   total_orders?: number;
// }

// export interface Category {
//   category_id: number;
//   restaurant_id: number;
//   name: string;
//   description: string | null;
//   image_url: string | null;
//   is_active: boolean;
//   created_at: string;
//   restaurant_name?: string;
// }

// export interface MenuItem {
//   menu_item_id: number;
//   restaurant_id: number;
//   category_id: number;
//   name: string;
//   description: string | null;
//   price: number;
//   image_url: string | null;
//   is_available: boolean;
//   created_at: string;
//   restaurant_name?: string;
//   category_name?: string;
// }

// export interface Order {
//   order_id: number;
//   restaurant_id: number;
//   customer_id: number;
//   order_type: 'Delivery' | 'Pickup';
//   status: 'Pending' | 'Processing' | 'Delivered' | 'Completed' | 'Cancelled';
//   total_amount: number;
//   created_at: string;
//   restaurant_name?: string;
//   customer_name?: string;
//   items?: OrderItem[];
// }

// export interface OrderItem {
//   order_item_id: number;
//   order_id: number;
//   menu_item_id: number;
//   quantity: number;
//   unit_price: number;
//   total_price: number;
//   created_at: string;
//   menu_item_name?: string;
//   menu_item_image?: string;
// }

// export interface Favorite {
//   favorite_id: number;
//   user_id: number;
//   restaurant_id: number;
//   menu_item_id: number | null;
//   created_at: string;
//   restaurant_name?: string;
//   menu_item_name?: string;
//   menu_item_price?: number;
//   menu_item_image?: string;
// }

// export interface Review {
//   review_id: number;
//   user_id: number;
//   restaurant_id: number;
//   menu_item_id: number | null;
//   order_id: number;
//   rating: number;
//   comment: string | null;
//   created_at: string;
//   user_name?: string;
//   restaurant_name?: string;
//   menu_item_name?: string;
// }


// export interface CartItem {
//     cart_item_id?: number;
//     menu_item_id: number;
//     name: string;
//     price: number;
//     quantity: number;
//     image_url?: string;
//     restaurant_id: number;
//     restaurant_name: string;
// }

// export interface Cart {
//     cart_id: number;
//     user_id: number;
//     cart_items: CartItem[];
// }

// export interface OrderItem {
//     menu_item_id: number;
//     quantity: number;
//     price: number;
//     name: string;
// }




// export interface UpdateProfileRequest {
//   first_name?: string;
//   last_name?: string;
//   phone_number?: string;
//   profile_image?: string;
//   cover_image?: string;
// }

// export interface AddFavoriteRequest {
//   restaurant_id: number;
//   menu_item_id?: number;
// }

// export interface CreateReviewRequest {
//   restaurant_id: number;
//   menu_item_id?: number;
//   order_id: number;
//   rating: number;
//   comment?: string;
// }

// export interface AdminStats {
//   totalOrders: number;
//   totalRevenue: number;
//   totalCustomers: number;
//   totalMenuItems: number;
//   totalRestaurants: number;
//   pendingOrders: number;
// }

// export interface Customer {
//   user_id: number;
//   first_name: string;
//   last_name: string;
//   email: string;
//   phone_number: string | null;
//   status: string;
//   created_at: string;
//   total_orders?: number;
//   total_spent?: number;
// }


// export interface DashboardStats { 
//   totalOrders: number;
//   totalRevenue: number; 
//   totalCustomers: number; 
//   totalMenuItems: number; 
//   favorite_items_count?: number
//   total_spent?: number
//   loyalty_points?: number

//   // possible alternative names from backend:
//   orders?: number
//   favorites?: number
//   spent?: number
//   points?: number

//   // allow other keys
//   [key: string]: any
// };




// const transformResponse = <T>(response: any): T => response.data;


// // User API

// export const UserApi = createApi({
//     reducerPath: 'userApi',
//     baseQuery: fetchBaseQuery({ 
//         baseUrl: 'http://localhost:3000/api',
//         prepareHeaders: (headers, { getState }) => {
//             const token = (getState() as any).authSlice?.token;
//             if (token) {
//                 headers.set('Authorization', `Bearer ${token}`);
//             }
//             return headers;
//         },
//     }),
//     tagTypes: [
//         'User', 
//         'Orders', 
//         'Profile', 
//         'Favorites', 
//         'Restaurants', 
//         'MenuItems',
//         'Reviews',
//         'UserStats',
//         'RecentOrders',
//         'Cart'  
//     ],
//     endpoints: (builder) => ({
        
//         //  USER PROFILE 
//         getUserProfile: builder.query<User, void>({
//             query: () => '/user/profile',
//             providesTags: ['Profile'],
//             transformResponse,
//         }),

//         updateUserProfile: builder.mutation<User, UpdateProfileRequest>({
//             query: (profileData) => ({
//                 url: '/user/profile',
//                 method: 'PUT',
//                 body: profileData,
//             }),
//             invalidatesTags: ['Profile'],
//             transformResponse,
//         }),
        
//         //  USER DASHBOARD 
//         getUserStats: builder.query<DashboardStats, void>({
//             query: () => '/user/stats',
//             providesTags: ['UserStats'],
//             transformResponse,
//         }),
        
//         getRecentOrders: builder.query<RecentOrder[], { limit?: number }>({
//             query: ({ limit = 5 }) => `/user/orders/recent?limit=${limit}`,
//             providesTags: ['RecentOrders'],
//             transformResponse: (response: any) => transformResponse<RecentOrder[]>(response) || [],
//         }),

//         //  ORDERS 
//         getUserOrders: builder.query<Order[], void>({
//             query: () => '/user/orders',
//             providesTags: ['Orders'],
//             transformResponse: (response: any) => transformResponse<Order[]>(response) || [],
//         }),

//         getOrderDetails: builder.query<Order, number>({
//             query: (orderId) => `/user/orders/${orderId}`,
//             providesTags: (result, error, orderId) => [{ type: 'Orders', id: orderId }],
//             transformResponse,
//         }),

//         createOrder: builder.mutation<Order, {
//             restaurant_id: number;
//             order_type: 'Delivery' | 'Pickup';
//             items: Array<{ menu_item_id: number; quantity: number }>;
//         }>({
//             query: (orderData) => ({
//                 url: '/user/orders',
//                 method: 'POST',
//                 body: orderData,
//             }),
//             invalidatesTags: ['Orders'],
//             transformResponse,
//         }),

//         cancelOrder: builder.mutation<void, number>({
//             query: (orderId) => ({
//                 url: `/user/orders/${orderId}/cancel`,
//                 method: 'PUT',
//             }),
//             invalidatesTags: ['Orders'],
//         }),

//         //  FAVORITES 
//         getFavorites: builder.query<Favorite[], void>({
//             query: () => '/user/favorites',
//             providesTags: ['Favorites'],
//             transformResponse: (response: any) => transformResponse<Favorite[]>(response) || [],
//         }),

//         addToFavorites: builder.mutation<Favorite, AddFavoriteRequest>({
//             query: (favoriteData) => ({
//                 url: '/user/favorites',
//                 method: 'POST',
//                 body: favoriteData,
//             }),
//             invalidatesTags: ['Favorites'],
//             transformResponse,
//         }),

//         removeFromFavorites: builder.mutation<void, number>({
//             query: (favoriteId) => ({
//                 url: `/user/favorites/${favoriteId}`,
//                 method: 'DELETE',
//             }),
//             invalidatesTags: ['Favorites'],
//         }),






// getCart: builder.query({
//             query: () => '/cart',
//             providesTags: ['Cart']
//         }),

//         addToCart: builder.mutation({
//             query: (cartItem) => ({
//                 url: '/cart/items',
//                 method: 'POST',
//                 body: cartItem
//             }),
//             invalidatesTags: ['Cart']
//         }),

//         updateCartItem: builder.mutation({
//             query: ({ itemId, quantity }) => ({
//                 url: `/cart/items/${itemId}`,
//                 method: 'PUT',
//                 body: { quantity }
//             }),
//             invalidatesTags: ['Cart']
//         }),

//         removeFromCart: builder.mutation({
//             query: (itemId) => ({
//                 url: `/cart/items/${itemId}`,
//                 method: 'DELETE'
//             }),
//             invalidatesTags: ['Cart']
//         }),
//         clearCart: builder.mutation({
//             query: () => ({
//                 url: '/cart/clear',
//                 method: 'POST'
//             }),
//             invalidatesTags: ['Cart']
//         }),
   




//         //  CART OPERATIONS 
//         // getCart: builder.query<Cart, void>({
//         //     query: () => '/user/cart',
//         //     providesTags: ['Cart'],
//         //     transformResponse,
//         // }),

//         // addToCart: builder.mutation<Cart, CartItem>({
//         //     query: (cartItem) => ({
//         //         url: '/user/cart/items',
//         //         method: 'POST',
//         //         body: cartItem,
//         //     }),
//         //     invalidatesTags: ['Cart'],
//         //     transformResponse,
//         // }),

//         // updateCartItem: builder.mutation<Cart, { itemId: number; quantity: number }>({
//         //     query: ({ itemId, quantity }) => ({
//         //         url: `/user/cart/items/${itemId}`,
//         //         method: 'PUT',
//         //         body: { quantity },
//         //     }),
//         //     invalidatesTags: ['Cart'],
//         //     transformResponse,
//         // }),

//         // removeFromCart: builder.mutation<Cart, number>({
//         //     query: (itemId) => ({
//         //         url: `/user/cart/items/${itemId}`,
//         //         method: 'DELETE',
//         //     }),
//         //     invalidatesTags: ['Cart'],
//         //     transformResponse,
//         // }),

//         // clearCart: builder.mutation<void, void>({
//         //     query: () => ({
//         //         url: '/user/cart/clear',
//         //         method: 'POST',
//         //     }),
//         //     invalidatesTags: ['Cart'],
//         // }),


















//         //  RESTAURANTS 
//         getRestaurants: builder.query<Restaurant[], { 
//             city?: string; 
//             cuisine_type?: string;
//             search?: string;
//             is_active?: boolean;
//         }>({
//             query: (filters = {}) => {
//                 const params = new URLSearchParams();
//                 if (filters.city) params.append('city', filters.city);
//                 if (filters.cuisine_type) params.append('cuisine_type', filters.cuisine_type);
//                 if (filters.search) params.append('search', filters.search);
//                 if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());
                
//                 return `/restaurants?${params.toString()}`;
//             },
//             providesTags: ['Restaurants'],
//             transformResponse: (response: any) => transformResponse<Restaurant[]>(response) || [],
//         }),

//         getRestaurantDetails: builder.query<Restaurant, number>({
//             query: (restaurantId) => `/restaurants/${restaurantId}`,
//             providesTags: (result, error, restaurantId) => [{ type: 'Restaurants', id: restaurantId }],
//             transformResponse,
//         }),

//         //  MENU ITEMS 
//         getMenuItems: builder.query<MenuItem[], { 
//             restaurant_id?: number; 
//             category_id?: number; 
//             search?: string;
//             is_available?: boolean;
//         }>({
//             query: (filters = {}) => {
//                 const params = new URLSearchParams();
//                 if (filters.restaurant_id) params.append('restaurant_id', filters.restaurant_id.toString());
//                 if (filters.category_id) params.append('category_id', filters.category_id.toString());
//                 if (filters.search) params.append('search', filters.search);
//                 if (filters.is_available !== undefined) params.append('is_available', filters.is_available.toString());
                
//                 return `/menu/items?${params.toString()}`;
//             },
//             providesTags: ['MenuItems'],
//             transformResponse: (response: any) => transformResponse<MenuItem[]>(response) || [],
//         }),

//         getMenuItemDetails: builder.query<MenuItem, number>({
//             query: (menuItemId) => `/menu/items/${menuItemId}`,
//             providesTags: (result, error, menuItemId) => [{ type: 'MenuItems', id: menuItemId }],
//             transformResponse,
//         }),

//         //  CATEGORIES 
//         getCategories: builder.query<Category[], { restaurant_id?: number }>({
//             query: (filters = {}) => {
//                 const params = new URLSearchParams();
//                 if (filters.restaurant_id) params.append('restaurant_id', filters.restaurant_id.toString());
                
//                 return `/categories?${params.toString()}`;
//             },
//             transformResponse: (response: any) => transformResponse<Category[]>(response) || [],
//         }),

//         //  REVIEWS 
//         getUserReviews: builder.query<Review[], void>({
//             query: () => '/user/reviews',
//             providesTags: ['Reviews'],
//             transformResponse: (response: any) => transformResponse<Review[]>(response) || [],
//         }),

//         createReview: builder.mutation<Review, CreateReviewRequest>({
//             query: (reviewData) => ({
//                 url: '/user/reviews',
//                 method: 'POST',
//                 body: reviewData,
//             }),
//             invalidatesTags: ['Reviews'],
//             transformResponse,
//         }),

//         updateReview: builder.mutation<Review, { reviewId: number; data: Partial<CreateReviewRequest> }>({
//             query: ({ reviewId, data }) => ({
//                 url: `/user/reviews/${reviewId}`,
//                 method: 'PUT',
//                 body: data,
//             }),
//             invalidatesTags: ['Reviews'],
//             transformResponse,
//         }),

//         deleteReview: builder.mutation<void, number>({
//             query: (reviewId) => ({
//                 url: `/user/reviews/${reviewId}`,
//                 method: 'DELETE',
//             }),
//             invalidatesTags: ['Reviews'],
//         }),

//         //  SEARCH & FILTER 
//         searchAll: builder.query<{
//             restaurants: Restaurant[];
//             menu_items: MenuItem[];
//             categories: Category[];
//         }, { query: string; city?: string }>({
//             query: (searchParams) => {
//                 const params = new URLSearchParams();
//                 params.append('query', searchParams.query);
//                 if (searchParams.city) params.append('city', searchParams.city);
                
//                 return `/search?${params.toString()}`;
//             },
//             transformResponse,
//         }),
//     }),
// });

// // Admin API
// export const AdminApi = createApi({
//   reducerPath: 'adminApi',
//   baseQuery: fetchBaseQuery({ 
//     baseUrl: 'http://localhost:4000/api/admin',
//     prepareHeaders: (headers, { getState }) => {
//       const token = (getState() as any).authSlice?.token;
//       if (token) {
//         headers.set('Authorization', `Bearer ${token}`);
//       }
//       headers.set('Cache-Control', 'no-cache');
//       headers.set('Pragma', 'no-cache');
//       headers.set('Expires', '0');
//       return headers;
//     },
//   }),
//   tagTypes: ['Stats', 'Customers', 'Restaurants', 'Orders', 'MenuItems'],
//   endpoints: (builder) => ({
//     // Dashboard Stats
//     getAdminStats: builder.query<AdminStats, void>({
//       query: () => '/stats',
//       providesTags: ['Stats'],
//       transformResponse,
//     }),

//     // Customers
//     getAllCustomers: builder.query<Customer[], { 
//       page?: number; 
//       limit?: number;
//       search?: string;
//       status?: string;
//     }>({
//       query: (params = {}) => {
//         const searchParams = new URLSearchParams();
//         if (params.page) searchParams.append('page', params.page.toString());
//         if (params.limit) searchParams.append('limit', params.limit.toString());
//         if (params.search) searchParams.append('search', params.search);
//         if (params.status) searchParams.append('status', params.status);
        
//         return `/customers?${searchParams.toString()}`;
//       },
//       providesTags: ['Customers'],
//       transformResponse: (response: any) => transformResponse<Customer[]>(response) || [],
//     }),

//     // Restaurants
//     getAllRestaurants: builder.query<Restaurant[], { 
//       page?: number; 
//       limit?: number;
//       search?: string;
//       city?: string;
//       is_active?: boolean;
//     }>({
//       query: (params = {}) => {
//         const searchParams = new URLSearchParams();
//         if (params.page) searchParams.append('page', params.page.toString());
//         if (params.limit) searchParams.append('limit', params.limit.toString());
//         if (params.search) searchParams.append('search', params.search);
//         if (params.city) searchParams.append('city', params.city);
//         if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());
        
//         return `/restaurants?${searchParams.toString()}`;
//       },
//       providesTags: ['Restaurants'],
//       transformResponse: (response: any) => transformResponse<Restaurant[]>(response) || [],
//     }),

//     // Orders
//     getAllOrders: builder.query<AdminOrder[], { 
//       page?: number; 
//       limit?: number;
//       status?: string;
//       restaurant_id?: number;
//       start_date?: string;
//       end_date?: string;
//     }>({
//       query: (params = {}) => {
//         const searchParams = new URLSearchParams();
//         if (params.page) searchParams.append('page', params.page.toString());
//         if (params.limit) searchParams.append('limit', params.limit.toString());
//         if (params.status) searchParams.append('status', params.status);
//         if (params.restaurant_id) searchParams.append('restaurant_id', params.restaurant_id.toString());
//         if (params.start_date) searchParams.append('start_date', params.start_date);
//         if (params.end_date) searchParams.append('end_date', params.end_date);
        
//         return `/orders?${searchParams.toString()}`;
//       },
//       providesTags: ['Orders'],
//       transformResponse: (response: any) => transformResponse<AdminOrder[]>(response) || [],
//     }),

//     // Menu Items
//     getAllMenuItems: builder.query<MenuItem[], { 
//       page?: number; 
//       limit?: number;
//       search?: string;
//       restaurant_id?: number;
//       is_available?: boolean;
//     }>({
//       query: (params = {}) => {
//         const searchParams = new URLSearchParams();
//         if (params.page) searchParams.append('page', params.page.toString());
//         if (params.limit) searchParams.append('limit', params.limit.toString());
//         if (params.search) searchParams.append('search', params.search);
//         if (params.restaurant_id) searchParams.append('restaurant_id', params.restaurant_id.toString());
//         if (params.is_available !== undefined) searchParams.append('is_available', params.is_available.toString());
        
//         return `/menu-items?${searchParams.toString()}`;
//       },
//       providesTags: ['MenuItems'],
//       transformResponse: (response: any) => transformResponse<MenuItem[]>(response) || [],
//     }),

//     // Update Order Status
//     updateOrderStatus: builder.mutation<void, { orderId: number; status: string }>({
//       query: ({ orderId, status }) => ({
//         url: `/orders/${orderId}/status`,
//         method: 'PUT',
//         body: { status },
//       }),
//       invalidatesTags: ['Orders', 'Stats'],
//     }),

//     // Update Restaurant Status
//     updateRestaurantStatus: builder.mutation<void, { restaurantId: number; is_active: boolean }>({
//       query: ({ restaurantId, is_active }) => ({
//         url: `/restaurants/${restaurantId}/status`,
//         method: 'PUT',
//         body: { is_active },
//       }),
//       invalidatesTags: ['Restaurants', 'Stats'],
//     }),

//     // Update Menu Item Status
//     updateMenuItemStatus: builder.mutation<void, { menuItemId: number; is_available: boolean }>({
//       query: ({ menuItemId, is_available }) => ({
//         url: `/menu-items/${menuItemId}/status`,
//         method: 'PUT',
//         body: { is_available },
//       }),
//       invalidatesTags: ['MenuItems', 'Stats'],
//     }),

//     // Update User Status
//     updateUserStatus: builder.mutation<void, { userId: number; status: string }>({
//       query: ({ userId, status }) => ({
//         url: `/customers/${userId}/status`,
//         method: 'PUT',
//         body: { status },
//       }),
//       invalidatesTags: ['Customers', 'Stats'],
//     }),
//   }),
// });


// // Export all hooks 


// export const {
//   // User endpoints
//   useGetUserProfileQuery,
//   useGetUserStatsQuery,
//   useGetRecentOrdersQuery,
//   useUpdateUserProfileMutation,
//   useGetUserOrdersQuery,
//   useGetOrderDetailsQuery,
//   useCreateOrderMutation,
//   useCancelOrderMutation,
//   useGetFavoritesQuery,
//   useAddToFavoritesMutation,
//   useRemoveFromFavoritesMutation,
//   useGetRestaurantsQuery,
//   useGetRestaurantDetailsQuery,
//   useGetMenuItemsQuery,
//   useGetMenuItemDetailsQuery,
//   useGetCategoriesQuery,
//   useGetUserReviewsQuery,
//   useCreateReviewMutation,
//   useUpdateReviewMutation,
//   useDeleteReviewMutation,
//   useSearchAllQuery,
//       // Cart
//     useGetCartQuery,
//     useAddToCartMutation,
//     useUpdateCartItemMutation,
//     useRemoveFromCartMutation,
//     useClearCartMutation,
    
// } = UserApi;

// export const {
//   // Admin endpoints
//   useGetAdminStatsQuery,
//   useGetAllCustomersQuery,
//   useGetAllRestaurantsQuery,
//   useGetAllOrdersQuery,
//   useGetAllMenuItemsQuery,
//   useUpdateOrderStatusMutation,
//   useUpdateRestaurantStatusMutation,
//   useUpdateMenuItemStatusMutation,
//   useUpdateUserStatusMutation,
// } = AdminApi;

