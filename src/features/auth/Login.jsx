import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { login } from './authSlice.js';
import AuthLayout from '../../components/AuthLayout';
import FormField from '../../components/FormField';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) navigate('/');
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to manage your listings and inquiries."
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <p className="text-red-600 text-sm mb-4 -mt-2">{error}</p>
        )}

        <FormField
          label="Email"
          type="email"
          name="email"
          placeholder="jane@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <FormField
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-stone py-3 mt-2 font-medium tracking-wide hover:bg-brass transition-colors disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>

        <p className="text-sm text-slate text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-brass hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}