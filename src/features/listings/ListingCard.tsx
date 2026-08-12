import { Link } from "react-router-dom";
import type { Listing } from "./listingSlice";

interface ListingCardProps {
  listing: Listing;
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <Link
      to={`/listings/${listing._id}`}
      className="block bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 group"
    >
      <div className="aspect-[4/3] bg-ink relative overflow-hidden">
        {listing.images?.[0] ? (
          <img
            src={listing.images[0]}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-stone/30">
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="text-xs mt-2 tracking-wide">No photo yet</span>
          </div>
        )}

        <span className="absolute top-3 left-3 bg-brass text-ink text-xs font-medium px-2.5 py-1 tracking-wide">
          ${listing.price?.toLocaleString()}
        </span>
      </div>

      <div className="p-5 border border-t-0 border-ink/10 group-hover:border-brass/40 transition-colors">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-xl text-ink mb-1 truncate">
              {listing.title}
            </p>
            <p className="text-slate text-sm mb-3">{listing.location}</p>
          </div>
          <span className="text-brass text-xl shrink-0 transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate">
          <span className="w-1 h-1 rounded-full bg-brass" />
          <span>
            {listing.bedrooms} bedroom{listing.bedrooms !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </Link>
  );
}
