import axios from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface ReviewReviewer {
  _id: string;
  username?: string;
}

export interface Review {
  _id: string;
  rating: number;
  comment?: string;
  reviewer?: ReviewReviewer | string;
}

interface ReviewsState {
  reviews: Review[];
  loading: boolean;
  error: string | null;
}

const initialState: ReviewsState = {
  reviews: [],
  loading: false,
  error: null,
};

export const fetchReviewsForListing = createAsyncThunk<
  Review[],
  string,
  { rejectValue: string }
>('reviews/fetchForListing', async (listingId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/reviews/listing/${listingId}`);
    return res.data.reviews;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load reviews');
    }
    return rejectWithValue('Failed to load reviews');
  }
});

export const createReview = createAsyncThunk<
  Review,
  { listingId: string; rating: number; comment: string },
  { rejectValue: string }
>('reviews/create', async ({ listingId, rating, comment }, { rejectWithValue }) => {
  try {
    const res = await api.post('/reviews', { listingId, rating, comment });
    return res.data.review;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to submit review');
    }
    return rejectWithValue('Failed to submit review');
  }
});

export const deleteReview = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>('reviews/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/reviews/${id}`);
    return id;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete review');
    }
    return rejectWithValue('Failed to delete review');
  }
});

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
        state.error = action.payload ?? 'Failed to load reviews';
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.reviews.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.error = action.payload ?? 'Failed to submit review';
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((r) => r._id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;