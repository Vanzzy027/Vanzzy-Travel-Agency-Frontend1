import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/slice/AuthSlice';
import { AuthApi } from '../features/api/AuthAPI';
import { vehicleApi } from '../features/api/VehicleAPI';
import { bookingApi } from '../features/api/BookingApi';
import { UserApi } from '../features/api/UserApi';
//import userReducer from '../features/user/userSlice';
import { paymentApi } from '../features/api/paymentApi';


const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [vehicleApi.reducerPath]: vehicleApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer, 
    [UserApi.reducerPath]: UserApi.reducer,
     [paymentApi.reducerPath]: paymentApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(AuthApi.middleware)
    .concat(vehicleApi.middleware)
    .concat(bookingApi.middleware)
    .concat(UserApi.middleware)
    .concat(paymentApi.middleware),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
