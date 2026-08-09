import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchReviewsForListing = createAsyncThunk(
  'reviews/fetchForListing',
  async (listingId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/reviews/listing/${listingId}`);
      return res.data.reviews;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/create',
  async ({ listingId, rating, comment }, { rejectWithValue }) => {
    try {
      const res = await api.post('/reviews', { listingId, rating, comment });
      return res.data.review;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/reviews/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviewsForListing.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewsForListing.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsForListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;