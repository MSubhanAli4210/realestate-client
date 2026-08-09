import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchListingById, deleteListing } from "./listingSlice";
import { useNavigate } from "react-router-dom";

import { addFavourite } from "../favourites/favouriteSlice";

export default function ListingDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentListing, loading } = useSelector((state) => state.listings);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchListingById(id));
  }, [dispatch, id]);

  const isOwner =
    currentListing?.owner?._id === user?.id ||
    currentListing?.owner === user?.id;

  const handleDelete = async () => {
    if (!window.confirm("Delete this listing?")) return;
    const result = await dispatch(deleteListing(id));
    if (deleteListing.fulfilled.match(result)) {
      navigate("/");
    }
  };

  if (loading || !currentListing) {
    return <p className="p-8 text-slate">Loading...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="aspect-[16/9] bg-white rounded-2xl mb-8 overflow-hidden">
        {currentListing.images?.[0] ? (
          <img
            src={currentListing.images[0]}
            alt={currentListing.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate/40">
            No image
          </div>
        )}
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="font-display text-4xl text-ink mb-2">
            {currentListing.title}
          </h1>
          <p className="text-slate">{currentListing.location}</p>
        </div>
        <span className="font-display text-3xl text-brass">
          ${currentListing.price?.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-6 text-sm text-slate border-y border-ink/10 py-4 mb-6">
        <span>{currentListing.bedrooms} bedrooms</span>
        <span>Listed by {currentListing.owner?.username || "Unknown"}</span>
      </div>

      {isOwner && (
        <div className="flex gap-3 mb-8">
          <Link
            to={`/listings/${id}/edit`}
            className="bg-ink text-stone px-5 py-2 text-sm font-medium hover:bg-brass transition-colors"
          >
            Edit listing
          </Link>
          <button
            onClick={handleDelete}
            className="border border-red-600 text-red-600 px-5 py-2 text-sm font-medium hover:bg-red-600 hover:text-white transition-colors"
          >
            Delete listing
          </button>
          
        </div>
      )}
      {!isOwner && (
            <button
              onClick={() => dispatch(addFavourite(currentListing._id))}
              className="bg-stone border border-brass text-ink px-5 py-2 text-sm font-medium hover:bg-brass transition-colors mb-8"
            >
              ♡ Save to favourites
            </button>
          )}
    </div>
  );
}
