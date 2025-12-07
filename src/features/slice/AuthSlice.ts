// src/features/auth/authSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  photo?: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      
      // Store in localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;




// import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

// interface User {
//   user_id: string;
//   first_name: string;
//   last_name: string;
//   email: string;
//   role: string;
//   status: string;
//   verified: boolean;
//   national_id: string;
//   contact_phone: string;
// }

// interface AuthState {
//   token: string | null;
//   user: User | null;
// }

// const initialState: AuthState = {
//   token: localStorage.getItem('token') || null,
//   user: JSON.parse(localStorage.getItem('user') || 'null'),
// };

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
// setCredentials: (state, action: PayloadAction<{ token: string; user: User }>) => {
//   state.token = action.payload.token;
//   state.user = action.payload.user;


//   localStorage.setItem('token', action.payload.token);
//   localStorage.setItem('user', JSON.stringify(action.payload.user));

//     },
//     logout: (state) => {
//       state.token = null;
//       state.user = null;
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//     },
//   },
// });

// export const { setCredentials, logout } = authSlice.actions;
// export default authSlice.reducer;
