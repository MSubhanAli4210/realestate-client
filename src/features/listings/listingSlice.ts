import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";
import type { RootState } from "../../app/store";
import axios from "axios";

export interface Listing {
  _id: string;
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  images: string[];
  owner?:
    | {
        _id: string;
        username?: string;
        email?: string;
        [key: string]: unknown;
      }
    | string;
  [key: string]: unknown;
}

export interface CreateListingData {
  title: string;
  location: string;
  price: number;
  bedrooms: number;
  images: string[];
}

export interface UpdateListingData {
  id: string;
  data: CreateListingData;
}

interface ListingsState {
  listings: Listing[];
  myListings: Listing[];
  currentListing: Listing | null;
  loading: boolean;
  error: string | null;
}

const initialState: ListingsState = {
  listings: [],
  myListings: [],
  currentListing: null,
  loading: false,
  error: null,
};

// Fetch all listings
export const fetchListings = createAsyncThunk<
  Listing[],
  void,
  { rejectValue: string }
>("listings/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/listings");
    return res.data.listings;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load listings"
      );
    }

    return rejectWithValue("Failed to load listings");
  }
});

// Fetch one listing
export const fetchListingById = createAsyncThunk<
  Listing,
  string,
  { rejectValue: string }
>("listings/fetchOne", async (id, { rejectWithValue }) => {
  try {
    const res = await api.get(`/listings/${id}`);
    return res.data.listing;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load listing"
      );
    }

    return rejectWithValue("Failed to load listing");
  }
});

// Create listing
export const createListing = createAsyncThunk<
  Listing,
  CreateListingData,
  { rejectValue: string }
>("listings/create", async (listingData, { rejectWithValue }) => {
  try {
    const res = await api.post("/listings", listingData);
    return res.data.listing;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create listing"
      );
    }

    return rejectWithValue("Failed to create listing");
  }
});

// Delete listing
export const deleteListing = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("listings/delete", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/listings/${id}`);
    return id;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete listing"
      );
    }

    return rejectWithValue("Failed to delete listing");
  }
});

// Fetch user's listings
export const fetchMyListings = createAsyncThunk<
  Listing[],
  void,
  {
    state: RootState;
    rejectValue: string;
  }
>("listings/fetchMine", async (_, { rejectWithValue, getState }) => {
  try {
    const res = await api.get("/listings");

    const userId = getState().auth.user?.id;

    return res.data.listings.filter((listing: Listing) => {
      const ownerId =
        typeof listing.owner === "object"
          ? listing.owner?._id
          : listing.owner;

      return String(ownerId) === String(userId);
    });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load your listings"
      );
    }

    return rejectWithValue("Failed to load your listings");
  }
});

// Update listing
export const updateListing = createAsyncThunk<
  Listing,
  UpdateListingData,
  { rejectValue: string }
>("listings/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await api.put(`/listings/${id}`, data);
    return res.data.listing;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to update listing"
      );
    }

    return rejectWithValue("Failed to update listing");
  }
});

const listingSlice = createSlice({
  name: "listings",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // FETCH LISTINGS
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
        state.error = action.payload ?? "Failed to load listings";
      })

      // FETCH ONE LISTING
      .addCase(fetchListingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchListingById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentListing = action.payload;
      })

      .addCase(fetchListingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load listing";
      })

      // CREATE LISTING
      .addCase(createListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createListing.fulfilled, (state, action) => {
        state.loading = false;
        state.listings.unshift(action.payload);
        state.myListings.unshift(action.payload);
      })

      .addCase(createListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to create listing";
      })

      // DELETE LISTING
      .addCase(deleteListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteListing.fulfilled, (state, action) => {
        state.loading = false;

        state.listings = state.listings.filter(
          (listing) => listing._id !== action.payload
        );

        state.myListings = state.myListings.filter(
          (listing) => listing._id !== action.payload
        );

        if (state.currentListing?._id === action.payload) {
          state.currentListing = null;
        }
      })

      .addCase(deleteListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to delete listing";
      })

      // UPDATE LISTING
      .addCase(updateListing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateListing.fulfilled, (state, action) => {
        state.loading = false;

        state.currentListing = action.payload;

        const index = state.listings.findIndex(
          (listing) => listing._id === action.payload._id
        );

        if (index !== -1) {
          state.listings[index] = action.payload;
        }

        const myListingIndex = state.myListings.findIndex(
          (listing) => listing._id === action.payload._id
        );

        if (myListingIndex !== -1) {
          state.myListings[myListingIndex] = action.payload;
        }
      })

      .addCase(updateListing.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to update listing";
      })

      // MY LISTINGS
      .addCase(fetchMyListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchMyListings.fulfilled, (state, action) => {
        state.loading = false;
        state.myListings = action.payload;
      })

      .addCase(fetchMyListings.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Failed to load your listings";
      });
  },
});

export default listingSlice.reducer;