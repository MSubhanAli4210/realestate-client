import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyInquiries } from './inquirySlice';
import PageHeader from '../../components/PageHeader';

export default function MyInquiries() {
  const dispatch = useDispatch();
  const { myInquiries, loading } = useSelector((state) => state.inquiries);

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
          {myInquiries.map((inquiry) => (
            <div key={inquiry._id} className="bg-white p-5 border border-ink/10">
              <div className="flex items-center justify-between mb-2">
                <Link
                  to={`/listings/${inquiry.listing?._id}`}
                  className="font-display text-lg text-ink hover:text-brass transition-colors"
                >
                  {inquiry.listing?.title || 'Listing removed'}
                </Link>
                <span
                  className={`text-xs px-2 py-1 ${
                    inquiry.status === 'pending'
                      ? 'bg-stone text-slate'
                      : 'bg-brass/20 text-brass'
                  }`}
                >
                  {inquiry.status}
                </span>
              </div>
              <p className="text-slate text-sm">{inquiry.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}