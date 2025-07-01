import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export const fetchCurrentUser = createAsyncThunk('auth/me', async(__dirname, thunkAPI)=>{
    try {
        const res = await axios.get("/auth/me");        
        return res.data;
        
    } catch (error) {
        return thunkAPI.rejectWithValue(error?.response?.data?.message);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            state.user = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCurrentUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(fetchCurrentUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});


export const { logout } = authSlice.actions;
export default authSlice.reducer;