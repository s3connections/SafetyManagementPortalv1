import { configureStore } from '@reduxjs/toolkit';
import incidentReducer   from './slices/incidentSlice';
import roleReducer from './slices/roleSlice';

const store = configureStore({
  reducer: {
    incident: incidentReducer,
    // add audit, permit slices later
    role: roleReducer,
  }
});

export default store;
