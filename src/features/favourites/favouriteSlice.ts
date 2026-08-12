import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';
import type { Listing } from '../listings/listingSlice';

export interface Favourite {
  _id: string;
  listing: Listing | string;
}

interface FavouritesState {
  favourites: Favourite[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouritesState = {
  favourites: [],
  loading: false,
  error: null,
};

export const fetchFavourites = createAsyncThunk<
  Favourite[],
  void,
  { rejectValue: string }
>('favourites/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/favourites');
    return res.data.favourites;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load favourites');
    }
    return rejectWithValue('Failed to load favourites');
  }
});

export const addFavourite = createAsyncThunk<
  Favourite,
  string,
  { rejectValue: string }
>('favourites/add', async (listingId, { rejectWithValue }) => {
  try {
    const res = await api.post('/favourites', { listingId });
    return res.data.favourite;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add favourite');
    }
    return rejectWithValue('Failed to add favourite');
  }
});

export const removeFavourite = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('favourites/remove', async (favouriteId, { rejectWithValue }) => {
  try {
    await api.delete(`/favourites/${favouriteId}`);
    return favouriteId;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove favourite');
    }
    return rejectWithValue('Failed to remove favourite');
  }
});

const favouriteSlice = createSlice({
  name: 'favourites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavourites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavourites.fulfilled, (state, action) => {
        state.loading = false;
        state.favourites = action.payload;
      })
      .addCase(fetchFavourites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load favourites';
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.favourites.push(action.payload);
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter((f) => f._id !== action.payload);
      });
  },
});

export default favouriteSlice.reducer;