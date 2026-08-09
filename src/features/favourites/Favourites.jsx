import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFavourites, removeFavourite } from "./favouriteSlice";
import PageHeader from "../../components/PageHeader";

export default function Favourites() {
  const dispatch = useDispatch();
  const { favourites, loading } = useSelector((state) => state.favourites);

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  return (
    <div>
      <PageHeader
        eyebrow={`${favourites.length} saved`}
        title="Your Favourites"
        subtitle="Properties you've saved to revisit later."
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading && <p className="text-slate">Loading...</p>}

        {!loading && favourites.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate mb-4">No favourites yet.</p>
            <Link to="/" className="text-brass hover:underline">
              Browse listings →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favourites.map((fav) => (
            <div key={fav._id} className="relative group">
              <Link
                to={`/listings/${fav.listing._id}`}
                className="block bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
              >
                <div className="aspect-[4/3] bg-ink relative overflow-hidden">
                  {fav.listing.images?.[0] ? (
                    <img
                      src={fav.listing.images[0]}
                      alt={fav.listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone/30 text-sm">
                      No photo
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-brass text-ink text-xs font-medium px-2.5 py-1">
                    ${fav.listing.price?.toLocaleString()}
                  </span>
                </div>
                <div className="p-5 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-xl text-ink mb-1 truncate">
                      {fav.listing.title}
                    </p>
                    <p className="text-slate text-sm">{fav.listing.location}</p>
                  </div>
                  <span className="text-brass text-xl shrink-0 transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </Link>
              <button
                onClick={() => dispatch(removeFavourite(fav._id))}
                className="absolute top-3 right-3 bg-ink/80 text-stone text-xs px-3 py-1.5 hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
