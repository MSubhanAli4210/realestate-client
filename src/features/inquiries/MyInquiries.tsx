import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { fetchMyInquiries, type Inquiry } from './inquirySlice';
import PageHeader from '../../components/PageHeader';

function getListingId(listing: Inquiry['listing']): string | undefined {
  if (!listing) return undefined;
  return typeof listing === 'object' ? listing._id : listing;
}

function getListingTitle(listing: Inquiry['listing']): string {
  if (!listing) return 'Listing removed';
  return typeof listing === 'object' ? listing.title ?? 'Listing removed' : 'Listing removed';
}

export default function MyInquiries() {
  const dispatch = useAppDispatch();
  const { myInquiries, loading } = useAppSelector((state) => state.inquiries);

  useEffect(() => {
    dispatch(fetchMyInquiries());
  }, [dispatch]);

  return (
    <div>
      <PageHeader
        eyebrow={`${myInquiries.length} sent`}
        title="My Inquiries"
        subtitle="Messages you've sent to property owners."
      />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {loading && <p className="text-slate">Loading...</p>}

        {!loading && myInquiries.length === 0 && (
          <p className="text-slate text-center py-12">
            You haven't sent any inquiries yet.
          </p>
        )}

        <div className="space-y-4">
          {myInquiries.map((inquiry) => {
            const listingId = getListingId(inquiry.listing);

            return (
              <div key={inquiry._id} className="bg-white p-5 border border-ink/10">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={listingId ? `/listings/${listingId}` : '#'}
                    className="font-display text-lg text-ink hover:text-brass transition-colors"
                  >
                    {getListingTitle(inquiry.listing)}
                  </Link>
                  <span
                    className={`text-xs px-2 py-1 ${
                      inquiry.status === 'pending' ? 'bg-stone text-slate' : 'bg-brass/20 text-brass'
                    }`}
                  >
                    {inquiry.status}
                  </span>
                </div>
                <p className="text-slate text-sm">{inquiry.message}</p>

                {inquiry.response && (
                  <div className="bg-stone p-3 text-sm mt-3">
                    <span className="text-xs text-brass font-medium block mb-1">Owner replied</span>
                    <p className="text-ink">{inquiry.response}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}