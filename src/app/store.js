import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import listingReducer from '../features/listings/listingSlice';
import favouriteReducer from '../features/favourites/favouriteSlice';
import inquiryReducer from '../features/inquiries/inquirySlice';
import reviewReducer from '../features/reviews/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    listings: listingReducer,
    favourites: favouriteReducer,
    inquiries: inquiryReducer,
    reviews: reviewReducer,
  },
});