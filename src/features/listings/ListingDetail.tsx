import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchListingById, deleteListing } from './listingSlice';
import { addFavourite, removeFavourite, fetchFavourites } from '../favourites/favouriteSlice';
import { fetchListingInquiries, sendInquiry, clearInquirySuccess, respondToInquiry } from '../inquiries/inquirySlice';
import ReviewSection from '../reviews/ReviewSection';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { currentListing, loading } = useAppSelector((state) => state.listings);
  const { user } = useAppSelector((state) => state.auth);
  const { favourites } = useAppSelector((state) => state.favourites);
  const { listingInquiries, loading: inquiryLoading, error: inquiryError, success: inquirySuccess } = useAppSelector((state) => state.inquiries);

  const [message, setMessage] = useState<string>('');
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      dispatch(fetchListingById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(fetchFavourites());
  }, [dispatch]);

  const ownerId =
    typeof currentListing?.owner === 'object'
      ? currentListing.owner?._id
      : currentListing?.owner;

  const isOwner = Boolean(ownerId && user?.id && String(ownerId) === String(user.id));

  useEffect(() => {
    if (isOwner && id) {
      dispatch(fetchListingInquiries(id));
    }
  }, [dispatch, id, isOwner]);

  const existingFavourite = favourites.find((f) => {
    const listingId = typeof f.listing === 'object' ? f.listing._id : f.listing;
    return String(listingId) === String(id);
  });

  const isFavourited = Boolean(existingFavourite);

  const handleFavouriteToggle = async () => {
    if (!currentListing || !id) return;

    if (isFavourited && existingFavourite) {
      await dispatch(removeFavourite(existingFavourite._id));
    } else {
      await dispatch(addFavourite(currentListing._id));
    }

    dispatch(fetchFavourites());
  };

  const handleSendInquiry = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id) return;

    const result = await dispatch(
      sendInquiry({
        listingId: id,
        message,
      })
    );

    if (sendInquiry.fulfilled.match(result)) {
      setMessage('');

      setTimeout(() => {
        dispatch(clearInquirySuccess());
      }, 3000);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    if (!window.confirm('Delete this listing?')) {
      return;
    }

    const result = await dispatch(deleteListing(id));

    if (deleteListing.fulfilled.match(result)) {
      navigate('/');
    }
  };

  const handleRespond = async (inquiryId: string) => {
    const response = replyDrafts[inquiryId];

    if (!response?.trim()) return;

    await dispatch(
      respondToInquiry({
        id: inquiryId,
        response,
      })
    );

    setReplyDrafts((prev) => ({
      ...prev,
      [inquiryId]: '',
    }));
  };

  if (!id || loading || !currentListing) {
    return <p className="p-8 text-slate">Loading...</p>;
  }

  const ownerName =
    typeof currentListing.owner === 'object'
      ? currentListing.owner?.username
      : undefined;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-stretch">

        <div className="lg:col-span-3">
          <div className="h-full min-h-[400px] bg-ink overflow-hidden">
            {currentListing.images?.[0] ? (
              <img
                src={currentListing.images[0]}
                alt={currentListing.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone/30">
                <svg
                  width="48"
                  height="48"
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

                <span className="text-sm mt-3 tracking-wide">No photo yet</span>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h1 className="font-display text-3xl text-ink mb-2">{currentListing.title}</h1>
          <p className="text-slate mb-4">{currentListing.location}</p>
          <span className="font-display text-3xl text-brass block mb-6">
            ${currentListing.price?.toLocaleString()}
          </span>

          <div className="flex gap-6 text-sm text-slate border-y border-ink/10 py-4 mb-6">
            <span>{currentListing.bedrooms} bedrooms</span>
            <span>Listed by {ownerName || 'Unknown'}</span>
          </div>

          {isOwner && (
            <div className="flex gap-3 mb-6">
              <Link to={`/listings/${id}/edit`} className="bg-ink text-stone px-5 py-2 text-sm font-medium hover:bg-brass transition-colors">
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

          {isOwner && (
            <div className="mt-8">
              <h3 className="font-display text-xl text-ink mb-4">
                Inquiries received {listingInquiries.length > 0 && `(${listingInquiries.length})`}
              </h3>

              {listingInquiries.length === 0 ? (
                <p className="text-slate text-sm">No inquiries yet.</p>
              ) : (
                <div className="space-y-3">
                  {listingInquiries.map((inquiry) => {
                    const senderName = typeof inquiry.sender === 'object' ? inquiry.sender.username : undefined;
                    const senderEmail = typeof inquiry.sender === 'object' ? inquiry.sender.email : undefined;

                    return (
                      <div key={inquiry._id} className="bg-white p-4 border border-ink/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-ink text-sm">{senderName || 'Unknown'}</span>
                          <span className="text-xs text-slate">{senderEmail ?? ''}</span>
                        </div>

                        <p className="text-slate text-sm mb-3">{inquiry.message}</p>

                        {inquiry.response ? (
                          <div className="bg-stone p-3 text-sm">
                            <span className="text-xs text-brass font-medium block mb-1">Your reply</span>
                            <p className="text-ink">{inquiry.response}</p>
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={replyDrafts[inquiry._id] || ''}
                              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setReplyDrafts((prev) => ({
                                  ...prev,
                                  [inquiry._id]: e.target.value,
                                }))
                              }
                              placeholder="Write a reply..."
                              className="flex-1 border border-ink/10 focus:border-brass outline-none px-3 py-2 text-sm bg-transparent"
                            />
                            <button
                              onClick={() => handleRespond(inquiry._id)}
                              className="bg-ink text-stone px-4 py-2 text-sm font-medium hover:bg-brass transition-colors"
                            >
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {!isOwner && (
            <>
              <button
                onClick={handleFavouriteToggle}
                className={`w-full px-5 py-2.5 text-sm font-medium mb-4 transition-colors ${
                  isFavourited ? 'bg-brass text-ink hover:bg-red-100 hover:text-red-700' : 'bg-stone border border-brass text-ink hover:bg-brass'
                }`}
              >
                {isFavourited ? '♥ Saved — click to remove' : '♡ Save to favourites'}
              </button>

              <div className="bg-white p-6 border border-ink/10">
                <h3 className="font-display text-xl text-ink mb-4">Interested? Send a message</h3>

                {inquirySuccess && <p className="text-green-700 text-sm mb-3">{inquirySuccess}</p>}
                {inquiryError && <p className="text-red-600 text-sm mb-3">{inquiryError}</p>}

                <form onSubmit={handleSendInquiry}>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    minLength={5}
                    rows={5}
                    placeholder="I'm interested in this property, is it still available?"
                    className="w-full border border-ink/10 focus:border-brass outline-none p-3 text-sm mb-3 bg-transparent resize-none"
                  />
                  <button
                    type="submit"
                    disabled={inquiryLoading}
                    className="w-full bg-ink text-stone px-6 py-2.5 text-sm font-medium hover:bg-brass transition-colors disabled:opacity-50"
                  >
                    {inquiryLoading ? 'Sending...' : 'Send message'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <ReviewSection listingId={id} />
    </div>
  );
}