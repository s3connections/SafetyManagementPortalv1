import { configureStore } from '@reduxjs/toolkit';
import incidentReducer from './slices/incidentSlice';
import auditReducer from './slices/auditSlice';
import permitReducer from './slices/permitSlice';
import investigationReducer from './slices/investigationSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    incidents: incidentReducer,
    audits: auditReducer,
    permits: permitReducer,
    investigations: investigationReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;