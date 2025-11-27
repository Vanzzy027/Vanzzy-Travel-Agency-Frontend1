export type UserFormValues={
    email: string; 
    password: string;
    first_name:string;
    last_name:string;
    phone_number:string
}

export interface User{
    user_id:number;
    first_name:string;
    last_name:string;
    email:string;
    phone_number:string;
    created_at:string;
    user_type:string
}


export interface MenuItem {
    menu_item_id: number;
    name: string;
    description: string;
    // backend can return null or omit some fields — keep these optional/nullable
    category_name?: string | null;
    price: number;
    menuitemimage_url?: string | null;
    is_available?: boolean;
    quantity?: number;
    // prep time from backend can be a string or number or undefined
    prep_time?: string | number;
    rating?: number;
}

export interface DashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalMenuItems: number;
}

export interface OrderData {
    order_id: number;
    customer_id: number;
    total_amount: number;
    order_type:'dine_in' | 'takeaway' | 'delivery'
    status: 'pending' | 'confirmed' | 'preparing' | 'Cancelled'| 'completed';
    created_at: string;
}

export interface RecentOrder {
    id: number;
    customer: string;
    amount: number;
    status: 'Delivered' | 'Preparing' | 'Ready' | 'Cancelled';
    time: string;
}












// export interface MenuItem {
//     menu_item_id: number;
//     name: string;
//     description: string;
//     price: number;
//     category_name: string | null;
//     menuitemimage_url: string | null;
//     is_available: boolean;
//     quantity: number | undefined; 
//     rating: number | undefined;
//     prep_time: string | undefined;
// }


//  //Definition for a cart item, used when adding an item to the Redux cart slice.

// export interface CartItem {
//     menu_item_id: number;
//     name: string;
//     description: string;
//     category: string; 
//     unit_price: number;
//     image_url: string; 
// }

