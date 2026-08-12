import axios, { type AxiosError } from 'axios';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export interface InquiryListingReference {
  _id: string;
  title?: string;
}

export interface InquirySender {
  _id: string;
  username?: string;
  email?: string;
}

export interface Inquiry {
  _id: string;
  listing?: InquiryListingReference | string;
  sender?: InquirySender | string;
  message: string;
  status: 'pending' | 'responded' | 'closed' | string;
  response?: string;
}

interface InquiriesState {
  myInquiries: Inquiry[];
  listingInquiries: Inquiry[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: InquiriesState = {
  myInquiries: [],
  listingInquiries: [],
  loading: false,
  error: null,
  success: null,
};

export const sendInquiry = createAsyncThunk<
  Inquiry,
  { listingId: string; message: string },
  { rejectValue: string }
>('inquiries/send', async ({ listingId, message }, { rejectWithValue }) => {
  try {
    const res = await api.post('/inquiries', { listingId, message });
    return res.data.inquiry;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send inquiry'
      );
    }
    return rejectWithValue('Failed to send inquiry');
  }
});

export const fetchMyInquiries = createAsyncThunk<
  Inquiry[],
  void,
  { rejectValue: string }
>('inquiries/fetchMine', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/inquiries/mine');
    return res.data.inquiries;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load inquiries'
      );
    }
    return rejectWithValue('Failed to load inquiries');
  }
});

export const fetchListingInquiries = createAsyncThunk<
  Inquiry[],
  string,
  { rejectValue: string }
>('inquiries/fetchForListing', async (listingId, { rejectWithValue }) => {
  try {
    const res = await api.get(`/inquiries/listing/${listingId}`);
    return res.data.inquiries;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to load inquiries'
      );
    }
    return rejectWithValue('Failed to load inquiries');
  }
});

export const respondToInquiry = createAsyncThunk<
  Inquiry,
  { id: string; response: string },
  { rejectValue: string }
>('inquiries/respond', async ({ id, response }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/inquiries/${id}/respond`, { response });
    return res.data.inquiry;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to send response'
      );
    }
    return rejectWithValue('Failed to send response');
  }
});

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
        state.error = action.payload ?? 'Failed to send inquiry';
      })
      .addCase(fetchMyInquiries.fulfilled, (state, action) => {
        state.myInquiries = action.payload;
      })
      .addCase(fetchListingInquiries.fulfilled, (state, action) => {
        state.listingInquiries = action.payload;
      })
      .addCase(respondToInquiry.fulfilled, (state, action) => {
        const index = state.listingInquiries.findIndex(
          (i) => i._id === action.payload._id
        );
        if (index !== -1) state.listingInquiries[index] = action.payload;
      });
  },
});

export const { clearInquirySuccess } = inquirySlice.actions;
export default inquirySlice.reducer;
