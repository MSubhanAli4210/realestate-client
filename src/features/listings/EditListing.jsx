import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchListingById, updateListing } from './listingSlice';
import PageHeader from '../../components/PageHeader';

export default function EditListing() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentListing, loading, error } = useSelector((state) => state.listings);

  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    bedrooms: '',
    images: '',
  });

  useEffect(() => {
    dispatch(fetchListingById(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (currentListing) {
      setFormData({
        title: currentListing.title || '',
        location: currentListing.location || '',
        price: currentListing.price || '',
        bedrooms: currentListing.bedrooms || '',
        images: currentListing.images?.join(', ') || '',
      });
    }
  }, [currentListing]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      location: formData.location,
      price: Number(formData.price),
      bedrooms: Number(formData.bedrooms),
      images: formData.images
        ? formData.images.split(',').map((url) => url.trim())
        : [],
    };

    const result = await dispatch(updateListing({ id, data: payload }));
    if (updateListing.fulfilled.match(result)) {
      navigate(`/listings/${id}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
     <PageHeader eyebrow="New listing" title="List a new property" subtitle="Fill in the details below — you can edit this anytime." />

      <form onSubmit={handleSubmit} className="bg-white p-8 relative">
        <span className="absolute -top-3 -left-3 w-6 h-6 border-t-2 border-l-2 border-brass" />
        <span className="absolute -top-3 -right-3 w-6 h-6 border-t-2 border-r-2 border-brass" />
        <span className="absolute -bottom-3 -left-3 w-6 h-6 border-b-2 border-l-2 border-brass" />
        <span className="absolute -bottom-3 -right-3 w-6 h-6 border-b-2 border-r-2 border-brass" />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <label className="block mb-5">
          <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">
            Title
          </span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border-b-2 border-ink/10 focus:border-brass outline-none py-2 bg-transparent"
          />
        </label>

        <label className="block mb-5">
          <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">
            Location
          </span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full border-b-2 border-ink/10 focus:border-brass outline-none py-2 bg-transparent"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="block mb-5">
            <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">
              Price ($)
            </span>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              className="w-full border-b-2 border-ink/10 focus:border-brass outline-none py-2 bg-transparent"
            />
          </label>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">
              Bedrooms
            </span>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              required
              min="0"
              className="w-full border-b-2 border-ink/10 focus:border-brass outline-none py-2 bg-transparent"
            />
          </label>
        </div>

        <label className="block mb-6">
          <span className="block text-xs font-medium text-slate uppercase tracking-wide mb-1.5">
            Image URLs (comma separated)
          </span>
          <input
            type="text"
            name="images"
            value={formData.images}
            onChange={handleChange}
            className="w-full border-b-2 border-ink/10 focus:border-brass outline-none py-2 bg-transparent"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-stone py-3 font-medium tracking-wide hover:bg-brass transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save changes'}
        </button>
      </form>
    </div>
  );
}