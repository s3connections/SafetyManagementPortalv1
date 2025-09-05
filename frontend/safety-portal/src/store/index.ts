import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authSlice from '../store/slices/authSlice';
import observationSlice from '../store/slices/observationSlice';
import auditSlice from '../store/slices/auditSlice';
import permitSlice from '../store/slices/permitSlice';
import notificationSlice from '../store/slices/notificationSlice';
import uiSlice from '../store/slices/uiSlice';

const store = configureStore({
  reducer: {
    auth: authSlice,
    observations: observationSlice,
    audits: auditSlice,
    permits: permitSlice,
    notifications: notificationSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
