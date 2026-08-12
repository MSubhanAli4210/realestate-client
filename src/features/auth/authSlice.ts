import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { AxiosError } from 'axios';

interface User {
  _id: string;
  username: string;
  email: string;
  [key: string]: unknown;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

interface AuthFormData {
  email: string;
  password: string;
  username?: string;
}

interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

interface ErrorResponse {
  message?: string;
}

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('token');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  loading: false,
  error: null,
};

export const signup = createAsyncThunk<
  AuthResponse,
  AuthFormData,
  { rejectValue: string }
>(
  'auth/signup',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>(
        '/auth/register',
        formData
      );

      return res.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;

      return rejectWithValue(
        error.response?.data?.message || 'Signup failed'
      );
    }
  }
);

export const login = createAsyncThunk<
  AuthResponse,
  AuthFormData,
  { rejectValue: string }
>(
  'auth/login',
  async (formData, { rejectWithValue }) => {
    try {
      const res = await api.post<AuthResponse>(
        '/auth/login',
        formData
      );

      return res.data;
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;

      return rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;

      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },

  extraReducers: (builder) => {
    builder

      // SIGNUP
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem(
          'token',
          action.payload.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(action.payload.user)
        );
      })

      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Signup failed';
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;
        state.token = action.payload.token;

        localStorage.setItem(
          'token',
          action.payload.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(action.payload.user)
        );
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed';
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;