import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import listingReducer from '../features/listings/listingSlice';
import favouriteReducer from '../features/favourites/favouriteSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingReducer,
    favourites: favouriteReducer,
  },
});