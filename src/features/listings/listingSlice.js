import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

const initialState = {
  listings: [],
  myListings: [],
  currentListing: null,
  loading: false,
  error: null,
};

export const fetchListings = createAsyncThunk(
  "listings/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/listings");
      return res.data.listings;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load listings",
      );
    }
  },
);

export const fetchListingById = createAsyncThunk(
  "listings/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await api.get(`/listings/${id}`);
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load listing",
      );
    }
  },
);

export const createListing = createAsyncThunk(
  "listings/create",
  async (listingData, { rejectWithValue }) => {
    try {
      const res = await api.post("/listings", listingData);
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create listing",
      );
    }
  },
);

export const deleteListing = createAsyncThunk(
  "listings/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/listings/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete listing",
      );
    }
  },
);

export const fetchMyListings = createAsyncThunk(
  "listings/fetchMine",
  async (_, { rejectWithValue, getState }) => {
    try {
      const res = await api.get("/listings");
      const userId = getState().auth.user?.id;
      return res.data.listings.filter(
        (listing) => (listing.owner?._id || listing.owner) === userId,
      );
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load your listings",
      );
    }
  },
);

export const updateListing = createAsyncThunk(
  "listings/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/listings/${id}`, data);
      return res.data.listing;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update listing",
      );
    }
  },
);

const listingSlice = createSlice({
  name: "listings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchListings.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.currentListing = action.payload;
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.listings.unshift(action.payload);
      })
      .addCase(deleteListing.fulfilled, (state, action) => {
        state.listings = state.listings.filter((l) => l._id !== action.payload);
      })
      .addCase(updateListing.fulfilled, (state, action) => {
        state.currentListing = action.payload;
        const index = state.listings.findIndex(
          (l) => l._id === action.payload._id,
        );
        if (index !== -1) state.listings[index] = action.payload;
      })
      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = action.payload;
      });
  },
});

export default listingSlice.reducer;
