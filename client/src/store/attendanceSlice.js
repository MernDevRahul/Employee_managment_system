import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

// Employee marks attendance
export const markAttendance = createAsyncThunk(
  'attendance/mark',
  async (_, thunkAPI) => {
    try {
      await axios.post('/attendance/mark');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Mark failed');
    }
  }
);

// Fetch own attendance
export const fetchMyAttendance = createAsyncThunk(
  'attendance/fetchMy',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/attendance/me');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to load attendance');
    }
  }
);

// Fetch team attendance (manager)
export const fetchTeamAttendance = createAsyncThunk(
  'attendance/team',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/attendance/team'); // you’ll need this backend route
      console.log(res.data)
      
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to load team attendance');
    }
  }
);

// Fetch all attendance (admin)
export const fetchAllAttendance = createAsyncThunk(
  'attendance/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get('/attendance/all');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to load all attendance');
    }
  }
);

const slice = createSlice({
  name: 'attendance',
  initialState: {
    me: [], team: [], all: [],
    loading: false, error: null,
    marked: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(markAttendance.fulfilled, state => { state.marked = true; })
      .addCase(fetchMyAttendance.fulfilled, (state, { payload }) => {
        state.me = payload; state.loading = false;
      })
      .addCase(fetchTeamAttendance.fulfilled, (state, { payload }) => {
        state.team = payload; state.loading = false;
      })
      .addCase(fetchAllAttendance.fulfilled, (state, { payload }) => {
        state.all = payload; state.loading = false;
      })
      .addMatcher(
        action => action.type.startsWith('attendance/') && action.type.endsWith('/pending'),
        state => { state.loading = true; state.error = null; }
      )
      .addMatcher(
        action => action.type.startsWith('attendance/') && action.type.endsWith('/rejected'),
        (state, action) => { state.loading = false; state.error = action.payload; }
      );
  }
});

export default slice.reducer;