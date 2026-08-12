import { useEffect } from "react";
import { Link } from "react-router-dom";

import { fetchListings } from "./listingSlice";
import ListingCard from "./ListingCard";

import {
  useAppDispatch,
  useAppSelector,
} from "../../app/hooks";

export default function ListingFeed() {
  const dispatch = useAppDispatch();

  const { listings, loading, error } = useAppSelector(
    (state) => state.listings
  );

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <div className="bg-ink text-stone px-6 py-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <span className="text-brass text-xs tracking-[0.2em] uppercase mb-4 block">
            {listings.length} propert
            {listings.length === 1 ? "y" : "ies"} available
          </span>

          <h1 className="font-display text-5xl lg:text-6xl leading-[1.05] font-medium max-w-2xl">
            Find your next place to call home.
          </h1>

          <p className="text-stone/60 mt-4 max-w-md">
            Browse listings from real owners, or list your own in minutes.
          </p>

          <Link
            to="/listings/new"
            className="inline-block mt-8 bg-brass text-ink px-6 py-3 font-medium hover:bg-stone transition-colors"
          >
            List a property
          </Link>
        </div>

        <svg
          className="absolute bottom-0 right-0 w-1/2 opacity-[0.06]"
          viewBox="0 0 500 200"
          fill="none"
        >
          <path
            d="M0 200V120H40V80H80V140H120V60H160V150H200V40H240V130H280V90H320V160H360V70H400V140H440V100H480V180H500V200H0Z"
            fill="currentColor"
          />
        </svg>
      </div>

      {/* Listings */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading && (
          <p className="text-slate">
            Loading listings...
          </p>
        )}

        {error && (
          <p className="text-red-600">
            {error}
          </p>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate mb-4">
              No listings yet.
            </p>

            <Link
              to="/listings/new"
              className="text-brass hover:underline"
            >
              Be the first to post one →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
            />
          ))}
        </div>
      </div>
    </div>
  );
}