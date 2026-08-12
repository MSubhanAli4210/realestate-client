import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchReviewsForListing, createReview, deleteReview } from './reviewSlice';

interface ReviewSectionProps {
  listingId: string;
}

interface Review {
  _id: string;
  rating: number;
  comment?: string;
  reviewer?: { _id: string; username?: string } | string;
}

export default function ReviewSection({ listingId }: ReviewSectionProps) {
  const dispatch = useAppDispatch();
  const { reviews, loading, error } = useAppSelector((state) => state.reviews);
  const { user } = useAppSelector((state) => state.auth);

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');

  useEffect(() => {
    dispatch(fetchReviewsForListing(listingId));
  }, [dispatch, listingId]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await dispatch(createReview({ listingId, rating, comment }));
    if (createReview.fulfilled.match(result)) {
      setComment('');
      setRating(5);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this review?')) {
      dispatch(deleteReview(id));
    }
  };

  const alreadyReviewed = reviews.some((review) => {
    if (typeof review.reviewer === 'object') {
      return review.reviewer._id === user?.id;
    }
    return review.reviewer === user?.id;
  });

  return (
    <div className="mt-12 pt-10 border-t border-ink/10">
      <h2 className="font-display text-2xl text-ink mb-6">
        Reviews {reviews.length > 0 && `(${reviews.length})`}
      </h2>

      {user && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="bg-white p-6 border border-ink/10 mb-8">
          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <label className="block mb-4">
            <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-2">
              Rating
            </span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? 'text-brass' : 'text-ink/15'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </label>

          <label className="block mb-4">
            <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-2">
              Comment
            </span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience with this listing..."
              className="w-full border border-ink/10 focus:border-brass outline-none p-3 text-sm bg-transparent resize-none"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-stone px-5 py-2 text-sm font-medium hover:bg-brass transition-colors disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit review'}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-slate text-sm">No reviews yet.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review._id} className="border-b border-ink/10 pb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-ink text-sm">
                  {typeof review.reviewer === 'object' ? review.reviewer.username ?? 'Anonymous' : 'Anonymous'}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-brass text-sm">
                    {'★'.repeat(review.rating)}
                    <span className="text-ink/15">
                      {'★'.repeat(5 - review.rating)}
                    </span>
                  </span>
                  {(typeof review.reviewer === 'object' ? review.reviewer._id === user?.id : review.reviewer === user?.id) && (
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {review.comment && (
                <p className="text-slate text-sm">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}