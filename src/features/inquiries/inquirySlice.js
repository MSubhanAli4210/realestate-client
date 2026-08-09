import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

const initialState = {
  myInquiries: [],
  listingInquiries: [],
  loading: false,
  error: null,
  success: null,
};

export const sendInquiry = createAsyncThunk(
  'inquiries/send',
  async ({ listingId, message }, { rejectWithValue }) => {
    try {
      const res = await api.post('/inquiries', { listingId, message });
      return res.data.inquiry;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send inquiry');
    }
  }
);

export const fetchMyInquiries = createAsyncThunk(
  'inquiries/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/inquiries/mine');
      return res.data.inquiries;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load inquiries');
    }
  }
);

export const fetchListingInquiries = createAsyncThunk(
  'inquiries/fetchForListing',
  async (listingId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/inquiries/listing/${listingId}`);
      return res.data.inquiries;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load inquiries');
    }
  }
);

const inquirySlice = createSlice({
  name: 'inquiries',
  initialState,
  reducers: {
    clearInquirySuccess: (state) => {
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendInquiry.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendInquiry.fulfilled, (state) => {
        state.loading = false;
        state.success = 'Inquiry sent successfully';
      })
      .addCase(sendInquiry.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyInquiries.fulfilled, (state, action) => {
        state.myInquiries = action.payload;
      })
      .addCase(fetchListingInquiries.fulfilled, (state, action) => {
        state.listingInquiries = action.payload;
      });
  },
});

export const { clearInquirySuccess } = inquirySlice.actions;
export default inquirySlice.reducer;