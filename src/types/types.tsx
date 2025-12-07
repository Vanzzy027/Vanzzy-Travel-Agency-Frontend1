export type UserFormValues={
    email: string; 
    password: string;
    first_name:string;
    last_name:string;
    phone_number:string
}

// user.interface.ts
export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  contact_phone: string;
  address?: string;
  role: 'user' | 'admin' | 'superAdmin';
  status: 'active' | 'inactive' | 'banned';
  verified: boolean;
  national_id: string;
  photo?: string;
  created_at: string;
}










// In your BookingApi.ts or API types file
export type InitializePaymentRequest = {
  booking_id: number;
  user_id: string;
  amount: number;
  payment_method: string;
  payment_status?: string;
  transaction_id?: string;
  transaction_reference?: string;
  phone?: string;
};

export type ReceiptResponse = {
  success: boolean;
  data: {
    payment: {
      payment_id: number;
      payment_date: string;
      payment_method: string;
      transaction_id: string;
      net_amount: number;
      commission_fee: number;
      gross_amount: number;
    };
    booking: {
      booking_id: number;
      total_amount: number;
      booking_date: string;
      return_date: string;
      vehicle_manufacturer: string;
      vehicle_model: string;
      vehicle_year: number;
      license_plate?: string;
      vin_number?: string;
    };
    user: {
      first_name: string;
      last_name: string;
      email: string;
      contact_phone: string;
      address?: string;
    }
  };
};










