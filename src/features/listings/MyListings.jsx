import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyListings } from './listingSlice';
import ListingCard from './ListingCard';
import PageHeader from '../../components/PageHeader';

export default function MyListings() {
  const dispatch = useDispatch();
  const { myListings, loading } = useSelector((state) => state.listings);

  useEffect(() => {
    dispatch(fetchMyListings());
  }, [dispatch]);

  return (
    <div>
      <PageHeader
        eyebrow={`${myListings.length} listing${myListings.length !== 1 ? 's' : ''}`}
        title="My Listings"
        subtitle="Manage the properties you've posted."
        action={
          <Link
            to="/listings/new"
            className="bg-brass text-ink px-6 py-3 font-medium hover:bg-stone transition-colors"
          >
            + New Listing
          </Link>
        }
      />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading && <p className="text-slate">Loading...</p>}

        {!loading && myListings.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate mb-4">
              You haven't listed any properties yet.
            </p>
            <Link to="/listings/new" className="text-brass hover:underline">
              List your first property →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myListings.map((listing) => (
            <ListingCard key={listing._id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}