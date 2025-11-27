import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/slice/AuthSlice';
import { AuthApi } from '../features/api/AuthAPI';
import { vehicleApi } from '../features/api/VehicleAPI';
import { BookingApi } from '../features/api/BookingApi';

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
    [BookingApi.reducerPath]: BookingApi.reducer, 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(AuthApi.middleware)
    .concat(vehicleApi.middleware)
    .concat(BookingApi.middleware),
});

export const persistor = persistStore(store);
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
