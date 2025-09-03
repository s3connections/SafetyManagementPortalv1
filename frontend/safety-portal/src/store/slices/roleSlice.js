import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';



export const fetchRoles = createAsyncThunk('role/fetch', async () => {
  const { data } = await api.get('/Role');          // TBD back-end route
  return data.data;                                 // ApiResponse<List<RoleDto>>
});

const slice = createSlice({
  name: 'role',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchRoles.fulfilled, (s, a) => { s.list = a.payload; s.status = 'done'; });
  }
  
});
export default slice.reducer;
