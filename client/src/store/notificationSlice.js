import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../utils/axios";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async (__dirname, thunkAPI) => {
    try {
      const res = await axios.get("/notifications/my");
      console.log(res);
      
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("Failed to load notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notifications/markRead",
  async (id, thunkAPI) => {
    try {
      const res = await axios.put(`/notifications/read/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to mark as read');
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(markNotificationRead.fulfilled,(state, action)=>{
        const id = action.payload;
        const notif = state.list.find((n)=>n.id==id);
        if(notif) notif.is_read = true;
      })
  },
});

export default notificationSlice.reducer;
