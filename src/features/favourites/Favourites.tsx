import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchFavourites, removeFavourite, type Favourite } from './favouriteSlice';
import PageHeader from '../../components/PageHeader';

function getListingId(listing: Favourite['listing']): string | undefined {
  if (!listing) return undefined;
  return typeof listing === 'object' ? listing._id : listing;
}

function getListingField<T>(listing: Favourite['listing'], selector: (listing: Exclude<Favourite['listing'], string>) => T, fallback: T): T {
  if (typeof listing === 'object') {
    return selector(listing);
  }
  return fallback;
}

export default function Favourites() {
  const dispatch = useAppDispatch();
  const { favourites, loading } = useAppSelector((state) => state.favourites);

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
          {favourites.map((fav) => {
            const listingId = getListingId(fav.listing);
            const title = getListingField(fav.listing, (listing) => listing.title, 'Listing removed');
            const location = getListingField(fav.listing, (listing) => listing.location, 'Unknown location');
            const price = getListingField(fav.listing, (listing) => listing.price, 0);
            const imageUrl = getListingField(fav.listing, (listing) => listing.images?.[0] ?? '', '');

            return (
              <div key={fav._id} className="relative group">
                <Link
                  to={listingId ? `/listings/${listingId}` : '#'}
                  className="block bg-white shadow-sm hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-[4/3] bg-ink relative overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone/30 text-sm">
                        No photo
                      </div>
                    )}
                    <span className="absolute top-3 left-3 bg-brass text-ink text-xs font-medium px-2.5 py-1">
                      ${price?.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-5 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-display text-xl text-ink mb-1 truncate">{title}</p>
                      <p className="text-slate text-sm">{location}</p>
                    </div>
                    <span className="text-brass text-xl shrink-0 transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </div>
                </Link>
                <button
                  onClick={() => dispatch(removeFavourite(fav._id))}
                  className="absolute top-3 right-3 bg-ink/80 text-stone text-xs px-3 py-1.5 hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
