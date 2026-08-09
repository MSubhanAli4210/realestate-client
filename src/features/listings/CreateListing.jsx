import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createListing } from './listingSlice';
import PageHeader from '../../components/PageHeader';

export default function CreateListing() {
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    price: '',
    bedrooms: '',
    images: '',
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.listings);

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

    const result = await dispatch(createListing(payload));
    if (createListing.fulfilled.match(result)) {
      navigate(`/listings/${result.payload._id}`);
    }
  };

  return (<>
    <PageHeader eyebrow="New listing" title="List a new property" subtitle="Fill in the details below — you can edit this anytime." />
    <div className="max-w-xl mx-auto px-6 py-12">

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
            placeholder="https://... , https://..."
            className="w-full border-b-2 border-ink/10 focus:border-brass outline-none py-2 bg-transparent"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-stone py-3 font-medium tracking-wide hover:bg-brass transition-colors disabled:opacity-50"
        >
          {loading ? 'Publishing...' : 'Publish listing'}
        </button>
      </form>
    </div>
    </>
  );
}