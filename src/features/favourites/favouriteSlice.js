import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  favourites: [],
  loading: false,
  error: null,
};

export const fetchFavourites = createAsyncThunk(
  'favourites/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/favourites');
      return res.data.favourites;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load favourites');
    }
  }
);

export const addFavourite = createAsyncThunk(
  'favourites/add',
  async (listingId, { rejectWithValue }) => {
    try {
      const res = await api.post('/favourites', { listingId });
      return res.data.favourite;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add favourite');
    }
  }
);

export const removeFavourite = createAsyncThunk(
  'favourites/remove',
  async (favouriteId, { rejectWithValue }) => {
    try {
      await api.delete(`/favourites/${favouriteId}`);
      return favouriteId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove favourite');
    }
  }
);

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
        state.error = action.payload;
      })
      .addCase(addFavourite.fulfilled, (state, action) => {
        state.favourites.push(action.payload);
      })
      .addCase(removeFavourite.fulfilled, (state, action) => {
        state.favourites = state.favourites.filter(
          (f) => f._id !== action.payload
        );
      });
  },
});

export default favouriteSlice.reducer;